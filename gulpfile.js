const gulp = require('gulp');
const shelljs = require('shelljs');
const browserSync = require('browser-sync').create();

const build = () => {
  shelljs.exec('yarn run doc:build');
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: './docs',
    },
  });
  gulp.watch('./docs/**/*.*').on('change', browserSync.reload);
};

const docing = () => {
  build();
  gulp.watch('./src/**/*.?(tsx|ts)').on('change', () => {
    build();
  });
};

gulp.task('default', () => {
  docing();
  serve();
});
