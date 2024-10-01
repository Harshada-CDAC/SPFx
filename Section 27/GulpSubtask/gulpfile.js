'use strict';
 
const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
 
// Suppress the specific warning about CSS class naming
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);
 
// Override the default tasks to serve the deprecated serve task
const getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  const result = getTasks.call(build.rig);
 
  result.set('serve', result.get('serve-deprecated'));
 
  return result;
};
 
// Define a pre-build task
const preBuildTask = build.subTask('pre-build', function(gulp, buildOptions, done) {
  this.log('Running pre-build tasks...');
 
  // Add your pre-build logic here
 
  done(); // Call done() when the task is complete
});
 
// Define a post-build task
const postBuildTask = build.subTask('post-build', function(gulp, buildOptions, done) {
  this.log('Running post-build tasks...');
 
  // Add your post-build logic here
 
  done(); // Call done() when the task is complete
});
 
// Define a sub-task
const subtaskBuildChild1 = build.subTask('sub-task-buildChild1', function(gulp, buildOptions, done) {
  console.log('Subtask build child1 through console.log');
  this.log('Starting build child1 through this.log');
 
  // Logging warning
  this.logWarning('This is a warning from subtask build child1.');
 
  // Logging error
  this.logError('This is log error from subtask build child1.');
 
  // File warning
  this.fileWarning('Warning in sample1.ts', {
    line: 10,
    column: 5,
    code: 'SAMPLE_WARNING_CODE'
  });
 
  this.fileError('Error in sample1.ts', {
    line: 20,
    column: 10,
    code: 'SAMPLE_ERROR_CODE'
  });
 
  done(); // Call done() when the task is complete
});
 
// Register the sub-tasks with the build process
build.task('pre-build', preBuildTask);
build.task('sub-task-buildChild1', subtaskBuildChild1);
 
// sub-task 2
const subtaskBuildChild2 = build.subTask('sub-task-buildChild2', function(gulp, buildOptions, done) {
  this.log('Starting build child2 through this.log');
 
  done();
});
 
build.task('sub-task-buildChild2', subtaskBuildChild2);
 
// Register the post-build task
build.task('post-build', postBuildTask);
 
// Initialize the build process
build.initialize(gulp);
 
// Define the build task sequence
gulp.task('build', gulp.series('pre-build', 'sub-task-buildChild1', 'sub-task-buildChild2', 'post-build'));
 
