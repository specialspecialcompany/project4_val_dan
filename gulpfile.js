const gulp = require("gulp");
const babel = require("babelify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const browserSync = require("browser-sync");
const reload = browserSync.reload;
const notify = require("gulp-notify");
const sass = require("gulp-sass");
const concat = require("gulp-concat");
const autoprefixer = require("autoprefixer");

gulp.task("styles", () => {
  return (
    gulp
      .src("./dev/styles/**/*.scss")
      .pipe(sass().on("error", sass.logError))
      // .pipe(autoprefixer())
      .pipe(concat("main.css"))
      .pipe(gulp.dest("./dev/styles"))
  );
});

gulp.task("bs", () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

gulp.task("default", ["bs", "styles"], () => {
  gulp.watch("dev/**/*.scss", ["styles"]);
  gulp.watch("./dev/styles/main.css", reload);
  gulp.watch("./*.html", reload);
});
