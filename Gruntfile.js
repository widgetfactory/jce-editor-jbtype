/*eslint-env node */

module.exports = function(grunt) {
    var pkg = grunt.file.readJSON("package.json");

    var filter = function(path) {
        var s = true;

        ['build', 'src', 'lib', 'less', 'Gruntfile.js','package.json', 'README'].forEach(function(v) {
            s = path.indexOf(v) === -1;
        });

        s = !/\/(less|src|lib)\b/.test(path) && !/\.less$/.test(path) && !/\.(js|css)\.map$/.test(path);

        return s;
    };

    grunt.initConfig({
        pkg: pkg,
        
        root: '../../..',

        tmp: 'build',

        dest: '<%= tmp %>/<%= pkg.version_clean %>/',

        /* Remove existing final build */
        shell: {
            clean: {
                command: 'rm -rf ../../Releases/plugins/<%= pkg.version_clean %>'
            },
            copy: {
                command: 'cp -r <%= tmp %>/<%= pkg.version_clean %> ../../Releases/plugins/<%= pkg.version_clean %>'
            }
        },

        clean: {
            start: ['<%= tmp %>/<%= pkg.version_clean %>']
        },

        copy: {
            main: {
                files: [
                    /* Plugin */
                    {
                        src: '**',
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/plugins/jce/<%= pkg.name %>/',
                        filter: function(filepath) {
                        	return /^(build|Gruntfile\.js|package\.json|en-GB\.plg_jce_)/.test(filepath) === false;
                        }
                    },

                    /* Languages */
                    {
                        src: ['en-GB.plg_jce_<%= pkg.name %>.ini', 'en-GB.plg_jce_<%= pkg.name %>.sys.ini'],
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/administrator/language/en-GB/'
                    },
                    
                    /* Manifest */
                    {
                        expand: true,
                        cwd: '<%= root %>/plugins/jce/<%= pkg.name %>/',
                        src: '<%= pkg.name %>.xml',
                        dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                    }
                ]
            }
        },

        replace: {
            production: {
                options: {
                    patterns: [{
                        json: {
                            'name@@': pkg.name,
                            'version@@': function() {
                                var version = pkg.version;
                                return version;
                            },
                            'email@@': pkg.email,
                            'licence@@': pkg.licence,
                            'copyright@@': pkg.copyright,
                            'date@@': grunt.template.today('dd-mm-yyyy')
                        }
                    }]
                },
                files: [
                    { expand: true, cwd: '<%= tmp %>/<%= pkg.version_clean %>/', src: ['**/**.xml'], dest: '<%= tmp %>/<%= pkg.version_clean %>/' }
                ]
            }
        },

        uglify: {
            options: {
                mangle: false,
                banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | http://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n'
            },

            other: {
                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>/',
                    src: ['**/*.js'],
                    dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                }]
            }
        },

        less: {},

        cssmin: {
            options: {
                banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | http://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n'
            },

            production: {
                options: {
                    banner: '/* <%= pkg.name %> - <%= pkg.version %> | <%= grunt.template.today("yyyy-mm-dd") %> | http://www.joomlacontenteditor.net | <%= pkg.copyright %> | <%= pkg.licence %> */\n',

                    processImport: false,
                    mediaMerging: false
                },

                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>/',
                    src: ['**/**.css'],
                    dest: '<%= tmp %>/<%= pkg.version_clean %>/'
                }]
            }
        },

        compress: {
            options: {
                mode: 'zip'
            },

            package: {
                options: {
                    archive: '<%= tmp %>/<%= pkg.version_clean %>.zip'
                },

                files: [{
                    expand: true,
                    cwd: '<%= tmp %>/<%= pkg.version_clean %>',
                    src: ['**/**']
                }, ]
            }
        },

        watch: {}
    });

    //grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('../../../../node_modules/grunt-shell');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-concat');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-less');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-clean');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-copy');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-uglify');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-compress');
    grunt.loadNpmTasks('../../../../node_modules/grunt-contrib-cssmin');
    grunt.loadNpmTasks('../../../../node_modules/grunt-replace');

    grunt.registerTask("setup", function() {
        if (pkg.development) {
            pkg.version += "" + pkg.development;
        }

        pkg.version_clean = 'plg_jce_' + pkg.name.replace(/-/g, '_') + '_' + pkg.version.replace(/[^\w-]+/g, '');
    });

    grunt.registerTask("default", ["setup", "clean:start", "copy:main", "replace", "uglify", "cssmin", "compress"]);
};