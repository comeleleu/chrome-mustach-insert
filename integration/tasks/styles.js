import gulp from 'gulp';
import gulpif from 'gulp-if';
import dartSass from 'sass';
import gulpSass from 'gulp-sass';
import log from 'fancy-log';
import postcss from 'gulp-postcss';
import plumber from 'gulp-plumber';
import autoprefixer from 'autoprefixer';
import sourceMaps from 'gulp-sourcemaps';
import cssGlobbing from 'gulp-css-globbing';
import sassLint from 'gulp-sass-lint';
import del from 'del';
import { server } from './server.js';

import config from '../config/config.js';

const sass = gulpSass(dartSass);

const isProduction = process.env.NODE_ENV === 'production' ? true : false;

/* Tâche de build
    - Construit le scss avec la base de Zurb Foundation
*/
let build = function () {
    var sassConfig = {
        indentWidth: 4,
        outputStyle: isProduction ? 'compressed' : 'expanded',
        includePaths: [
            'node_modules',
            'bower_components',
            'node_modules/foundation-sites/scss',
            'node_modules/motion-ui/src',
        ],
    };

    return gulp
        .src(config.src + 'scss/**/*.scss')
        .pipe(
            plumber(
                isProduction
                    ? false
                    : {
                          errorHandler: function (error) {
                              log.error('Error: ' + error.message.replace('\n', ''));
                          },
                      },
            ),
        )
        .pipe(
            cssGlobbing({
                extensions: ['.css', '.scss', '.sass'],
                scssImportPath: {
                    leading_underscore: false,
                    filename_extension: false,
                },
            }),
        )
        .pipe(gulpif(!isProduction, sourceMaps.init({ loadMaps: true })))
        .pipe(
            sass(sassConfig).on('error', function () {
                this.emit('end');
            }),
        )
        .pipe(postcss([autoprefixer()]))
        .pipe(gulpif(!isProduction, sourceMaps.write('.')))
        .pipe(gulp.dest(config.build + 'css'))
        .pipe(server.stream({ match: '**/*.css' }));
};
build.displayName = 'build:styles';
build.description = 'Building SCSS files';

/* Tâche de check / vérifications
    - Vérifie que les styles sont valides avec sassLint
*/
let check = function () {
    return gulp
        .src(config.src + 'scss/**/*')
        .pipe(sassLint())
        .pipe(sassLint.format());
};
check.displayName = 'check:styles';
check.description = 'Validating SCSS';

/* Tâche de clean / nettoyage
    - Supprime le dossier css dans build
*/
let clean = function () {
    return del(config.build + 'css', { force: config.forceDelete });
};
clean.displayName = 'clean:styles';
clean.description = 'Cleaning css';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean, check et build
*/
let watch = function () {
    return gulp.watch(config.src + 'scss/**/*', gulp.series(clean, check, build));
};
watch.displayName = 'watch:styles';
watch.description = 'Watching css';

export default {
    build,
    check,
    clean,
    watch,
};
