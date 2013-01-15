/**
 * Detect.js: User-Agent Parser
 * https://github.com/darcyclarke/Detect.js
 * Dual licensed under the MIT and GPL licenses.
 *
 * @version 2.1.1 - Custom Build
 * @author Darcy Clarke
 * @url http://darcyclarke.me
 * @createdat
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

    // Regexes 
    var regexes = {};

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
    _this.regexes = regexes || (function(){
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
      var ret = {};
      for(var i=0; i < obj.length; i++){
        ret = obj[i](ua);
        if(ret){
          break;
        }
      }
      return ret;
    };

    // Remove Utility
    var remove = function(arr, props){
      each(arr, function(obj){
        each(props, function(prop){
          delete obj[prop];
        });
      });
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

    // Parse User-Agent String
    _this.parse = function(ua){

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
          var ret = new UserAgent(family);
          ret.browser.major = parseInt(majorVersionRep ? majorVersionRep : m[2]);
          ret.browser.minor = m[3] ? parseInt(m[3]) : null;
          ret.browser.patch = m[4] ? parseInt(m[4]) : null;
          ret.browser.tablet = (obj.tablet);
          ret.browser.man = obj.manufacturer || null;
          return ret;
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
            var ret = {};
            ret.family = (rep ? rep.replace('$1', m[1]) : m[1]) || 'other';
            ret.major = m[2] ? parseInt(m[2]) : null;
            ret.minor = m[3] ? parseInt(m[3]) : null;
            ret.patch = m[4] ? parseInt(m[4]) : null;
            ret.tablet = (obj.tablet);
            ret.man = obj.manufacturer || null;
            return ret;
          }
          return parser;
        });
      };

      // Operating Systems Parsed
      var os_parsers = parsers('os');

      // Devices Parsed
      var device_parsers = parsers('device');

      // Set Agent
      var agent = a = find(ua, ua_parsers);
      a = (!a) ? new UserAgent() : a;

      // Set Browser
      a.browser.name = toString(a.browser);
      a.browser.version = toVersionString(a.browser);
      
      // Set OS
      a.os = find(ua, os_parsers);
      if(check(a.os)){
        a.os.name = toString(a.os);
        a.os.version = toVersionString(a.os);
      }

      // Set Device
      a.device = find(ua, device_parsers);
      if(check(a.device)){
        a.device.name = toString(a.device);
        a.device.version = toVersionString(a.device);
      } else {
        a.device = { tablet: false };
      }

      // Determine Device Type
      var mobile_agents = {};
      var mobile_browser_families = _this.regexes.mobile_browser_families.map(function(str) {
        mobile_agents[str] = true;
      });
      var mobile_os_families = _this.regexes.mobile_os_families.map(function(str) {
        mobile_agents[str] = true;
      });
      
      // Is Spider
      if(a.browser.family === 'Spider'){
        a.device.type = 'Spider';
      
      // Is Tablet
      } else if(a.browser.tablet || a.os.tablet || a.device.tablet){
        a.device.type = 'Tablet';

      // Is Mobile
      } else if(mobile_agents.hasOwnProperty(a.browser.family)){
        a.device.type = 'Mobile';
      
      // Is Desktop
      } else {
        a.device.type = 'Desktop';
      }

      // Determine Device Manufacturer
      a.device.manufacturer = a.browser.man || a.os.man || a.device.man || null;

      // Cleanup Objects
      remove([a.browser, a.os, a.device], ['tablet', 'man']);

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


})(window);