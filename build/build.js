// Setup
var detect		= require('../detect');
var regexes		= require('../build/regexes');
var util		= require('util');

var command		= (process.argv[2]) ? process.argv[2] : false,
	type		= (process.argv[3]) ? process.argv[3] : false,
	arguments	= (process.argv[4]) ? process.argv[4].split(' ') : false,
	output		= [],
	error		= false,
	_this 		= function(){};

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
