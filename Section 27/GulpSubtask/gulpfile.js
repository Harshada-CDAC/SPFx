'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

// Suppress warnings if needed
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Initialize the build system with gulp
build.initialize(gulp);

// Define sub-tasks using build.subTask
gulp.task('sub-task-buildChild1', build.subTask('sub-task-buildChild1', function(gulp, buildOptions, done) {
    this.log('sub-task-buildChild1 is running');
    done();
}));

gulp.task('sub-task-buildChild2', build.subTask('sub-task-buildChild2', function(gulp, buildOptions, done) {
    this.log('sub-task-buildChild2 is running');
    done();
}));

// Define the main build task and add dependencies
gulp.task('build', gulp.series('sub-task-buildChild1', 'sub-task-buildChild2'));
