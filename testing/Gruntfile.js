module.exports = function( grunt ) {

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    mochaTest: {
      test: {
        options: {
          reporter: "spec"
        },
        src: ["test/**/*.js"]
      }
    },
    jshint: {
      files: ["Gruntfile.js", "../*.js", "test/**/*.js"],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    copy: {
      main: {
        src: "../gadget.xml",
        dest: "../target/gadget.xml"
      }
    },
    watch: {
      files: ["<%= jshint.files %>", "../gadget.xml"],
      tasks: ["jshint", "mochaTest", "copy"]
    }
  });

  grunt.loadNpmTasks( "grunt-contrib-jshint" );
  grunt.loadNpmTasks( "grunt-mocha-test" );
  grunt.loadNpmTasks( "grunt-contrib-watch" );
  grunt.loadNpmTasks( "grunt-contrib-copy" );

  grunt.registerTask( "default", ["jshint", "mochaTest","copy"] );
  grunt.registerTask( "test", ["jshint", "copy"]);

};