module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

    grunt.initConfig({
      'babel': {
        options: {
          sourceMap: true
        },
        dist: {
          files: {
            'dist/fsm.js': 'fsm.js'
          }
        }
      }
    });

    grunt.registerTask('default', ['babel']);
}