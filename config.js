//
//	Author 			: Ioannis Gkikas
//	Description : A customisable parameter and settings file to be used with any WebServer components
//

module.exports = {
	'httpPort': process.env.PORT || 8080,
	'socketsPortFE': 8000,
	'socketsPortBE': 1338, 
	'database': 'mongodb://localhost:27017/test',
	'secret': 'gusgroup8'
};
