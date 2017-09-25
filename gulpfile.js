var gulp = require('gulp');
var electron = require('electron-connect').server.create();

gulp.task('watch:electron', function () {
  electron.start();
  gulp.watch(['./*.js','./app/*.{html,js,css}','./src/*.js'], electron.restart);
  gulp.watch(['./app/*.{html,js,css}','./src/*.{html,js,css}'], electron.reload);
}); 