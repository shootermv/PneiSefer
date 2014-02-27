/*global module:false*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    //pkg: grunt.file.readJSON('package.json'),
 	    distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		src: {
			less:['less/*.less'],
            js: ['js/**/*.js']		
		},
		watch: {
		  all: {
			files: ['**/**/*.*'],		
			options: {
			  livereload: {
				port: 9000
			  }
			}
		  }
		},//end of watch ---------
 		recess: {
		  build: {
			files: {
			  '<%= distdir %>/css/app.css':
			  ['<%= src.less %>'] 
			},
			options: {
			  compile: true
			}
		  }
		}//end of recess ---------
  });
 
  // These plugins provide necessary tasks.

    

  // Default task.
    grunt.registerTask('default', ['watch']);

 
};