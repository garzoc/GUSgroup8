
function jsonValueForm(value){
	if(isNaN(value)) return "\""+value+"\"";
	return value;
}



module.exports={
	
	size:function(obj){
		var count=0;
		for(i in obj){
			count ++;
		}
		return count;
	},
	
	cloneObject:function(obj){
		var clone=new Object;
		for(var k in obj){
			clone[k]=obj[k];
		}
		return clone; 
	},

	mergeObject:function mergeObject(a,b){
		for(var n in b){
			//console.log(n);
			if(a[n]===undefined){
				a[n]=b[n];
			}
		}
	},

	matchObject:function(a,b){
		if(this.size(a)!==this.size(b)){ console.log("iewjfoweiioewjfoi");return false;};
		for(var k in b){
			if(a[k]!==b[k]){console.log(k);return false;}
		}
		return true;
	
	},
	
	overwriteObject:function(a,b){
		for(var k in b){
			a[k]=b[k];
		}
	},
	
	
	
	matchObjectType:function(a,b){
		if(this.size(a)!==this.size(b)) return false;;
			for(var k in b){
				if(!a[k]===b[k])return false;
			};
		return true;
	
	},

	
	
	objectToString:function(obj){
		var string="";
		for(k in obj){
			string=string.concat("\""+k+"\":"+jsonValueForm(obj[k])+",");
		}
		return "{"+string.substr(0,string.length-1)+"}";
	}	
}
