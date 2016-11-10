module.exports=function(app){

	
	app.get('/tim', function(req, res) {
	
           console.log("hello");
			res.sendFile
	});
	app.get('*', function(req, res) {
			//console.log("supp");
           res.sendFile('/home/ost/Desktop/serverjs/public/index.html');
	});
	
	app.post("*",function(req,res){
		console.log(req.body);
		console.log(req.body.name);
		var t=(req.body);
		//t=global.objectToString(t);
		
		//res.send(t.name+ "was recieved");
		
	});
	
}
