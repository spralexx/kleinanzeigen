var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var port = 3000; //port to listen on
var app = express();

var KleinanzeigenSchema = new mongoose.Schema({
	text: {
		type: String,
		required: true
	},
	tag: {
		type: String,
		enum: ["Landesmeisterschaften","Brahmsee","Wünsche für den Brahmsee"],
		required: true
	}
},
{
	timestamps: true
});

const mongoUri = process.env.MONGODB || 'mongodb://db/Kleinanzeigen';

var dbconn = mongoose.createConnection(mongoUri),
	Anzeigen = dbconn.model('kleinanzeigen', KleinanzeigenSchema, 'kleinanzeigen');

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(bodyParser());


    // Define routes.
app.get('/',function(req, res) {
  //console.log(req);
	res.render('default');
}
  );
app.post('/anzeigeaufgeben',function(req,res){
	try{
		if(req.body.kleinanzeige.length<=245){

			console.log(req.body);
			var anzeige = new Anzeigen({text: req.body.kleinanzeige, tag:req.body.tag});
			anzeige.save(function (err) {
				if (err) return console.error(err);
			});
			res.send('Anzeige gespeichert');
		}else{
			throw 'Text zu lang';
		}
	}catch(err){
		console.log(err);
		res.send(err);
	}
});

app.listen(port, function() {
	console.log('Listening on Port: ' + port);
});
