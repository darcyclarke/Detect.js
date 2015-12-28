var http = require('http');

function l(out) {
	if (typeof out !== 'undefined') {
		console.log('> ' + out);
	} else {
		console.log('');
	}
}

function v(version, level) {
	if (version != '') {
		var ns = version.split(version.indexOf('_') > 0 ? '_' : '.');
		if (typeof ns[level] !== 'undefined') {
			return ns[level];
		}
	}
	return undefined;
}

function n(ua) {
	if (typeof ua.agent_name === 'undefined') {
		return undefined;
	} else if (typeof ua.agent_version === 'undefined') {
		return ua.agent_name;
	} else {
		return ua.agent_name + ' ' + ua.agent_version;
	}
}

function testParser(s, ua, cb, type) {
	var o = {
		ua: s,
		browser: {
			family: ua.agent_name || undefined,
			name: n(ua),
			version: ua.agent_version || undefined,
			major: v(ua.agent_version, 0),
			minor: v(ua.agent_version, 1),
			patch: v(ua.agent_version, 2),
		},
		device: {
			type: type
		},
		os: {
			family: ua.os_type || undefined,
			name: ua.os_name || undefined,
			version: ua.os_versionNumber || undefined,
			major: v(ua.os_versionNumber, 0),
			minor: v(ua.os_versionNumber, 1),
			patch: v(ua.os_versionNumber, 2),
		}
	};
	l();
	l(JSON.stringify(o, null, 4));
	l();
	cb(JSON.stringify(o, null, 4));
}

function lookup(s, cb, type) {
	l();
	l('user agent string: ');
	l(s.string);

	var options = {
		hostname: 'www.useragentstring.com',
		path: '/?uas='+encodeURIComponent(s.string)+'&getJSON=all'
	};

	var req = http.request(options, function(res) {
		l();
		l('STATUS: ' + res.statusCode);
		l('HEADERS: ' + JSON.stringify(res.headers));

		var str = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			str += chunk;
		});
		res.on('end', function() {
			testParser(s.string, JSON.parse(str), cb, type);
		});
	});

	req.on('error', function(e) {
		throw e.message;
	});

	req.end();
}

module.exports = lookup;