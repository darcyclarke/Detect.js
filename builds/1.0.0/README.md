Detect.js
=========

@version 1.0

**Note:** Detect.js is a JavaScript library to detect platforms and versions based on the `navigator.userAgent` string. This code is based on, and modified from, the original work of Tobie Langel's UA-Parser: https://github.com/tobie/ua-parser. UA-Parser is subsequently a port of [BrowserScope][1]'s [user agent string parser][2].

As initially touted, the biggest contribution to this code is the work of Steve Souders and the list of regex tests.

Features
--------
* AMD/Common.js support
* Supports **device**, **os** and **browser** detection. Defaults to `null` for values **family**, **major**, **minor** and **patch** if not able to detect
* **ua.toString('type')**: Returns results as a string
	* *defaults: to the `browser` object but you can specify `os` or `device` as well*
* **ua.toVersionString('type')**: Returns a version string 
	* *defaults: to the `browser` object but you can specify `os` or `device` as well*

 
Example Usage
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
ua.browser.major // 4
ua.browser.minor // 0
ua.browser.patch // 5

ua.device.family // "iPhone"
ua.device.major // null
ua.device.minor // null
ua.device.patch // null

ua.os.family // "iOS"
ua.os.major // 4
ua.os.minor // 0
ua.os.patch // null

ua.toString() // "Mobile Safari 4.0.5"
ua.toVersionString() // "5.1"

ua.toString('device') // "iPhone"
ua.toVersionString('device') // ""

ua.toString('os') // "iOS 4.0"
ua.toVersionString('os') // "4.0"
````

#### Common.js:

```javascript
var detect = require('detect');
var ua = detect.parse(navigator.userAgent);
````


Licensing
---------
 * Some JavaScript functionality is Copyright 2010 Tobie Langel and is available under choice of MIT or Apache Version 2.0 license.
 * The data contained in `regexes` JSON is Copyright 2009 Google Inc. and available under the Apache License, Version 2.0.
 * All other code can be considered under a Dual MIT and GPL licence
 * Please contact if this is confusing


[1]: http://www.browserscope.org
[2]: http://code.google.com/p/ua-parser/