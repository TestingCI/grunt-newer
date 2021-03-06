var path = require('path');


/**
 * @param {Object} grunt Grunt.
 */
module.exports = function(grunt) {

  var log = [];

  grunt.initConfig({
    newer: {
      options: {
        cache: path.join(__dirname, '.cache')
      }
    },
    modified: {
      one: {
        src: 'src/one.js'
      },
      all: {
        src: 'src/**/*.js'
      },
      none: {
        src: []
      }
    },
    log: {
      all: {
        src: 'src/**/*.js',
        getLog: function() {
          return log;
        }
      }
    },
    assert: {
      that: {
        getLog: function() {
          return log;
        }
      }
    }
  });

  grunt.loadTasks('../../../tasks');
  grunt.loadTasks('../../../test/integration/tasks');

  grunt.registerTask('default', function() {

    grunt.task.run([
      // run the assert task with newer, expect all files
      'newer:log',
      'assert:that:modified:all',

      // HFS+ filesystem mtime resolution
      'wait:1001',

      // modify one file
      'modified:one',

      // run assert task again, expect one file
      'newer:log',
      'assert:that:modified:one',

      // HFS+ filesystem mtime resolution
      'wait:1001',

      // modify nothing, expect no files
      'newer:log',
      'assert:that:modified:none'

    ]);

  });

};
