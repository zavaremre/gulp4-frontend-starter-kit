/**
 * Dependencies
 * -----------------------------------------------------------------------------
 */

/**
 * If 'npm install' not working!
 * npm install babel-core babel-preset-env del gulp gulp-autoprefixer gulp-babel gulp-cssmin gulp-if gulp-imagemin gulp-include gulp-plumber gulp-prettify gulp-pug gulp-rename gulp-sass gulp-uglify gulp-util live-server run-sequence --save-dev
 * -----------------------------------------------------------------------------
 */

/* ========================= Gulp ========================= */
const gulp = require('gulp');
/* ========================= Sass ========================= */
sass = require('gulp-sass')
sassGlob = require('gulp-sass-glob')
tildeImporter = require('node-sass-tilde-importer')
cssimport = require("gulp-cssimport")
autoprefixer = require('gulp-autoprefixer')
cssmin = require('gulp-cssmin')
uglify = require('gulp-uglify')
plumber = require('gulp-plumber')
cssbeautify = require('gulp-cssbeautify')
// svgInject = require('gulp-svg-inject');
// svgmin = require('gulp-svgmin');
/* ========================= Babel ========================= */
babel = require('gulp-babel')
/* ========================= Image ========================= */
imagemin = require('gulp-imagemin')
/* ========================= File Name & Includes ========================= */
rename = require('gulp-rename')
formatHtml = require('gulp-format-html')
include = require('gulp-include')
/* ========================= Eror Reporting ========================= */
del = require('del')
/* ========================= Compaile & Server ========================= */
gulpif = require('gulp-if')
sequence = require('run-sequence')
liveServer = require("live-server")
pug = require('gulp-pug')
ftp = require('vinyl-ftp')
fs = require('vinyl-fs');
gutil = require('gulp-util')
watch = require('gulp-watch')
browserSync = require('browser-sync').create(),
    data = require('gulp-data');
rimraf = require('rimraf')
/*
 * Output Css & Js File Name and Set Paths
 * -----------------------------------------------------------------------------
 */

node_dependencies = Object.keys(require('./package.json').dependencies || {});


demo = false, //Minified file include
    ThemeName = 'dist/',
    path = {
        base: './',
        developmentDir: 'src',
        productionDir: ThemeName
    };



var paths = {
    styles: {
        src: path.developmentDir + '/scss/main.scss',
        dest: path.productionDir + '/theme/assets/css',
        destMin: path.productionDir + 'theme.min/assets/css'
    },
    fancybox: {
        src: path.developmentDir + '/scss/plugins/fancybox/**/*',
        dest: path.productionDir + '/theme/assets/css',
        destMin: path.productionDir + 'theme.min/assets/css',
    },
    bootstrap: {
        src: path.developmentDir + '/scss/plugins/bootstrap/**/*',
        dest: path.productionDir + '/theme/assets/css',
        destMin: path.productionDir + 'theme.min/assets/css',
    },
    icofont: {
        src: path.developmentDir + '/scss/plugins/icofont/icofont.scss',
        dest: path.productionDir + '/theme/assets/css',
        destMin: path.productionDir + 'theme.min/assets/css',
    },
    fontsCopy: {
        src: path.developmentDir + '/fonts/**',
        dest: path.productionDir + '/theme/assets/fonts',
        destMin: path.productionDir + 'theme.min//assets/fonts',
    },
    includes: {
        src: path.developmentDir + '/src/*',
        dest: path.productionDir + '/theme/assets'

    },
    bootstrapJS: {
        src: path.developmentDir + '/js/bootstrap.js',
        dest: path.productionDir + '/theme/assets/js',
        destMin: path.productionDir + 'theme.min/assets/js',
    },
    pluginsJS: {
        src: path.developmentDir + '/js/plugins.js',
        dest: path.productionDir + '/theme/assets/js',
        destMin: path.productionDir + 'theme.min/assets/js',
    },
    configJS: {
        src: path.developmentDir + '/js/config.js',
        dest: path.productionDir + '/theme/assets/js',
        destMin: path.productionDir + 'theme.min/assets/js',
    },
    vendors: {
        src: path.developmentDir + '/vendors/*',
        dest: path.productionDir + '/theme/assets/js',
        destMin: path.productionDir + 'theme.min/assets/js',
    },
    gulpPug: {
        src: path.developmentDir + '/pug/**/*',
        dest: path.productionDir + '/theme',
        destMin: path.productionDir + 'theme.min'
    },
    images: {
        src: path.developmentDir + '/images/**/*.+(png|jpg|jpeg|gif|svg|ico)',
        dest: path.productionDir + '/theme/assets/img',
        destMin: path.productionDir + 'theme.min/assets/img'
    },

};
gulp.task('delete-dist', function (cb) {
    rimraf(path.productionDir + '/', cb);
});


/**
 * 
 * Fonts html file
 * -----------------------------------------------------------------------------
 */
gulp.task('copy', () => {
    return gulp.src(paths.fontsCopy.src)
        //Save files
        .pipe(gulp.dest(paths.fontsCopy.dest))
        .pipe(gulp.dest(paths.fontsCopy.destMin))

});

/**
 * Include html file
 * -----------------------------------------------------------------------------
 */
gulp.task('includes', () => {
    return gulp.src(paths.includes.src)
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))

        .pipe(formatHtml())
        .pipe(gulp.dest(paths.includes.dest));
});

gulp.task('gulpPug', () => {
    return gulp.src(paths.gulpPug.src)
        .pipe(plumber())

        .pipe(pug({
            pretty: false
        }))
        .pipe(gulp.dest(paths.gulpPug.destMin))
        .pipe(pug({
            pretty: true
        }))
        .pipe(formatHtml())
        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(gulp.dest(paths.gulpPug.dest))

        .pipe(plumber.stop())

});

/**
 * Build styles with Plugins
 * -----------------------------------------------------------------------------
 */
var options = {
    extensions: ["css", "scss"] // process only css
};

gulp.task('fancybox', () => {

    //Select files
    return gulp.src(paths.fancybox.src)
        .pipe(plumber())
        //Compile Sass
        .pipe(sassGlob()) //this was what I was missing
        .pipe(sass({
            importer: tildeImporter
        }))
        .pipe(cssimport(options))

        //Add vendor prefixes
        .pipe(autoprefixer({
            browsers: ['last 4 version'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        //Save unminified file
        .pipe(gulp.dest(paths.fancybox.dest))
        //Optimize and minify
        .pipe(cssmin())
        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        //Save minified file
        .pipe(gulp.dest(paths.fancybox.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())

});

/**
 * Build styles with Style SCSS
 * -----------------------------------------------------------------------------
 */
gulp.task('styles', () => {
    //Select files
    return gulp.src(paths.styles.src)
        .pipe(plumber())
        //Compile Sass
        .pipe(cssimport(options))
        .pipe(sassGlob()) //this was what I was missing
        .pipe(sass({
            importer: tildeImporter
        }))

        //Add vendor prefixes
        .pipe(autoprefixer({
            browsers: ['last 4 version'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        //Save unminified file
        .pipe(gulp.dest(paths.styles.dest))
        //Optimize and minify
        .pipe(cssmin())
        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        //Save minified file
        .pipe(gulp.dest(paths.styles.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())

});
/**
 * Build styles with Bootstrap
 * -----------------------------------------------------------------------------
 */
gulp.task('bootstrap', () => {

    //Select files
    return gulp.src(paths.bootstrap.src)
        .pipe(plumber())
        //Compile Sass
        .pipe(cssimport(options))
        .pipe(sassGlob()) //this was what I was missing
        .pipe(sass({
            importer: tildeImporter
        }))

        //Add vendor prefixes
        .pipe(autoprefixer({
            browsers: ['last 4 version'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        //Save unminified file
        .pipe(gulp.dest(paths.bootstrap.dest))
        //Optimize and minify
        .pipe(cssmin())
        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        //Save minified file
        .pipe(gulp.dest(paths.bootstrap.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())

});



/**
 * Build styles with icofont
 * -----------------------------------------------------------------------------
 */
gulp.task('icofont', () => {


    //Select files
    return gulp.src(paths.icofont.src)
        .pipe(plumber())
        //Compile Sass
        .pipe(cssimport(options))
        .pipe(sassGlob()) //this was what I was missing
        .pipe(sass({
            importer: tildeImporter
        }))

        //Add vendor prefixes
        .pipe(autoprefixer({
            browsers: ['last 4 version'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(cssbeautify({
            indent: '  ',
            openbrace: 'separate-line',
            autosemicolon: true
        }))
        //Save unminified file
        .pipe(gulp.dest(paths.icofont.dest))
        //Optimize and minify
        .pipe(cssmin())
        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        //Save minified file
        .pipe(gulp.dest(paths.icofont.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())

});

/**
 * Build scripts with ES6/Babel
 * -----------------------------------------------------------------------------
 */
gulp.task('pluginsJS', () => {

    //Select files
    return gulp.src(paths.pluginsJS.src)
        .pipe(plumber())
        //Concatenate includes
        .pipe(include())
        //Transpile
        .pipe(babel({
            presets: [
                ['env', {
                    loose: true,
                    modules: false
                }]
            ] //'use-strict' deleted
        }))
        //Save unminified file
        .pipe(gulpif(!demo, gulp.dest(paths.pluginsJS.dest)))
        //Optimize and minify

        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        //Save minified file
        .pipe(gulp.dest(paths.pluginsJS.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())
});
gulp.task('configJS', () => {

    //Select files
    return gulp.src(paths.configJS.src)
        .pipe(plumber())
        //Concatenate includes
        .pipe(include())
        //Transpile
        .pipe(babel({
            presets: [
                ['env', {
                    loose: true,
                    modules: false
                }]
            ] //'use-strict' deleted
        }))
        //Save unminified file
        .pipe(gulpif(!demo, gulp.dest(paths.configJS.dest)))
        //Optimize and minify

        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        //Save minified file
        .pipe(gulp.dest(paths.configJS.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())
});


/**
 * Build scripts with ES6/Babel Bootstrap JS
 * -----------------------------------------------------------------------------
 */
gulp.task('bootstrapJS', () => {

    //Select files
    return gulp.src(paths.bootstrapJS.src)
        .pipe(plumber())
        //Concatenate includes
        .pipe(include())
        //Transpile
        .pipe(babel({
            presets: [
                ['env', {
                    loose: true,
                    modules: false
                }]
            ] //'use-strict' deleted
        }))
        //Save unminified file
        .pipe(gulpif(!demo, gulp.dest(paths.bootstrapJS.dest)))
        //Optimize and minify

        //Append suffix
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        //Save minified file
        .pipe(gulp.dest(paths.bootstrapJS.destMin))

        .pipe(browserSync.reload({
            stream: true
        }))
        .pipe(plumber.stop())
});

/**
 * Delete Production files
 * -----------------------------------------------------------------------------
 */



/**
 * Copy image files
 * -----------------------------------------------------------------------------
 */
gulp.task('images', () => {

    return gulp.src(paths.images.src)
        //ImageMin
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [{
                removeViewBox: true
            }]
        }))
        //Save files
        .pipe(gulp.dest(paths.images.dest))
        .pipe(gulp.dest(paths.images.destMin))
        .pipe(browserSync.reload({
            stream: true
        }))
});


/**
 * Copy vendors files
 * -----------------------------------------------------------------------------
 */


gulp.task('clean', () => {

    del([

        path.productionDir + '/lib*',
        path.productionDir + '/assets/css/colors.css',
        path.productionDir + '/assets/css/colors.min.css',
        path.productionDir + '/assets/css/variables.css',
        path.productionDir + '/assets/css/variables.min.css',
        //min deleted files
        path.productionDir + 'theme.min/lib*',
        path.productionDir + 'theme.min/assets/css/colors.css',
        path.productionDir + 'theme.min/assets/css/colors.min.css',
        path.productionDir + 'theme.min/assets/css/variables.css',
        path.productionDir + 'theme.min/assets/css/variables.min.css'


    ], {

    });
});

gulp.task('deploy', function () {

    var conn = ftp.create({
        host: '***',
        user: '***',
        password: '***',
        port: 21,
        log: gutil.log

    });


    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src('./dist/theme.min/**', {
            base: '',
            buffer: true
        })
        // .pipe( conn.newer( '/public_html' ) ) // only upload newer files
        .pipe(conn.dest('/public_html'));


});

/**
 * Default Task
 * -----------------------------------------------------------------------------
 */

gulp.task('browser-sync', function () {
    browserSync.init({
        watch: true,
        server: {
            host: "192.168.1.4",
            baseDir: [path.productionDir + '/'],
            index: "/theme/index.html",
            directory: false,
            https: true,
        },
        port: 8080
    });
    gulp.watch(path.developmentDir + '/scss/*.scss', gulp.series('styleWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/scss/plugins/bootstrap/*.scss', gulp.series('bootstrapScssWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/scss/plugins/fancybox/*.scss', gulp.series('fancyboxWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/scss/plugins/icofont/*.scss', gulp.series('icofontWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/pug/**/*.pug', gulp.series('pugWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/js/bootstrap.js', gulp.series('bootstrapJs')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/js/plugins.js', gulp.series('pluginsjS')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/js/config.js', gulp.series('configJsWatch')).on('change', browserSync.stream);
    gulp.watch(path.developmentDir + '/images/**/*', gulp.series('imageWatch')).on('change', browserSync.stream);

});

gulp.task('default',
    gulp.series(
        'delete-dist',
        'includes',
        'fancybox',
        'styles',
        'bootstrap',
        'copy',
        'gulpPug',
        'icofont',
        'bootstrapJS',
        'pluginsJS',
        'configJS',
        'images',
        'browser-sync'
    ));

gulp.task('imageWatch', gulp.series('images'));
gulp.task('styleWatch', gulp.series('styles'));
gulp.task('bootstrapScssWatch', gulp.series('bootstrap'));
gulp.task('fancyboxWatch', gulp.series('fancybox'));
gulp.task('icofontWatch', gulp.series('icofont'));
gulp.task('pugWatch', gulp.series('gulpPug'));
gulp.task('bootstrapJs', gulp.series('bootstrapJS'));
gulp.task('pluginsjS', gulp.series('pluginsJS'));
gulp.task('configJsWatch', gulp.series('configJS'));