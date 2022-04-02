function init(){
	var form = document.getElementById('kleinanzeige');
	form.addEventListener('submit',function(e){
		e.preventDefault();
		if(document.getElementById('kleinanzeigentext').value && document.getElementById('tag').value ){

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {

					console.log(this.responseText);
					var p = document.getElementById('status');
					p.innerHTML=this.responseText;
					if(this.responseText=='Anzeige gespeichert'){
						setTimeout(function(){ location.reload();}, 1500);
					}
				}
			};
			xhttp.open('POST', '/anzeigeaufgeben', true);
			xhttp.setRequestHeader('Content-Type', 'application/json');
			xhttp.send(JSON.stringify({kleinanzeige:document.getElementById('kleinanzeigentext').value,
									    tag:document.getElementById('tag').value}));


		}
		else{
			console.log('leere anzeige nicht gesendet');
		}
	});


}

window.addEventListener('load', init);
