Detect.js
=========

@version 1.0

**Note:** Detect.js is a JavaScript library to detect platform and version based on the `navigator.userAgent` string. This code is based on, and modified from, the original work of Tobie Langel's US-Parser: https://github.com/tobie/ua-parser.

 * The core JavaScript is Copyright 2010 Tobie Langel and is available under choice of MIT or Apache Version 2.0 license.
 * The data contained in regexes JSON is Copyright 2009 Google Inc. and available under the Apache License, Version 2.0.

## Features
---------------

* Detect.js has AMD support but is not dependant on a library like Require.js or Common.js to be used
 
## Example Use
---------------
 
#### Plain JS:
```html
<script src="detect.js">&lt;/script>
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


 