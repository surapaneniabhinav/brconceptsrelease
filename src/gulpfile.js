var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
//var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js','server/**/*.js','webapp/**/**/*.js'];

// to check the errors using jshint

gulp.task('style', function () {
    gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish',{
            verbose: true
        }))
        .pipe(jscs());
});

<!-- to inject files into index.html

gulp.task('inject',function () {
    var inject = require('gulp-inject');
    var injectSrc = gulp.src(['webapp/css/*.css','webapp/js/**/*.js'],{read:false});
    var injectOptions = {
        ignorePath: './webapp'
    }

    return gulp.src('webapp/*.html')
        .pipe(inject(injectSrc,injectOptions));
});

gulp.task('serve',['style','inject'],function () {
    var options = {
        script: 'server/server.js',
        delayTime: 1,
        env: {
            'PORT': 5000
        },
        watch: jsFiles
    }
    return nodemon(options)
        .on('restart',function (ev) {
            console.log('Restarting...');
        })
})

-->