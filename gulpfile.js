var gulp = require('gulp'),
	component = require('gulp-component');

gulp.task('components',function(){
	gulp.src('component.json').pipe(component()).pipe(gulp.dest('./build'));
});

