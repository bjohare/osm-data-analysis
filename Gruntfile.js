module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    browserify: {
      'public/js/app.js': ['client/js/app.js']
    },
    watch: {
      files: [ "client/**/*.js"],
      tasks: [ 'browserify' ]
    },
    uglify: {
        app: {
          files: {
            'public/js/app.min.js': ['client/js/app.js']
          }
        }
    }
  })
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-uglify');
}
