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

  // Get the git origin url from the current repo (if possible).
  exports.origin = function(done) {
    grunt.util.spawn({
      cmd: 'git',
      args: ['remote', '-v']
    }, function(err, result) {
      var re = /^origin\s/;
      var lines;
      if (!err) {
        lines = String(result).split('\n').filter(re.test, re);
        if (lines.length > 0) {
          done(null, lines[0].split(/\s/)[1]);
          return;
        }
      }
      done(true, 'none');
    });
  };

  // Generate a GitHub web URL from a GitHub repo URI.
  var githubUrlRegex = /^.+(?:@|:\/\/)(github.com)[:\/](.+?)(?:\.git|\/)?$/;
  exports.githubUrl = function(uri, suffix) {
    var matches = githubUrlRegex.exec(uri);
    if (!matches) { return null; }
    var url = 'https://' + matches[1] + '/' + matches[2];
    if (suffix) {
      url += '/' + suffix.replace(/^\//, '');
    }
    return url;
  };

  // Get the given key from the git config, if it exists.
  exports.config = function(key, done) {
    grunt.util.spawn({
      cmd: 'git',
      args: ['config', '--get', key]
    }, function(err, result) {
      if (err) {
        done(true, 'none');
        return;
      }
      done(null, String(result));
    });
  };

  return exports;
};
