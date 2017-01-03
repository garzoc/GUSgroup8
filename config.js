//
//	Author 			: Ioannis Gkikas
//	Description : A customisable parameter and settings file to be used with any WebServer components
//

module.exports = {
	'httpPort': process.env.PORT || 41372,
	'socketsPortFE': 22759,
	'socketsPortBE': 14327, 
	'database': 'mongodb://localhost:27017/test',
	'secret': 'gusgroup8'
};
