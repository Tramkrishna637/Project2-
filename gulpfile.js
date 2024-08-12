const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const cssnano = require('gulp-cssnano');
const uglify = require('gulp-uglify');

gulp.task('css', async () => {
  const { default: rev } = await import('gulp-rev');

  console.log('minifying css...');
  gulp.src('./assets/sass/**/*.scss')
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest('./assets.css'));

  return gulp.src('./assets/**/*.css')
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
      cwd: 'public',
      merge: true
    }))
    .pipe(gulp.dest('./public/assets'));
});
gulp.task('js',async function(done){
    const { default: rev } = await import('gulp-rev');
    console.log('minifying js....');

    gulp.src('./assets/**/*.js')
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true,
    }))
    .pipe(gulp.dest('./public/assets'));
    done()

});

gulp.task('images',async function(done){
    const { default: rev } = await import('gulp-rev');
    const imagemin = (await import('gulp-imagemin')).default;
    console.log('image minifying');

    gulp.src('./assets/**/*.+(png|jpg|gif|svg|.jpeg)')
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest('./public/assets'))
    .pipe(rev.manifest({
        cwd:'public',
        merge:true
    }))
    .pipe(gulp.dest('./public/assets'));
    done();
});

gulp.task('clean:assets',async function(done){
    const del = (await import('del')).default;
    `await del('./public/assets')`;
    done();
});

gulp.task('build',gulp.series('clean:assets','css','js','images'),function(done){
    console.log('building assets');
    done();
})



// Uncomment and modify the following task if you need the revreplace task
// gulp.task('revreplace', ['revision'], async () => {
//   const manifest = gulp.src('./public/assets/rev-manifest.json');

//   return gulp.src('dist/**/*.html')
//     .pipe(revReplace({ manifest }))
//     .pipe(gulp.dest('dist'));
// });

gulp.task('default', gulp.series('css'));




