// Setup
var util		  = require('util');
var fs        = require('fs');
var config    = require('../build/config');
var regexes   = require('../build/regexes');
var UglifyJS  = require('uglify-js');
var argv      = require('optimist').argv;
var _this 		= function(){};

// Utility Variables
var ArrayProto = Array.prototype, 
    ObjProto = Object.prototype, 
    FuncProto = Function.prototype,
    nativeForEach = ArrayProto.forEach,
    nativeIndexOf = ArrayProto.indexOf;

// Each Utility
var each = forEach = function(obj, iterator, context) {
  if (obj == null) return;
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      iterator.call(context, obj[i], i, obj);
    }
  } else {
    for (var key in obj) {
      if (_.has(obj, key)) {
        iterator.call(context, obj[key], key, obj);
      }
    }
  }
};

// Parsers
_this.parsers = [
  'device_parsers', 
  'browser_parsers', 
  'os_parsers', 
  'mobile_os_families', 
  'mobile_browser_families'
];

// Set Families
_this.setFamilies = function(families){
  if(Object(families))
    _this.families = families;
};

// Add Families
_this.addFamilies = function(families){
  _this.families = extend(_this.families, (Object(families)) ? families : {});
};

// Set Parsers
_this.setParsers = function(regexes){
  if(Object(regexes))
    _this.regexes = regexes;
};

// Add Parsers
_this.addParsers = function(regexes){
  _this.regexes = extend(_this.regexes, (Object(regexes)) ? regexes : {});
};

// Filter Parsers
_this.filterParsers = function(families, parsers){
  var regexes = {};
  _this.families = families || _this.families;
  _this.parsers = parsers || _this.parsers;
  
  // Check parsers
  forEach(_this.parsers, function(parser){
    regexes[parser] = [];
    
    // Check types
    forEach(_this.types, function(type){

      // Check families
      forEach(_this.families[type], function(family){
        family = family.toLowerCase();

        // Specific IE hack for regex
        if(family === 'ie')
          family = family + ' ';
        
        // Check regexes
        forEach(_this.regexes[parser], function(regex){

          // Test regex object vs. family
          if( ( typeof regex.regex != 'undefined' && 
                regex.regex.toLowerCase().indexOf(family) >= 0 ) || 
              ( typeof regex.family_replacement != 'undefined' && 
                regex.family_replacement.toLowerCase().indexOf(family) >= 0 ) ||
              ( family == 'other' && regex.other ) ||
              ( typeof regex == 'string' && regex.toLowerCase().indexOf(family) >= 0 && 
                !contains(regexes[parser], regex) ) )
            regexes[parser].push(regex);
        });
      });
    });
  });
  return regexes;
};

// Set Parsers
_this.setParsers(regexes);

// Set Families
_this.setFamilies(config);

// Filter Parsers
_this.filterParsers();

// Cleanup Regex
delete _this.regexes.regexes;

function formatCode(code) {
  if (argv.m || argv.minify) {
    var result = UglifyJS.minify(code, {fromString: true});
    code = result.code;
  }
  else {
    var result = UglifyJS.minify(code, {
      fromString: true,
      mangle: false,
      compress: false,
      output: {
        beautify: true,
        comments: true
      }
    });
    code = result.code;
  }
  return code;
}

function formatLines(lines, cb) {
  var PACKAGE_FILE = 'package.json';
  if (argv.package) {
    PACKAGE_FILE = argv.package;
  }
  fs.readFile(PACKAGE_FILE, {encoding: 'utf8'}, function (err, pkgContent) {
    if (err) {
      throw err;
    }
    var pkgObj = JSON.parse(pkgContent);
    // Replace Regexes
    var datetime = new Date();
    lines = lines + '';
    lines = lines.replace('var regexes = {}', 'var regexes = ' + JSON.stringify(_this.regexes));
    lines = lines.replace('@createdat', '@createdat ' + datetime);
    lines = lines.replace('@version', '@version ' + pkgObj.version);
    lines = formatCode(lines);
    cb(lines);
  });
}

function writeLines(lines) {
  var OUTPUT_FILE = 'detect.custom.js';
  if (argv.o) {
    OUTPUT_FILE = argv.o;
  }
  else if (argv.output) {
    OUTPUT_FILE = argv.output;
  }

  // Write to file
  fs.writeFile(OUTPUT_FILE, lines, function(err){
    if(err){
      console.log('Error: Issue writing to ' + OUTPUT_FILE);
    } else {
      console.log('Success: Created ' + OUTPUT_FILE);
    }
  });
}

var INPUT_FILE = 'build/detect.js';
if (argv.i) {
  INPUT_FILE = argv.i;
}
else if (argv.input) {
  INPUT_FILE = argv.input;
}
// Set Content
fs.readFile(INPUT_FILE, function(err, lines){
  formatLines(lines, writeLines);
});
