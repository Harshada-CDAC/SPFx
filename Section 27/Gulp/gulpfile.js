'use strict';

if (process.argv.indexOf('all-in-one-go') !== -1) {
    process.argv.push('--ship');
}

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');

// Suppress specific warnings
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

// Initialize build
build.initialize(gulp);

// Define the clean task
function clean(cb) {
    // Your clean logic here (if any)
    console.log('Cleaning...');
    cb();
}

// Define the build task
function buildTask(cb) {
    // Your build logic here (if any)
    console.log('Building...');
    cb();
}

// Define the bundle task
function bundle(cb) {
    // Your bundling logic here (if any)
    console.log('Bundling...');
    cb();
}

// Define the package solution task
function packageSolution(cb) {
    // Your packaging logic here (if any)
    console.log('Packaging solution...');
    cb();
}

// Create the composite task
gulp.task('all-in-one-go', gulp.series(clean, buildTask, bundle, packageSolution));
