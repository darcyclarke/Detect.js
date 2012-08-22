Detect.js
=========

@version 1.0

**Note:** Detect.js is a JavaScript library to detect platform and version based on the `navigator.userAgent` string. This code is based on, and modified from, the original work of Tobie Langel's UA-Parser: https://github.com/tobie/ua-parser. UA-Parser is subsequently a port of [BrowserScope][1]'s [user agent string parser][2].

As initially touted, the biggest contribution to this code is the work of Steve Souders and the list of regex tests.

Features
--------
* Detect.js has AMD support but is not dependant on a library like [Require.js][4] or [Common.js][3] to be used
 
Example Use
-----------
#### Plain JS:
```html
<script src="detect.js"></script>
````

```javascript
var ua = detect.parse(navigator.userAgent);

console.log(ua.tostring());
// -> "Safari 5.0.1"

console.log(ua.toVersionString());
// -> "5.0.1"

console.log(ua.family);
// -> "Safari"

console.log(ua.major);
// -> 5

console.log(ua.minor);
// -> 0

console.log(ua.patch);
// -> 1
````

#### Common.js:

```javascript
var detect = require('detect');
var us = detect.parse(navigator.userAgent);

// see above JS example for further usage…
````


Licensing
---------
 * The core JavaScript functionality is Copyright 2010 Tobie Langel and is available under choice of MIT or Apache Version 2.0 license.
 * The data contained in `regexes` JSON is Copyright 2009 Google Inc. and available under the Apache License, Version 2.0.
 * All other code can be considered under a Dual MIT and GPL licence


[1]: http://www.browserscope.org
[2]: http://code.google.com/p/ua-parser/
[3]: http://www.commonjs.org/
[4]: http://requirejs.org/