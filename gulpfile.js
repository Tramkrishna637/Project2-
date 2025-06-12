const gulp = require('gulp');
const path = require('path');

const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');

const uglify = require('gulp-uglify-es').default;

const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminMozjpeg = require('imagemin-mozjpeg');

const rev = require('gulp-rev');
const revRewrite = require('gulp-rev-rewrite');

const del = require('del');

gulp.task('css', function() {
    console.log('Starting CSS minification and revisioning...');
    return gulp.src('./assets/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(cssnano())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/css'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: process.cwd() + '/public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
});

gulp.task('js', function() {
    console.log('Starting JS minification and revisioning...');
    return gulp.src('./assets/**/*.js')
        .pipe(uglify())
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/js'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: process.cwd() + '/public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
});

gulp.task('images', function() {
    console.log('Starting image optimization and revisioning...');
    return gulp.src('./assets/**/*.+(png|jpg|gif|svg|jpeg)')
        .pipe(imagemin([
            imageminPngquant({ quality: [0.6, 0.8] }),
            imageminMozjpeg({ quality: 75, progressive: true }),
            imagemin.gifsicle({ interlaced: true }),
            imagemin.svgo({ plugins: [{ name: 'removeViewBox', active: false }] })
        ]))
        .pipe(rev())
        .pipe(gulp.dest('./public/assets/images'))
        .pipe(rev.manifest('public/assets/rev-manifest.json', {
            base: process.cwd() + '/public/assets',
            merge: true
        }))
        .pipe(gulp.dest('./public/assets'));
});

gulp.task('clean:assets', function() {
    console.log('Cleaning public assets directory...');
    return del(['./public/assets'], { force: true });
});

gulp.task('revision-rewrite', function() {
    console.log('Rewriting asset paths in views...');
    const manifestPath = path.join(process.cwd(), 'public', 'assets', 'rev-manifest.json');
    const manifest = gulp.src(manifestPath);

    return gulp.src('./views/**/*.ejs')
        .pipe(revRewrite({ manifest: manifest }))
        .pipe(gulp.dest('./views'));
});

gulp.task('build', gulp.series(
    'clean:assets',
    gulp.parallel('css', 'js', 'images'),
    'revision-rewrite'
), function(done) {
    console.log('Build process completed!');
    done();
});

gulp.task('default', gulp.series('build'));




