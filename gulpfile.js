const gulp = require('gulp');
const merge = require('merge-stream');
const gulpif = require('gulp-if');
const del = require('del');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const log = require('gulplog');
const bump = require('gulp-bump');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const browserify = require('browserify');

const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const clean = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const combine = require('gulp-scss-combine');
const namespace = require('./plugins/gulp-sass-namespace');

function compileSCSS(path, makeSourcemaps, makeClean) {
   return gulp.src(path)
               .pipe(combine())
               .pipe(namespace())
               .pipe(gulpif(makeSourcemaps, sourcemaps.init()))
               .pipe(sass().on('error', sass.logError))
               .pipe(postcss([autoprefixer()]))
               .pipe(gulpif(makeClean, clean({compatibility: 'ie8'})))
               .pipe(gulpif(makeSourcemaps, sourcemaps.write('./')))
               .pipe(gulpif(makeClean, gulp.dest('./dist/css/')))
               .pipe(gulpif(!makeClean, gulp.dest('./dist/dev/css/')));
}

function combineSCSS(path, dev) {
   return gulp.src(path)
               .pipe(combine())
               .pipe(namespace())
               .pipe(gulpif(!dev, gulp.dest('./dist/scss/')))
               .pipe(gulpif(dev, gulp.dest('./dist/dev/scss/')));
}

function compileJS(path, makeSourcemaps, makeUgly) {
   var b = browserify({
      entries: path,
   });
   return b.bundle()
   .pipe(source('jaeff.js'))
   .pipe(buffer())
   .pipe(gulpif(makeSourcemaps, sourcemaps.init({loadMaps: true})))
   .pipe(babel({presets: ['@babel/env']}))
   .pipe(gulpif(makeUgly, uglify()))
   .on('error', log.error)
   .pipe(gulpif(makeSourcemaps, sourcemaps.write('./')))
   .pipe(gulpif(makeUgly, gulp.dest('./dist/')))
   .pipe(gulpif(!makeUgly, gulp.dest('./dist/dev/')));
}

gulp.task('styles:dev:clean', () => {
   return del([
      './dist/dev/css',
      './dist/dev/scss'
   ]);
});

gulp.task('styles:clean', () => {
   return del([
      './dist/css',
      './dist/scss'
   ]);
});

gulp.task('styles:dev', gulp.series('styles:dev:clean', () => {
   const compiledSCSS = compileSCSS('src/*.scss', false, false);
   const rawSCSS = combineSCSS('src/*.scss', true);
   return merge(compiledSCSS, rawSCSS);
}));

gulp.task('styles', gulp.series('styles:clean', () => {
   const jaeff = compileSCSS('src/jaeff.scss', true, true);
   const jaeffFonts = compileSCSS('src/jaeff-fonts.scss', false, true);
   const jaeffFunctions = compileSCSS('src/_functions.scss', false, true);
   const rawSCSS = combineSCSS('src/*.scss', false);
   return merge(jaeff, jaeffFonts, jaeffFunctions, rawSCSS);
}));

gulp.task('scripts:dev:clean', () => {
   return del('./dist/dev/*.js*');
});

gulp.task('scripts:clean', () => {
   return del('./dist/*.js*');
});

gulp.task('scripts:dev', gulp.series('scripts:dev:clean', () => {
   return compileJS('src/index.js', false, false);
}));

gulp.task('scripts', gulp.series('scripts:clean', () => {
   return compileJS('src/index.js', true, true);
}));

gulp.task('v-patch', () => {
   return gulp.src('./package*json')
               .pipe(bump())
               .pipe(gulp.dest('./'));
});

gulp.task('v-minor', () => {
   return gulp.src('./package*json')
               .pipe(bump({type: 'minor'}))
               .pipe(gulp.dest('./'));
});

gulp.task('v-major', () => {
   return gulp.src('./package*json')
               .pipe(bump({type: 'major'}))
               .pipe(gulp.dest('./'));
});

gulp.task('v-prerelease', () => {
   return gulp.src('./package*json')
               .pipe(bump({type: 'prerelease'}))
               .pipe(gulp.dest('./'));
});

gulp.task('dev', gulp.parallel('styles:dev', 'scripts:dev'));
gulp.task('default', gulp.parallel('styles', 'scripts'));
