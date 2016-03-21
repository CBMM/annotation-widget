module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-htmlhint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['lib/**/*.js', 'src/moduleUtil.js', 'src/**/*.js'],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },
    jshint: {
      js_target: {
        src: ['src/**/*.js']
      }, //js_target
      options: { force: true }, //report JSHint errors but not fail the task
    },
    htmlhint: {
      build: {
        options: {
        'tag-pair': true,
        'tagname-lowercase': true,
        'attr-lowercase': true,
        'attr-value-double-quotes': true,
        'spec-char-escape': true,
        'id-unique': true
        },
        src: ['*.html']
      }
    },
    watch: {
      options: { livereload: true },
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify']
      },
      html: {
        files: ['demo/**/*.html'],
        tasks: ['htmlhint:build']
      },
      css: {
          files: ['src/**/*.css'],
      }
    },
    connect: {
      server: {
        options: {
          port: 8080,
          livereload: true,
          open: {
            target: 'http://localhost:8080/demo/AnnotatorPackageDemo.html'
          }
        }
      }
    },
    clean: {
      build: ['build'],
    },
  });

  grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('cwatch', ['connect', 'watch']);
  grunt.registerTask('all', ['jshint', 'htmlhint', 'concat', 'uglify']);


};
