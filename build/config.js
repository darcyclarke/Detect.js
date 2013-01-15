
var config = root.config = {
	browser: 'firefox netscape opera chrome facebook twitter ie opera other'.split(' '),
	device: 'wii kindle playstation nokia blackberry palm htc acer asus lenovo lg motorola phillips samsung other'.split(' '),
	os: 'android webos windows symbian blackberry other'.split(' ')
};

// Export the Underscore object for **Node.js** and **"CommonJS"**, 
// backwards-compatibility for the old `require()` API. If we're not 
// CommonJS, add `_` to the global object via a string identifier 
// the Closure Compiler "advanced" mode. Registration as an AMD 
// via define() happens at the end of this file
if (typeof exports !== 'undefined') {
	if (typeof module !== 'undefined' && module.exports) {
	  exports = module.exports = config;
	}
	exports.config = config;
} else {
	root['config'] = config;
}

// AMD define happens at the end for compatibility with AMD 
// that don't enforce next-turn semantics on modules
if (typeof define === 'function' && define.amd) {
	define(function(require) {
	  return config;
	});
}