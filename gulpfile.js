const gulp = require('gulp');
const shelljs = require('shelljs');

gulp.task('doc', done => {
  shelljs.exec('yarn run jsdoc');
  done();
});

gulp.task('default', () => {
  // shelljs.exec('yarn run jsdoc');
  gulp.watch('./src/**/*.?(tsx|ts)', gulp.series('doc'));
});
