const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const rename = require('gulp-rename');
const sass = require('gulp-sass');

const paths = {
    src: {
        css: {
            dir: './static/css'
        },
        scss: {
            main: './scss/*.scss'
        },
        js: {
            dir: './static/js'
        }
    }
}

gulp.task('scss', function() {
    return gulp
        .src(paths.src.scss.main)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cleancss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.src.css.dir));
});

gulp.task('js', function() {
    return gulp.src([
        'node_modules/@popperjs/core/dist/umd/popper.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
    ])
    .pipe(gulp.dest(paths.src.js.dir));
});

gulp.task('default', gulp.series('scss', 'js'));
