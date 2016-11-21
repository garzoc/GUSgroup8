

module.exports=function(app){
	app.get('*', function(req, res) {
	
           console.log("hello");
			res.sendFile
	});


	app.post("*",function(req,res){
		if(req.money===undefined){
			req.money="banana";
			console.log(req.money);
		}
		//console.log(req.body);
		console.log(req.body.name);
		//var t=req.body.name;
		//t=global.objectToString(t);
		
		res.send("was recieved");
		
	});
	
}
