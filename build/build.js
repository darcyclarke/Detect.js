// Setup
var util		  = require('util');
var fs        = require('fs');
var config    = require('../build/config');
var regexes   = require('../build/regexes');
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
      if (iterator.call(context, obj[i], i, obj) === breaker) return;
    }
  } else {
    for (var key in obj) {
      if (_.has(obj, key)) {
        if (iterator.call(context, obj[key], key, obj) === breaker) return;
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

// Set Content
fs.readFile('detect.js', function(err, lines){

  // Replace Regexes
  var datetime = new Date();
  lines = lines + '';
  lines = lines.replace('var regexes = {}', 'var regexes = ' + JSON.stringify(_this.regexes));
  lines = lines.replace('@createdat', '@createdat ' + datetime);

  // Write to file
  fs.writeFile('detect.custom.js', lines, function(err){
    if(err){
      console.log('Error: Issue writing to detect.custom.js');
    } else {
      console.log('Success: Created detect.custom.js');
    }
  });
});
