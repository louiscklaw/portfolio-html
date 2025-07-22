const { task } = require('gulp');
const { series } = require('gulp');
const fs = require('fs');
var prettify = require('gulp-html-prettify');
var gulp = require('gulp');

var Markdown = require('markdown-to-html').Markdown;
var md = new Markdown();
md.bufmax = 2048;
var fileName = 'src/portfolio.md';
var opts = { title: 'Louis Prompt' };
var outputHtmlFile = 'dist/portfolio.html';
const minify = require('gulp-minify');

const clean = function (cb) {
  fs.rm('docs', { recursive: true, force: true }, () => {
    fs.mkdir('docs', cb);
    console.log('done');
  });
};
clean.displayName = 'clean:all';

task(clean);

function build(cb) {
  // body omitted

  md.render(fileName, opts, function (err) {
    if (err) {
      console.error('>>>' + err);
      process.exit();
    }

    // console.log(md.html)
    md.html = md.html.replace(/ id=".+?"/g, '');
    md.html = md.html.replace(/ class=".+?"/g, '');

    // md.pipe(process.stdout);
    fs.writeFile(outputHtmlFile, md.html, err => {
      if (err) {
        console.error('Error writing file:', err);
        process.exit(1);
      }
    });
  });

  cb();
}
build.description = 'Build the project';
build.flags = { '-e': 'An example flag' };

task(build);

function prettifyHTML() {
  return gulp
    .src('dist/*.html')     // Source HTML files (adjust path as needed)
    .pipe(prettify({
      indent_size: 2,         // Indentation size
      indent_char: ' ',       // Indentation character
      unformatted: ['code', 'pre', 'em', 'strong'] // Skip formatting for these tags
    }))
    .pipe(gulp.dest('docs')); // Output directory
}

task(prettifyHTML);
