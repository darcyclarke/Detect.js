// Setup
var detect		= require('../detect');
var regexes		= require('../build/regexes');
var util			= require('util');

var command		= (process.argv[2]) ? process.argv[2] : false,
		type			= (process.argv[3]) ? process.argv[3] : false,
		arguments	= (process.argv[4]) ? process.argv[4].split(' ') : false,
		output		= [],
		error			= false;

if(!command){
	output.push('Error: No command passed');
	error = true;
}

if(!type){
	output.push('Error: No type passed');
	error = true;
}

if(!arguments){
	output.push('Error: No arguments passed');
	error = true;
}

// Set Parsers
detect.setParsers(regexes);

// Set Families
detect.setFamilies(arguments);

// Output
console.log(detect.filterParsers());
