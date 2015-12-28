var fs = require('fs'),
	path = require('path'),
	cases = require('./cases').cases;

var lines = [
	'/* Created by generator.js */',
	"var DetectJS = require('../detect.js');",
	"var expect = require('chai').expect;",
	'',
	"var a, b;",
	'',
];

cases.map(function(test) {
	lines.push("describe('"+test.ua+"', function() {");
	lines.push("	var ua = DetectJS.parse('"+test.ua+"');");
	delete test.ua;
	for (var category in test) {
		if (Object.hasOwnProperty.call(test, category)) {
			for (var subCat in test[category]) {
				if (Object.hasOwnProperty.call(test[category], subCat)) {
					var type = typeof test[category][subCat],
						t = test[category][subCat];
					if (type === 'string') {
						t = "'"+t+"'";
					}
					lines.push("	it('"+category+"."+subCat+"', function() {");
					lines.push("		expect(ua."+category+"."+subCat+").to.equal("+t+");");
					lines.push("	});");
				}
			}
		}
	}
	lines.push("});");
	lines.push('');
});

fs.writeFile(path.join(__dirname, 'generatedTests.js'), lines.join("\n"), 'utf8', function(err) {
	if (err) throw err;
	console.log('> generatedTests.js written');
});
