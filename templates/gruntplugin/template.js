/*
 * grunt-init
 * https://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman, contributors
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = 'Create a grunt plugin, including Nodeunit unit tests.';

// Template-specific notes to be displayed before question prompts.
exports.notes = 'The grunt plugin system is still under development. For ' +
  'more information, see the docs at https://github.com/gruntjs/grunt/blob/master/docs/plugins.md';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done) {

  init.process({type: 'grunt'}, [
    // Prompt for these values.
    init.prompt('name', function(value, props, done) {
      // Prepend grunt- to default name.
      var name = 'grunt-' + value;

      // Replace 'grunt-contrib' with 'grunt' and give a warning
      if (/^grunt-contrib/.test(name)) {
        var message = 'Omitting "contrib" from your project\'s name. The grunt-contrib ' +
                      'namespace is reserved for tasks maintained by the grunt team.';

        grunt.log.writelns(message.red);
        name = name.replace(/^grunt-contrib/,'grunt');
      }

      done(null, name);
    }),
    init.prompt('description', 'The best grunt plugin ever.'),
    init.prompt('version'),
    init.prompt('repository'),
    init.prompt('homepage'),
    init.prompt('bugs'),
    init.prompt('licenses'),
    init.prompt('author_name'),
    init.prompt('author_email'),
    init.prompt('author_url'),
    init.prompt('grunt_version'),
    init.prompt('node_version', grunt.package.engines.node)
  ], function(err, props) {
    // Set a few grunt-plugin-specific properties.
    props.short_name = props.name.replace(/^grunt[\-_]?/, '').replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
    props.main = 'Gruntfile.js';
    props.npm_test = 'grunt test';
    props.keywords = ['gruntplugin'];
    props.devDependencies = {
      // TODO: ADJUST VERSIONS FOR 0.4.0 FINAL
      'grunt-contrib-jshint': '0.1.1rc6',
      'grunt-contrib-clean': '0.4.0rc6',
      'grunt-contrib-nodeunit': '0.1.2rc6',
      // TODO: REMOVE FOR 0.4.0 FINAL
      'grunt': '0.4.0rc6',
    };

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  });

};
