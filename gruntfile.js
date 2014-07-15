module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
  
    pkg: grunt.file.readJSON('package.json'),

    // Configs
    defaults: {
      src: 'src',
      dist: 'dist'
    },

	//Prep 
	useminPrepare: {
	  html: 'index.html'
	},	
  
	usemin: {
	  html: '<%= defaults.dist %>/index.html'
	},
  
    // Build JS package
    concat: {
      package: {
        src: [
          // Dependencies
		  '<%= defaults.src %>/js/lib/snap.svg-min.js',
          '<%= defaults.src %>/js/lib/jquery-2.1.1.min.js',
          '<%= defaults.src %>/js/lib/imagesloaded.pkgd.min.js'
        ],

        dest: '<%= defaults.dist %>/js/lib/package.js'
      },
      svg: {
        src: [
          // Dependencies
          '<%= defaults.src %>/js/lib/classie.js',
          '<%= defaults.src %>/js/lib/svgLoader.js'
        ],

        dest: '<%= defaults.dist %>/js/lib/svg.js'
      }
	},
	
	//Minify javascript
	uglify: {
	  options: {
		mangle: false
	  },	
	  dist: {
		src: '<%= defaults.src %>/js/preload.js',
		dest: '<%= defaults.dist %>/js/preload.min.js'
	  },
      svg: {
        src: '<%= defaults.dist %>/js/lib/svg.js',
		dest: '<%= defaults.dist %>/js/lib/svg.min.js'
	  },
      package: {
        src: '<%= defaults.dist %>/js/lib/package.js',
		dest: '<%= defaults.dist %>/js/lib/package.min.js'
      }
	},
	  
	//Copy over the relevant files
    copy: {
      main: {
	  
		  files: [{
				expand:true,
				cwd: '<%= defaults.src %>/css/',
				src: ['**'],
				dest: '<%= defaults.dist %>/css/'
			},{
				expand: true,
				cwd: '<%= defaults.src %>/',
				src: ['*.html'],
				dest: '<%= defaults.dist %>/'
			}]
	  }
	},
	
	//Make sure the HTML is valid
    validation: {
      src: ['<%= defaults.dist %>/*.html'],
      options: {
        reset: true
      }
    }

  });
  
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.registerTask('default', [
									'useminPrepare:html',
									'uglify:dist', 
									'concat',
									'uglify:package',
									'uglify:svg',
									'copy:main',
									//'validation',
									'usemin'
								]);
};

