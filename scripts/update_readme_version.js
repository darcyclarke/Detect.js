#!/usr/local/bin/node

var fs = require('fs');
var argv = require('optimist').argv;
var childProcess = require('child_process');

readFile(packageFilename(), onPackageRead);

function onPackageRead(err, data) {
  if (err) throw err;
  var package = parsePackage(data);
  var filename = versionedFilename();
  readFile(filename, onVersionedFileRead(package.version, filename));
}

function onVersionedFileRead(version, filename) {
  return function (err, data) {
    if (err) throw err;
    // Replace the version with the updated version
    var newContents = data.toString().replace(/^\s*@version [\w\d.-]+\s*$/m, '\n@version ' + version + '\n');
    fs.writeFile(filename, newContents, onReplacementWritten(filename));
  };
}

function onReplacementWritten(filename) {
  return function (err) {
    if (err) throw err;
  };
}


function readFile(file, cb) {
  fs.readFile(file, {encoding: 'utf8'}, cb);
}

function packageFilename() {
  var packageFile = 'package.json';
  if (argv.package) {
    packageFile = argv.package;
  }
  return packageFile;
}

function parsePackage(data) {
  var pkgObj = JSON.parse(data.toString());
  return pkgObj;
}

function versionedFilename() {
  if (argv._.length !== 1) {
    process.exit(1);
  }

  return argv._[0];
}


