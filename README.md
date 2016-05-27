Detect.js
=========

**Note:** Detect.js is a JavaScript library to detect platforms, versions, manufacturers and types based on the `navigator.userAgent` string. This code is based on, and modified from, the original work of Tobie Langel's UA-Parser: https://github.com/tobie/ua-parser. UA-Parser is subsequently a port of [BrowserScope][1]'s [user agent string parser][2].

As initially touted, the biggest contribution to this code is the work of Steve Souders and the list of regex tests.

Features
--------

* User-Agent parsing (obviously)
* AMD/Common.js support
* **device**, **os** and **browser** detection of:
	* `name`
	* `family`
	* `version`
	* `major`
	* `minor`
	* `patch`
	* **device** supports: `manufacturer` and `type` as well
* Custom regex builds using **node.js**


Creating a Custom Build
-----------

Creating a custom build of the regex profiles will help reduce file size and is strongly recommended. The default `detect.js` and `detect.min.js` files include **all** regex profiles and is therefor much larger then, I'm sure, your needs.

1. Install **Node.js**: https://github.com/joyent/node/wiki/Installation
2. Edit  `build/config.js` with you're preferred **oss**, **devices** and **browsers**
3. Run `node build/build.js --input=build/detect.js --output=build/detect.custom.js`
4. The build script should create a custom version of **Detect.js** at `build/detect.custom.js`


Example Use
-----------
#### Plain JS:
```html
<script src="detect.js"></script>
````

```javascript

/*
iPhone 4 Example User Agent:
Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_0 like Mac OS X; en-us) AppleWebKit/532.9 (KHTML, like Gecko) Version/4.0.5 Mobile/8A293 Safari/6531.22.7
*/

var ua = detect.parse(navigator.userAgent);

ua.browser.family // "Mobile Safari"
ua.browser.name // "Mobile Safari 4.0.5"
ua.browser.version // "4.0.5"
ua.browser.major // 4
ua.browser.minor // 0
ua.browser.patch // 5

ua.device.family // "iPhone"
ua.device.name // "iPhone"
ua.device.version // ""
ua.device.major // null
ua.device.minor // null
ua.device.patch // null
ua.device.type // "Mobile"
ua.device.manufacturer // "Apple"

ua.os.family // "iOS"
ua.os.name // "iOS 4"
ua.os.version // "4"
ua.os.major // 4
ua.os.minor // 0
ua.os.patch // null
````

#### Common.js:

```javascript
var detect = require('detect');
var ua = detect.parse(navigator.userAgent);
...
````

Hacking
-------
* Install development dependencies using `npm install`.
* Install the pre-commit hook by running `hooks/install.sh`.
* Kick off the default build (which will generate `detect.js` and `detect.min.js`) with `npm start`.

Credits
-------
Thanks to [Adriano Caheté](https://github.com/AdrianoCahete) and [Julian](https://github.com/julmot)

Licensing
---------
 * Some data contained in `build/regexes.js` is Copyright 2009 Google Inc. and available under the Apache License, Version 2.0.
 * All other code is licensed under a Dual MIT and GPL licence

[1]: http://www.browserscope.org
[2]: http://code.google.com/p/ua-parser/
