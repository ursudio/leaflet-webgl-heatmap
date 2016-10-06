var gulp = require('gulp'),
    browserSync = require('browser-sync').create();

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