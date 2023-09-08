import gulp from 'gulp';
import twig from 'gulp-twig';
import merge from 'gulp-merge-json';
import _ from 'lodash';
import rename from 'gulp-rename';
import del from 'del';
import { server } from './server.js';

import customFunctions from '../utils/twig.customFunctions.js';

import config from '../config/config.js';

let templateData = {};

/* Tâche de json
    - On va chercher les données dans data pour les inclure dans le contexte twig
*/
const json = function () {
    return gulp
        .src(config.src + 'data/**/*.json')
        .pipe(merge())
        .on('data', function (file) {
            templateData = JSON.parse(file.contents.toString());
            _.extend(templateData, {
                config: config,
            });
        });
};
json.displayName = 'json:svgs';
json.description = 'Building json data';

/* Tâche de build
    - Construit le html à partir des vues dans templates
    - Chaque vue a son html construit dans build
*/
let build = function () {
    return gulp
        .src([config.src + 'templates/views/**/*.twig'], {
            base: config.src + 'templates/views',
        })
        .pipe(
            twig({
                base: config.src + 'templates/',
                data: templateData,
                functions: customFunctions,
                onError: function (event) {},
            }),
        )
        .pipe(rename(function(path) {
            path.basename = path.basename.replace(/^[0-9]+\./, '');
            return path;
        }))
        .pipe(gulp.dest(config.build))
        .pipe(server.stream({ once: true }));
};
build.displayName = 'build:svgs';
build.description = 'Building templates';

/* Tâche de clean / nettoyage
    - Supprime le dossier templates dans build
*/
let clean = function () {
    return del([config.build + '*.html'], { force: config.forceDelete });
};
clean.displayName = 'clean:svgs';
clean.description = 'Cleaning templates';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean, json et build
*/
let watch = function () {
    return gulp.watch([config.src + 'templates/**/*', config.src + 'data/**/*'], gulp.series(clean, json, build));
};
watch.displayName = 'watch:svgs';
watch.description = 'Watching HTML';

export default {
    json,
    build,
    watch,
    clean,
};
