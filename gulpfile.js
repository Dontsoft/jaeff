const gulp = require('gulp');
const merge = require('merge-stream');
const gulpif = require('gulp-if');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const clean = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('gulp-scss-combine');
const namespace = require('./plugins/gulp-sass-namespace');

gulp.task('default', defaultTask);

function defaultTask(done) {
   done();
}

gulp.task('clean', () => {
   const del = require('del');
   return del('./dist/');
});

function compileSCSS(path, makeSourcemaps, makeClean) {
   return gulp.src(path)
               .pipe(combine())
               .pipe(namespace())
               .pipe(gulpif(makeSourcemaps, sourcemaps.init()))
               .pipe(sass().on('error', sass.logError))
               .pipe(postcss([autoprefixer()]))
               .pipe(gulpif(makeClean, clean({compatibility: 'ie8'})))
               .pipe(gulpif(makeSourcemaps, sourcemaps.write()))
               .pipe(gulp.dest('./dist/css/'));
}

function combineSCSS(path) {
   return gulp.src(path)
               .pipe(combine())
               .pipe(namespace())
               .pipe(gulp.dest('./dist/scss/'));
}

gulp.task('styles:dev', () => {
   const compiledSCSS = compileSCSS('src/*.scss', false, false);
   const rawSCSS = combineSCSS('src/*.scss');
   return merge(compiledSCSS, rawSCSS);
});

gulp.task('styles', gulp.series('clean', () => {
   const jaeff = compileSCSS('src/jaeff.scss', true, true);
   const jaeffFonts = compileSCSS('src/jaeff-fonts.scss', false, true);
   return merge(jaeff, jaeffFonts);
}));