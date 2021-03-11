import { src, dest, task, watch, series, parallel } from 'gulp';
// PLUMBER
import plumber from 'gulp-plumber';
// HTML
import htmlmin from 'gulp-htmlmin';
// CSS
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import cleancss from 'gulp-clean-css';
import autoprefixer from 'autoprefixer';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps'
// JS
import babel from 'gulp-babel';
import terser from 'gulp-terser';
import concat from 'gulp-concat';
// PRODUCTION PLUGIN
import gulpif from 'gulp-if';
import del from 'del';
import yargs from 'yargs'
// BROWSERSYNC
import {init as server, stream, reload} from 'browser-sync';

// const PRODUCTION = yargs.argv.prod;

task('clean', () => del(['docs/**']))

task('clean-images', () => del(['app/img/**']))

const paths = {
  html: {
    htmlFile: 'dev/html-dev/*.html',
    dest: 'app/'
  },
  styles: {
    cssSources: 'dev/css/*.css',
    scss: 'dev/scss/*.scss',
    scssWatch: 'dev/scss/**/*.scss',
    dest: 'app/css'
  },
  js: {
    jsSources: 'dev/js-dev/src/*.js',
    jsMain: 'dev/js-dev/main.js',
    dest: 'app/js'
  },
  fonts: {
    files: 'dev/fonts/**',
    dest: 'app/fonts'
  },
  images: {
    files: 'dev/images/**/**',
    dest: 'app/img'
  },
  docs: {
    src: 'app/**',
    dest: 'docs/'
  }
}

task('html', () => {
  return src(paths.html.htmlFile)
  .pipe(plumber())
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true
  }))
  .pipe(rename('index.html'))
  .pipe(dest(paths.html.dest))
})

task('styles', () => {
  return src(paths.styles.scss)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(sass({outputStyle: "compressed"}).on('error', sass.logError))
  .pipe(postcss([autoprefixer()]))
  .pipe(rename('styles.min.css'))
  .pipe(sourcemaps.write())
  .pipe(dest(paths.styles.dest))
  .pipe(stream())
})

task('mainJs', () => {
  return(src(paths.js.jsMain))
  .pipe(plumber())
  .pipe(babel())
  .pipe(terser())
  .pipe(rename('main.min.js'))
  .pipe(dest(paths.js.dest))
})

task('compileCss', () => {
  return src(paths.styles.cssSources)
  .pipe(concat('resources.min.css'))
  .pipe(cleancss({compatibility: 'ie8'}))
  .pipe(dest(paths.styles.dest))
})

task('compileJs', () => {
  return(src(paths.js.jsSources))
  .pipe(concat('resources.min.js'))
  .pipe(terser())
  .pipe(dest(paths.js.dest))
})  

task('compileFonts', () => {
  return(src(paths.fonts.files))
  .pipe(dest(paths.fonts.dest))
})

task('compileImages', () => {
  return(src(paths.images.files))
  .pipe(dest(paths.images.dest))
})

task('docs', () => {
  return(src(paths.docs.src))
  .pipe(dest(paths.docs.dest))
})

task('startServer', (done) => {
  server({
    server: 'app/',
    injectChanges: true,
    open: false
  })
  done();
})

task('watch', () => {
  watch(paths.html.htmlFile, series('html')).on('change', reload)
  watch(paths.styles.scssWatch, series('styles'))
  watch(paths.styles.cssSources, series('compileCss'))
  watch(paths.js.jsSources, series('compileJs'))
  watch(paths.js.jsMain, series('mainJs')).on('change', reload)
  watch(paths.fonts.files, series('compileFonts'))
  watch(paths.images.files, series('compileImages'))
});

task('default', series('startServer', parallel('html', 'styles', 'mainJs', 'compileCss', 'compileJs', 'compileFonts', 'clean-images', 'compileImages'), 'watch'))

task('package', series('clean', 'docs'))