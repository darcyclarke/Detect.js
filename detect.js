/**
 * Detect.js: User-Agent Parser
 * https://github.com/darcyclarke/Detect.js
 * Dual licensed under the MIT and GPL licenses.
 *
 * @author Darcy Clarke
 * @url http://darcyclarke.me
 *
 * Based on UA-Parser (https://github.com/tobie/ua-parser) by Tobie Langel
 *
 * Example Usage:
 * var agentInfo = detect.parse(navigator.userAgent);
 * console.log(agentInfo.browser.family); // Chrome
 *
 */
(function(root, undefined){
  // Detect
  var detect = root.detect = (function(){

    // Context
    var _this = function(){};

    // Parsers 
    _this.parsers = [
      'device_parsers', 
      'browser_parsers', 
      'os_parsers', 
      'mobile_os_families', 
      'mobile_browser_families'
    ];

    // Types 
    _this.types = ['browser', 'os', 'device'];

    // Regular Expressions
    _this.regexes = (function(){
      var results = {};
      _this.parsers.map(function(parser){
        results[parser] = [];
      });
      return results;
    })();

    // Families
    _this.families = (function(){
      var results = {};
      _this.types.map(function(type){
        results[type] = [];
      });
      return results;
    })();

    // Utility Variables
    var ArrayProto = Array.prototype, 
        ObjProto = Object.prototype, 
        FuncProto = Function.prototype,
        nativeForEach = ArrayProto.forEach,
        nativeIndexOf = ArrayProto.indexOf;

    // Find Utility
    var find = function(ua, obj){
      for(var i=0; i < obj.length; i++){
        var ret = obj[i](ua);
        if(ret){
          break;
        }
      }
      return ret;
    };

    // Contains Utility
    var contains = function(obj, target) {
      var found = false;
      if (obj == null) 
        return found;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) 
        return obj.indexOf(target) != -1;
      found = any(obj, function(value) {
        return value === target;
      });
      return found;
    };

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

    // Extend Utiltiy
    var extend = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      });
      return obj;
    };

    // Check String Utility
    var check = function(str){
      return !!(str && typeof str != 'undefined' && str != null);
    }

    // To Version String Utility
    var toVersionString = function(obj){
      var output = '';
      obj = obj || {};
      if(check(obj)){
        if(check(obj.major)){
          output += obj.major;
          if(check(obj.minor)){
            output += '.' + obj.minor;
            if(check(obj.patch)){
              output += '.' + obj.patch;
            }
          }
        }
      }
      return output;
    };

    // To String Utility
    var toString = function(obj){
      obj = obj || {};
      var suffix = toVersionString(obj);
      if(suffix)
        suffix = ' ' + suffix;
      return (obj && check(obj.family)) ? obj.family + suffix : '';
    };

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

    // Parse User-Agent String
    _this.parse = function(ua){

      // Mobile Check
      var mobile_agents = {};
      var mobile_browser_families = _this.regexes.mobile_browser_families.map(function(str) {
        mobile_agents[str] = true;
      });
      var mobile_os_families = _this.regexes.mobile_os_families.map(function(str) {
        mobile_agents[str] = true;
      });


      // User-Agent Parsed
      var ua_parsers = _this.regexes.browser_parsers.map(function(obj){
        var regexp = new RegExp(obj.regex),
            famRep = obj.family_replacement,
            majorVersionRep = obj.major_version_replacement;

        function parser(ua){
          var m = ua.match(regexp);
          if (!m)
            return null;
          var family = famRep ? famRep.replace('$1', m[1]) : m[1];
          var obj = new UserAgent(family);
          obj.browser.major = parseInt(majorVersionRep ? majorVersionRep : m[2]);
          obj.browser.minor = m[3] ? parseInt(m[3]) : null;
          obj.browser.patch = m[4] ? parseInt(m[4]) : null;
          obj.isMobile = mobile_agents.hasOwnProperty(family);
          obj.isSpider = (family === 'Spider');
          return obj;
        }
        return parser;
      });

      // User Agent
      var UserAgent = function(family){
        this.browser = {};
        this.browser.family = family || 'other';
      }

      // Parsers Utility
      var parsers = function(type){
        return _this.regexes[type + '_parsers'].map(function(obj){
          var regexp = new RegExp(obj.regex),
              rep = obj[type + '_replacement'];
          function parser(ua){
            var m = ua.match(regexp);
            if(!m)
              return null;
            var obj = {};
            obj.family = (rep ? rep.replace('$1', m[1]) : m[1]) || 'other';
            obj.major = m[2] ? parseInt(m[2]) : null;
            obj.minor = m[3] ? parseInt(m[3]) : null;
            obj.patch = m[4] ? parseInt(m[4]) : null;
            return obj;
          }
          return parser;
        });
      };

      // Operating Systems Parsed
      var os_parsers = parsers('os');

      // Devices Parsed
      var device_parsers = parsers('device');

      // Set Agent
      var agent = find(ua, ua_parsers);
      agent = (!agent) ? new UserAgent() : agent;

      // Set Browser
      agent.browser.name = toString(agent.browser);
      agent.browser.version = toVersionString(agent.browser);
      
      // Set OS
      agent.os = find(ua, os_parsers);
      if(check(agent.os)){
        agent.os.name = toString(agent.os);
        agent.os.version = toVersionString(agent.os);
      }

      // Set Device
      agent.device = find(ua, device_parsers);
      if(check(agent.device)){
        agent.device.name = toString(agent.device);
        agent.device.version = toVersionString(agent.device);
      }

      // Return Agent
      return agent;
    }

    // Return context
    return _this;

  })();

  // Export the Underscore object for **Node.js** and **"CommonJS"**, 
  // backwards-compatibility for the old `require()` API. If we're not 
  // CommonJS, add `_` to the global object via a string identifier 
  // the Closure Compiler "advanced" mode. Registration as an AMD 
  // via define() happens at the end of this file
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = detect;
    }
    exports.detect = detect;
  } else {
    root['detect'] = detect;
  }

  // AMD define happens at the end for compatibility with AMD 
  // that don't enforce next-turn semantics on modules
  if (typeof define === 'function' && define.amd) {
    define(function(require) {
      return detect;
    });
  }


})(root || window);
