'use strict';

var grunt = require('grunt');
var helpers = require('../tasks/lib/helpers').init(grunt);

exports['helpers'] = {
  'isBinary': function(test) {
    test.expect(3);
    test.equal(helpers.isBinary('path/file.jpg'), true, 'It should return true.');
    test.equal(helpers.isBinary('path/file.txt'), false, 'It should return false.');
    test.equal(helpers.isBinary('path/file.styl'), false, 'It should return false.');
    test.done();
  }
};