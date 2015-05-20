module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            options: {
                separator: ';'
            },
            dist: {
                src: [
                    'dev/js/jquery.js',
                    'dev/js/angular.js',
                    'dev/js/angular-bootstrap.js',
                    'dev/js/switch.js',
                    'dev/js/*.js'
                ],
                dest: 'dev/build/<%= pkg.name %>-lib.js'
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: false
            },
            dist: {
                files: {
                    'app/assets/js/<%= pkg.name %>-lib.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        sass: {
            dev: {
                options: {
                    style: 'extended',
                    sourcemap: 'none',
                    noCache: true
                },
                files: {
                    'dev/build/<%= pkg.name %>-lib.css': 'dev/scss/main.scss'
                }
            },
            dist: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none',
                    noCache: true
                },
                files: {
                    'app/assets/css/<%= pkg.name %>-lib.min.css': 'dev/scss/main.scss'
                }
            }
        }
    });

    // Load the plugin(s)
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task(s)
    grunt.registerTask('default', ['concat', 'uglify', 'sass']);
};
