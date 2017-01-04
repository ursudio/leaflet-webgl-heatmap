var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('default', ['bs']);

gulp.task('bs', function() {
    return browserSync.init({
        server: {
            baseDir: "./"
        },
        ui : false,
        watchOptions: {
            ignoreInitial: true,
            ignored: 'node_modules/*'
        },
		files : ['./**/*.html','./**/*.css', './**/*.js']
    });
});

gulp.task('build', function () {
    return gulp.src(['./dist/webgl-heatmap-leaflet.js'])
        .pipe(uglify({
            preserveComments : 'license'
        }))
        .pipe(rename({
            extname : ".min.js"
        }))
        .pipe(gulp.dest('./dist/'));
});