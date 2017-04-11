'use strict';

//ÒýÈëÄ£¿é
let gulp = require('gulp');
let less = require('gulp-less');//±àÒëlessÎªcss

let webpack = require('gulp-webpack');//½«jsºÏ²¢
let webpackConfig = require('./webpack.config');

//¿ªÊ¼ÈÎÎñ
//±àÒëlessÎªcss²¢Ñ¹Ëõ
gulp.task('less-css', () => {
    return gulp.src('./src/css/less/*.less')
        .pipe( less() )
        .pipe( gulp.dest('./public/css') );
});

//´¦ÀíjsÑ¹Ëõ£¬±àÒëes6Îªes5
gulp.task('webpack', function() {
    return gulp.src('./src/js/*.js')
        .pipe(webpack( webpackConfig ))
        .pipe(gulp.dest('./public/js'));
});
//¿ªÊ¼ÈÎÎñ

//Í³Ò»´¦ÀíÈÎÎñ
gulp.task('default', ['less-css','webpack'], ()=> {

});

//¼àÌý
gulp.watch('./src/css/less/**/*.less', ['less-css']);//less×ªcss
gulp.watch('./src/js/**/*.js', ['webpack']);//´¦Àíjs