/**
 * Detect.js: User-Agent Parser
 * https://github.com/darcyclarke/Detect.js
 * Dual licensed under the MIT and GPL licenses.
 *
 * @version
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
  // Shim Array.prototype.map if necessary
  // Production steps of ECMA-262, Edition 5, 15.4.4.19
  // Reference: http://es5.github.com/#x15.4.4.19
  if (!Array.prototype.map) {
    Array.prototype.map = function(callback, thisArg) {

      var T, A, k;

      if (this == null) {
        throw new TypeError(" this is null or not defined");
      }

      // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
      var O = Object(this);

      // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
      // 3. Let len be ToUint32(lenValue).
      var len = O.length >>> 0;

      // 4. If IsCallable(callback) is false, throw a TypeError exception.
      // See: http://es5.github.com/#x9.11
      if (typeof callback !== "function") {
        throw new TypeError(callback + " is not a function");
      }

      // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
      if (thisArg) {
        T = thisArg;
      }

      // 6. Let A be a new array created as if by the expression new Array(len) where Array is
      // the standard built-in constructor with that name and len is the value of len.
      A = new Array(len);

      // 7. Let k be 0
      k = 0;

      // 8. Repeat, while k < len
      while(k < len) {

        var kValue, mappedValue;

        // a. Let Pk be ToString(k).
        //   This is implicit for LHS operands of the in operator
        // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
        //   This step can be combined with c
        // c. If kPresent is true, then
        if (k in O) {

          // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
          kValue = O[ k ];

          // ii. Let mappedValue be the result of calling the Call internal method of callback
          // with T as the this value and argument list containing kValue, k, and O.
          mappedValue = callback.call(T, kValue, k, O);

          // iii. Call the DefineOwnProperty internal method of A with arguments
          // Pk, Property Descriptor {Value: mappedValue, : true, Enumerable: true, Configurable: true},
          // and false.

          // In browsers that support Object.defineProperty, use the following:
          // Object.defineProperty(A, Pk, { value: mappedValue, writable: true, enumerable: true, configurable: true });

          // For best browser support, use the following:
          A[ k ] = mappedValue;
        }
        // d. Increase k by 1.
        k++;
      }

      // 9. return A
      return A;
    };
  }

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

      // Parsers Utility
      var parsers = function(type){
        return _this.regexes[type + '_parsers'].map(function(obj){
          var regexp = new RegExp(obj.regex),
              rep = obj[( type === 'browser' ? 'family' : type ) + '_replacement'],
              major_rep = obj.major_version_replacement;
          function parser(ua){
            var m = ua.match(regexp);
            if(!m)
              return null;
            var ret = {};
            ret.family = (rep ? rep.replace('$1', m[1]) : m[1]) || 'other';
            ret.major = parseInt(major_rep ? major_rep : m[2]) || null;
            ret.minor = m[3] ? parseInt(m[3]) : null;
            ret.patch = m[4] ? parseInt(m[4]) : null;
            ret.tablet = (obj.tablet);
            ret.man = obj.manufacturer || null;
            return ret;
          }
          return parser;
        });
      };

      // User Agent
      var UserAgent = function(){};

      // Browsers Parsed
      var browser_parsers = parsers('browser');

      // Operating Systems Parsed
      var os_parsers = parsers('os');

      // Devices Parsed
      var device_parsers = parsers('device');

      // Set Agent
      var a = new UserAgent();

      // Remember the original user agent string
      a.source = ua;

      // Set Browser
      a.browser = find(ua, browser_parsers);
      if(check(a.browser)){
        a.browser.name = toString(a.browser);
        a.browser.version = toVersionString(a.browser);
      } else {
        a.browser = {};
      }

      // Set OS
      a.os = find(ua, os_parsers);
      if(check(a.os)){
        a.os.name = toString(a.os);
        a.os.version = toVersionString(a.os);
      } else {
        a.os = {};
      }

      // Set Device
      a.device = find(ua, device_parsers);
      if(check(a.device)){
        a.device.name = toString(a.device);
        a.device.version = toVersionString(a.device);
      } else {
        a.device = {
          tablet: false,
          family: 'Other'
        };
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
      return a;
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
