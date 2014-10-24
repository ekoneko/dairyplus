module.exports = function(grunt) {
	grunt.initConfig({
		uglify: {
			"site": {
				files: {}
			}
		},
		concat: {
			"site": {
				options: {},
				files: {
					'public/site/js/index.js': ['public/site/js/src/index/main.js', 'public/site/js/src/index/*.js'],
					'public/admin/admin.js' : ['!public/admin/src/admin.js', 'public/admin/src/*/*', 'public/admin/src/admin.js']
				}
			}
		},
		watch: {
			"default": {
				files: ['public/site/js/src/index/*.js', 'public/admin/src/*', 'public/admin/src/*/*'],
				tasks: ['concat:site', 'uglify:site']
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['concat:site', 'uglify:site']);
	grunt.registerTask('w', ['watch']);
};