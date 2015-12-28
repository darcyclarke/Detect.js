var cases = require('./cases').cases,
	browsers = {},
	oses = {},
	devices = {},
	duplicates = {},
	o = {},
	added = 0,
	duplicate = 0;

function addDuplicate(test) {
	var v = test.browser.name + '.' + test.browser.major + '.' + test.browser.minor + '.' + test.browser.patch + '.' +
			test.os.name + '.' + test.os.major + '.' + test.os.minor + '.' + test.os.patch;
	if (typeof duplicates[v] === 'undefined') {
		duplicates[v] = [test.ua];
	} else {
		duplicates[v].push(test.ua);
	}
}

cases.map(function(test) {
	duplicate = 0;
	if (typeof browsers[test.browser.family] === 'undefined') {
		o = {
			uniques: 1,
			duplicates: 0,
			names: [],
			versions: [],
			majors: [],
			minors: [],
			patches: []
		};

		o.names.push(test.browser.name);

		if (typeof test.browser.version !== 'undefined') {
			o.versions.push(test.browser.version)
		}

		if (typeof test.browser.major !== 'undefined') {
			o.majors.push(test.browser.major)
		}

		if (typeof test.browser.minor !== 'undefined') {
			o.minors.push(test.browser.minor)
		}

		if (typeof test.browser.patch !== 'undefined') {
			o.patches.push(test.browser.patch)
		}

		browsers[test.browser.family] = o;
	} else {
		added = 0;

		if (browsers[test.browser.family].names.indexOf(test.browser.name) === -1) {
			browsers[test.browser.family].names.push(test.browser.name);
			added++;
		}

		if (typeof test.browser.version !== 'undefined') {
			if (browsers[test.browser.family].versions.indexOf(test.browser.version) === -1) {
				browsers[test.browser.family].versions.push(test.browser.version);
				added++;
			}
		}

		if (typeof test.browser.major !== 'undefined') {
			if (browsers[test.browser.family].majors.indexOf(test.browser.major) === -1) {
				browsers[test.browser.family].majors.push(test.browser.major);
				added++;
			}
		}

		if (typeof test.browser.minor !== 'undefined') {
			if (browsers[test.browser.family].minors.indexOf(test.browser.minor) === -1) {
				browsers[test.browser.family].minors.push(test.browser.minor);
				added++;
			}
		}

		if (typeof test.browser.patch !== 'undefined') {
			if (browsers[test.browser.family].patches.indexOf(test.browser.patch) === -1) {
				browsers[test.browser.family].patches.push(test.browser.patch);
				added++;
			}
		}

		if (added) {
			browsers[test.browser.family].uniques++;
		} else {
			browsers[test.browser.family].duplicates++;
			duplicate++;
		}
	}

	if (typeof oses[test.os.family] === 'undefined') {
		o = {
			uniques: 1,
			duplicates: 0,
			names: [],
			versions: [],
			majors: [],
			minors: [],
			patches: []
		};

		o.names.push(test.os.name);

		if (typeof test.os.version !== 'undefined') {
			o.versions.push(test.os.version)
		}

		if (typeof test.os.major !== 'undefined') {
			o.majors.push(test.os.major)
		}

		if (typeof test.os.minor !== 'undefined') {
			o.minors.push(test.os.minor)
		}

		if (typeof test.os.patch !== 'undefined') {
			o.patches.push(test.os.patch)
		}

		oses[test.os.family] = o;
	} else {
		added = 0;

		if (oses[test.os.family].names.indexOf(test.os.name) === -1) {
			oses[test.os.family].names.push(test.os.name);
			added++;
		}

		if (typeof test.os.version !== 'undefined') {
			if (oses[test.os.family].versions.indexOf(test.os.version) === -1) {
				oses[test.os.family].versions.push(test.os.version);
				added++;
			}
		}

		if (typeof test.os.major !== 'undefined') {
			if (oses[test.os.family].majors.indexOf(test.os.major) === -1) {
				oses[test.os.family].majors.push(test.os.major);
				added++;
			}
		}

		if (typeof test.os.minor !== 'undefined') {
			if (oses[test.os.family].minors.indexOf(test.os.minor) === -1) {
				oses[test.os.family].minors.push(test.os.minor);
				added++;
			}
		}

		if (typeof test.os.patch !== 'undefined') {
			if (oses[test.os.family].patches.indexOf(test.os.patch) === -1) {
				oses[test.os.family].patches.push(test.os.patch);
				added++;
			}
		}

		if (added) {
			oses[test.os.family].uniques++;
		} else {
			oses[test.os.family].duplicates++;
			duplicate++;
		}
	}

	if (typeof devices[test.device.type] === 'undefined') {
		devices[test.device.type] = 1;
	} else {
		typeof devices[test.device.type]++;
	}

	if (duplicate) {
		addDuplicate(test);
	}
});

// report

console.log('');
console.log('> browsers');
console.log('');

for (var key in browsers) {
	console.log(key);
	console.log('versions: ' + browsers[key].versions.sort().join(', '));
	console.log('unique: ' + browsers[key].uniques);
	console.log('duplicate: ' + browsers[key].duplicates);
	console.log('')
}

console.log('> os');
console.log('');

for (var key in oses) {
	console.log(key);
	console.log('names: ' + oses[key].names.sort().join(', '));
	console.log('unique: ' + oses[key].uniques);
	console.log('duplicate: ' + oses[key].duplicates);
	console.log('')
}

// debugging

// for (var key in duplicates) {
// 	if (duplicates[key].length === 1) {
// 		delete duplicates[key];
// 	}
// }

// console.log(duplicates);
