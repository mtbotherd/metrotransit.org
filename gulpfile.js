var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// Development Tasks
// -----------------

// Start browserSync server
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    })
});

// Copy JS to src
gulp.task('javascript', function() {
    //return gulp.src('node_modules/jquery/dist/jquery.js')
    return gulp.src([
            'node_modules/bootstrap/js/transition.js',
            'node_modules/bootstrap/js/collapse.js'
        ])
        .pipe(gulp.dest('src/js'))
});

// Compile sass to css
gulp.task('sass', function() {
    //return gulp.src('src/scss/**/*.scss')
    return gulp.src('src/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});


// Watchers
gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/*.html', browserSync.reload);
    gulp.watch('src/js/**/*.js', browserSync.reload);
});

// Optimization Tasks
// ------------------

// Optimize CSS and JS
gulp.task('useref', function() {
    return gulp.src('src/*.html') // Grabs CSS and JS from HTML document
        .pipe(useref())
        //.pipe(gulpIf('*.js', uglify())) // Minifies only if it's a js file
        //.pipe(gulpIf('*.css', cssnano())) // Minifies only if it's a css file
        .pipe(gulp.dest('dist'))
});

// Optimize Media Images
gulp.task('mediaimages', function() {
    return gulp.src('src/Data/sites/1/media/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            interlaced: true
        })) // refer to https://github.com/sindresorhus/gulp-imagemin for optimization options available based on file type.
        .pipe(gulp.dest('dist/Data/sites/1/media'))
});
// Optimize Skin Images
gulp.task('skinsimages', function() {
    return gulp.src('src/Data/sites/1/skins/**/*.+(png|jpg|gif|svg)')
        .pipe(imagemin({
            interlaced: true
        })) // refer to https://github.com/sindresorhus/gulp-imagemin for optimization options available based on file type.
        .pipe(gulp.dest('dist/Data/sites/1/skins'))
});

// Copy Fonts
gulp.task('fonts', function() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

// Clean Dist
gulp.task('clean', function() {
    return del.sync('dist').then(function(cb) {
        return cache.clearAll(cb);
    });
})

gulp.task('clean:dist', function() {
    return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
});

// Build Sequence
// --------------
gulp.task('default', function(callback) {
    runSequence(['javascript', 'sass', 'browserSync'], 'watch',
        callback
    )
});

gulp.task('build', function(callback) {
    runSequence(
        'clean:dist',
        'sass', ['useref', 'mediaimages', 'skinsimages', 'fonts'],
        callback
    )
});
