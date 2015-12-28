var uas = [
	{
		ua: 'Mozilla/4.0 () etc...',
		type: 'Desktop'
	},
	// etc...
];



var fs = require('fs'),
	path = require('path'),
	logStream = fs.createWriteStream(path.join(__dirname, '..', 'tests', 'parsed'), {'flags': 'a'}),
	lookup = require('./lookup');

function process(strings) {
	console.log(strings.length+' user agent strings on the wall, took 1 down and passed it around...')
	var ua = strings.shift();
	lookup({string:ua.ua}, function(o) {
		logStream.write(o+',\n');
	}, ua.type);
	setTimeout(function() {
		if (strings.length > 0) {
			process(strings);
		}
	}, 3000);
}

process(uas);
