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
        files:[
          {expand: true, src: "../*.xml", dest: "../target/*.xml"},
          {expand: true, src: "../*.js", dest: "../target/*.js"},
          {expand: true, src: "../*.css", dest: "../target/*.css"}
        ]
      }
    },
    watch: {
      files: ["<%= jshint.files %>", "../*.xml"],
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
