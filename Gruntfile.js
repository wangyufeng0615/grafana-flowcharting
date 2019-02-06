var path = require("path"),
  fs = require("fs");

module.exports = (grunt) => {
  require('load-grunt-tasks')(grunt);

  grunt.loadNpmTasks('grunt-execute');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-sass');
  const sass = require('node-sass');
  grunt.initConfig({

    clean: {
      options: {
        force: true
      },
      stuff: ['dist']
    },

    copy: {
      src_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['**/*', '!**/*.js', '!**/*.scss', '!img/**/*', '.*'],
        dest: 'dist'
      },
      externals_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['externals/**/*'],
        dest: 'dist'
      },
      libs_to_dist: {
        cwd: 'node_modules',
        expand: true,
        src: ['mxgraph/javascript/dist/**/*'],
        dest: 'dist/libs'
      },
      res_to_dist: {
        cwd: 'node_modules/mxgraph/javascript/src',
        expand: true,
        src: ['**/*'],
        dest: 'dist/libs/mxgraph/javascript/dist'
      },
      readme: {
        expand: true,
        src: ['README.md'],
        dest: 'dist',
      },
      img_to_dist: {
        cwd: 'src',
        expand: true,
        src: ['img/**/*'],
        dest: 'dist/'
      },
    },



    watch: {
      rebuild_all: {
        files: ['src/**/*', 'README.md'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      },
    },


    sass: {
      options: {
        sourceMap: true,
        implementation: sass,
      },
      dist: {
        files: {
          'dist/css/diagram.css': 'src/css/flowchart.scss'
        }
      }
    },

    babel: {
      dist: {
        files: [{
          cwd: 'src',
          expand: true,
          src: ['*.js'],
          dest: 'dist',
          ext: '.js'
        }]
      },
    },

    webpack: {
      mxgraph: {
        entry: "./src/mxgraphinterface.js",
        mode: "development",
        module: {
          rules: [
              {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|externals)/,
                use: {
                  loader: 'babel-loader',
                }
              }
            ]
        },
        output: {
          path: path.resolve(process.cwd(), "./dist"),
          filename: "mxgraphinterface.js",
          library: "mxLibrary",
          libraryTarget: "umd"
        }
      }
    },

  });

  grunt.registerTask('default', ['clean', 'copy:src_to_dist', 'sass', 'copy:readme', 'copy:img_to_dist', 'babel', 'webpack', 'copy:libs_to_dist', 'copy:res_to_dist' ]);
};
