var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
var bower = require('gulp-bower');

var maven = require('gulp-maven-deploy');
var zip = require('gulp-zip');
var cheerio = require('cheerio');
var fs = require('fs');
var version;

gulp.task('bower', function() {
    return bower();
});

gulp.task('copy-favicons', function() {
    return gulp.src([
        'src/favicons/*'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/favicons'));
});

gulp.task('copy-index', function() {
    return gulp.src([
        'src/index.html'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target'));
});

gulp.task('copy-robots', function() {
    return gulp.src([
        'src/robots.txt'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target'));
});

gulp.task('copy-webcomponents', function() {
    return gulp.src([
        './src/bower_components/webcomponentsjs/webcomponents-lite.min.js'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/bower_components/webcomponentsjs'));
});

gulp.task('copy-css', function() {
    return gulp.src([
        'src/styles/main.css'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/styles'));
});

gulp.task('copy-script', function() {
    return gulp.src([
        'src/scripts/dv.js'
    ], {
        base: ''
    })
        .pipe(gulp.dest('./target/scripts'));
});

gulp.task('vulcanize', function() {
    return gulp.src('src/elements/elements.html')
        .pipe(vulcanize({
            stripComments: true,
            inlineScripts: true,
            inlineCss: true
        }))
        .pipe(gulp.dest('./target/elements'));
});

gulp.task('read-pom', function () {
    var pom = fs.readFileSync('./pom.xml');
    var $ = cheerio.load(pom, { xmlMode: true });
    version = $('project').children('version').text();
});

gulp.task('jar', function() {
    var dvname = "dcache-view-" + version + ".jar";
    return gulp.src('./target/**')
        .pipe(zip(dvname))
        .pipe(gulp.dest('./target'));
});

gulp.task('build', ['copy-favicons', 'copy-index', 'copy-robots', 'copy-css', 'copy-script',
    'copy-webcomponents', 'vulcanize', 'read-pom']);

gulp.task('default', ['bower', 'build'], function () {
    gulp.start('jar');
});