/*global module:false*/

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Project configuration.
  grunt.initConfig({
    // Metadata.
    //pkg: grunt.file.readJSON('package.json'),
 	    distdir: 'dist',
		pkg: grunt.file.readJSON('package.json'),
		src: {
			less:['public-site/less/*.less'],
            js: ['js/**/**/*.js']		
		},
		watch: {
		  all: {
			files: ['**/**/*.*',  '!**/**/*.css'],		
			options: {
			  livereload: {
				port: 9000
			  }
			}/*,
			tasks: "recess"*/
		  }
		  
		 
		},//end of watch ---------
		/*less: {
		  dev: {
			options: {
			  paths: [""]
			},
			files: {
			  "public-site/css/app.css": ["<%= src.less %>"]
			}
		  }
		}*/		
 		recess: {
			dist: {
				options: {
					compile: true
				},
				files: {
					"public-site/css/app.css": ["<%= src.less %>"]
				}
			}
		}///end of recess ---------
  });
 
  // These plugins provide necessary tasks.

    

  // Default task.
    grunt.registerTask('default', ['watch']);

 
};