﻿/// <binding BeforeBuild='build' />
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    uglify = require('gulp-uglify'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    rimraf = require('rimraf'),
    launch = require('./Properties/launchSettings.json');

var environment = {
    development: 'Development',
    staging: 'Staging',
    production: 'Production',
    current: function () {
        var environ = process.env.ASPNETCORE_ENVIRONMENT || (launch && launch.profiles['IIS Express'].environmentVariables.ASPNETCORE_ENVIRONMENT) || this.development;
        return environ;
    },
    isDevelopment: function () {
        return this.current() === this.development;
    },
    isStaging: function () {
        return this.current() === this.staging;
    },
    isProduction: function () {
        return this.current() === this.production;
    }
};


/*********************************************************************
 * Paths Set Up
 *********************************************************************/
var paths = {
    webroot: "./wwwroot/",
    externalJs: [
        "./bower_components/jquery/dist/jquery" + (!environment.isDevelopment ? ".min" : "") + ".js",
        "./bower_components/bootstrap/dist/js/bootstrap" + (!environment.isDevelopment ? ".min" : "") + ".js"
    ],
    externalCss: [
        "./bower_components/bootstrap/dist/css/bootstrap" + (!environment.isDevelopment ? ".min" : "") + ".css",
        "./bower_components/bootstrap/dist/css/bootstrap-theme" + (!environment.isDevelopment ? ".min" : "") + ".css"
    ],
    appJs: [
        './JsApp/utils.js',
        './JsApp/main.js',
        // for all files use: './JsApp/**/*.js'*/
    ]
};
paths.bootstrapFonts = "./bower_components/bootstrap/dist/fonts/*";
paths.jsDest = paths.webroot + "js";
paths.cssDest = paths.webroot + "css";
paths.fontsDest = paths.webroot + "fonts";

/*********************************************************************
 * Taskas
 *********************************************************************/

// Clean (optional)
gulp.task('clean-css', function (cb) {
    return rimraf(paths.cssDest, cb);
});
gulp.task('clean-js', function (cb) {
    return rimraf(paths.jsDest, cb);
});
gulp.task('clean-fonts', function (cb) {
    return rimraf(paths.fontsDest, cb);
});
gulp.task('clean-build', ['clean-css', 'clean-js', 'clean-fonts']);

// Fonts
gulp.task('boot-fonts', function () {
    return gulp.src(paths.bootstrapFonts)
            .pipe(gulp.dest(paths.fontsDest));
});

// External libs
gulp.task('build-external-js', function () {
    return gulp.src(paths.externalJs).pipe(gulp.dest(paths.jsDest));
});
gulp.task('build-external-css', function () {
    return gulp.src(paths.externalCss).pipe(gulp.dest(paths.cssDest));
});

// JavaScript application & css
gulp.task('build-js', function () {
    return gulp.src(paths.appJs)
            .pipe(concat('app.js'))
            .pipe(gulpif(!environment.isDevelopment(), uglify()))
            .pipe(gulp.dest(paths.jsDest));
});

gulp.task('build-css', function () {
    return gulp.src(['./Styles/**/*.css'])
            .pipe(concat('app.css'))
            .pipe(gulpif(!environment.isDevelopment(), cssmin()))
            .pipe(gulp.dest(paths.cssDest));
});

/*********************************************************************
 * Build
 *********************************************************************/
gulp.task('prepare', ['build-external-css', 'build-external-js', 'build-css', 'build-js', 'boot-fonts']);
gulp.task('build', ['prepare']);

/*********************************************************************
 * Watchers
 *********************************************************************/
gulp.task('build-watcher', function () {
    gulp.watch(['./JsApp/**/*.js', './Styles/**/*.css'], ['build']);
});