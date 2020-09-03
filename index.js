var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

var port = process.env.PORT || 3000; //port to listen on
var app = express();

const botToken = process.env.botToken;
const targetChatId = process.env.targetChatId;
const secret = process.env.botSecret;

const bot = new TelegramBot(botToken, {polling: true});


var KleinanzeigenSchema = new mongoose.Schema({
	text: String
},{
	timestamps: true
});

const mongoUri = process.env.MONGODB || 'mongodb://127.0.0.1/Kleinanzeigen';

var dbconn = mongoose.createConnection(mongoUri),
	Anzeigen = dbconn.model('kleinanzeigen', KleinanzeigenSchema, 'kleinanzeigen');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser());


// Define routes.
app.get('/',function(req, res) {
	res.render('default');
});

app.post('/anzeigeaufgeben', async function(req,res){
	try{
		await addAnzeige(req.body.kleinanzeige);
		res.send('Anzeige gespeichert');
	}catch(err){
		console.log(err);
		res.send(err);
	}
});
app.get('/export', async function(req, res) {
	if (req.query.secret === secret) {
		const {from, to} = req.query;
		const query = {};
		if (from || to) {
			query.$and = [];
		}
		if (from) {
			query.$and.push({
				createdAt: {
					$gte: from
				}
			});
		}
		if (to) {
			query.$and.push({
				createdAt: {
					$lte: to
				}
			});
		}

		const csv = await exportAnzeigen();
		res.setHeader('Content-disposition', 'attachment; filename=kleinanzeigen_export.csv');
		res.setHeader('Content-type', 'application/csv');

		res.send(csv);
	} else {
		throw 'wrong secret';
	}
});

app.listen(port, function() {
	console.log('Listening on Port: ' + port);
});
const lockedChatIds = {};
bot.on('message', async (msg) => {
	console.log(msg);
	const chatId = msg.chat.id;
	if (chatId !== targetChatId) {
		if (msg.text === '/start') {
			bot.sendMessage(chatId, 'Hi! Ich bin der KleinanzeigenBot. Alle Nachrichten, die du mir sendest, werden als Kleinanzeige gespeichert. Viel Spaß!');
		} else {
			try {
				if (lockedChatIds[chatId] === undefined) {
					lockedChatIds[chatId] = 0;
					await addAnzeige(msg.text);
					setTimeout(() => delete lockedChatIds[chatId], 5000);
					bot.sendMessage(chatId, `Kleinanzeige aufgegeben: ${msg.text}`);
				} else {
					if (lockedChatIds[chatId] === 0) {
						bot.sendMessage(chatId, 'Du kannst nur eine Kleinanzeige alle 5 Sekunden aufgeben. #spamschutz');
					}
					lockedChatIds[chatId] += 1;
				}
			} catch (error) {
				bot.sendMessage(chatId, error);
			}
		}
	}
});

async function addAnzeige (text) {
	if(text.length<=160){
		var anzeige = new Anzeigen({text});
		await anzeige.save();

		bot.sendMessage(targetChatId, text);
	} else{
		throw 'Text zu lang';
	}
}
async function exportAnzeigen() {
	const anzeigen = await Anzeigen.find().sort('createdAt').exec();
	const csv = anzeigen.map(anzeige => [anzeige.text, anzeige.createdAt].join(';')).join('\n');
	return Buffer.from(csv);
}