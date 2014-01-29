/*
 * grunt-init
 * https://gruntjs.com/
 *
 * Copyright (c) 2014 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

exports.init = function(grunt) {
  var exports = {};

  // Nodejs libs.
  var path = require('path');
  var _ = require('lodash');

  // Windows?
  var win32 = process.platform === 'win32';

  // Access files in the user's ".grunt-init" folder.
  exports.userDir = function() {
    var dirpath = path.join.apply(path, arguments);
    var homepath = process.env[win32 ? 'USERPROFILE' : 'HOME'];
    return path.resolve(homepath, '.grunt-init', dirpath);
  };

  // An array of all available license files.
  exports.availableLicenses = function() {
    return exports.expand({filter: 'isFile'}, 'licenses/*').map(function(obj) {
      return path.basename(String(obj)).replace(/^LICENSE-/, '');
    });
  };

  // Return an array of all task-specific file paths that match the given
  // wildcard patterns. Instead of returing a string for each file path, return
  // an object with useful properties. When coerced to String, each object will
  // yield its absolute path.
  exports.expand = function() {
    var args = grunt.util.toArray(arguments);
    // If the first argument is an options object, remove and save it for later.
    var options = grunt.util.kindOf(args[0]) === 'object' ? args.shift() : {};
    // Use the first argument if it's an Array, otherwise convert the arguments
    // object to an array and use that.
    var patterns = Array.isArray(args[0]) ? args[0] : args;
    var filepaths = {};
    // When any returned array item is used in a string context, return the
    // absolute path.
    var toString = function() { return this.abs; };
    // Iterate over all searchDirs.
    exports.searchDirs.forEach(function(dirpath) {
      var opts = Object.create(options);
      // Set the cwd so the grunt.file.expand* method can match relatively.
      opts.cwd = dirpath;
      // Create an array of absolute patterns, preceded by the options object.
      var args = [opts].concat(patterns);
      // Expand the paths in case a wildcard was passed.
      grunt.file.expand.apply(null, args).forEach(function(relpath) {
        if (relpath in filepaths) { return; }
        // Update object at this relpath only if it doesn't already exist.
        filepaths[relpath] = {
          abs: dirpath + '/' + relpath,
          rel: relpath,
          base: dirpath,
          toString: toString
        };
      });
    });
    // Return an array of objects.
    return Object.keys(filepaths).map(function(relpath) {
      return filepaths[relpath];
    });
  };

  // Get all templates.
  exports.getTemplates = function() {
    var templates = {};
    exports.expand({filter: 'isFile'}, '*/template.{js,coffee}').forEach(function(fileobj) {
      templates[fileobj.rel.split('/')[0]] = require(fileobj.abs);
    });
    return templates;
  };

  // Get a single task file path.
  exports.getFile = function() {
    var filepath = path.join.apply(path, arguments);
    var fileobj = exports.expand(filepath)[0];
    return fileobj ? String(fileobj) : null;
  };

  exports.searchDirs = [];

  // Initialize searchDirs.
  exports.initSearchDirs = function(name) {
    exports.searchDirs = [];
    // Add dirname of specified template file to searchDirs.
    if (name && grunt.file.exists(name)) {
      exports.searchDirs.push(path.dirname(name));
      name = path.basename(path.resolve(name), '.js');
    }
    // Add ~/.grunt-init/ to searchDirs.
    var initdir = exports.userDir();
    if (initdir && grunt.file.exists(initdir)) {
      exports.searchDirs.push(initdir);
    }
    // Add internal templates to searchDirs.
    exports.searchDirs.push(path.resolve(__dirname, '../../templates'));

    // Search dirs should be unique and fully normalized absolute paths.
    exports.searchDirs = _.uniq(exports.searchDirs).map(function(filepath) {
      return path.resolve(filepath);
    });

    return name;
  };

  // Read JSON defaults from task files (if they exist), merging them into one.
  // data object.
  var readDefaults = {};
  exports.readDefaults = function() {
    var filepath = path.join.apply(path, arguments);
    var result = readDefaults[filepath];
    var filepaths;
    if (!result) {
      result = readDefaults[filepath] = {};
      // Find all matching taskfiles.
      filepaths = exports.searchDirs.map(function(dirpath) {
        return path.join(dirpath, filepath);
      }).filter(function(filepath) {
        return grunt.file.isFile(filepath);
      });
      // Load defaults data.
      if (filepaths.length) {
        grunt.verbose.subhead('Loading data from ' + filepath);
        // Since extras path order goes from most-specific to least-specific, only
        // add-in properties that don't already exist.
        filepaths.forEach(function(filepath) {
          _.defaults(result, grunt.file.readJSON(filepath));
        });
      }
    }
    return result;
  };

  return exports;
};
