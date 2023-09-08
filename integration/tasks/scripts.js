import gulp from 'gulp';
import webpack from 'webpack';
import eslint from 'gulp-eslint-new';
import _ from 'lodash';
import del from 'del';
import { reload } from './server.js';

import config from '../config/config.js';
import webpackConfig from '../config/webpack.config.js';

const isProduction = process.env.NODE_ENV === 'production';

/* Tâche de build
    - Roule le webpack
*/
let build = function () {
    return new Promise((resolve) =>
        webpack(webpackConfig, (err, stats) => {
            if (err) console.log('Webpack', err);

            console.log(stats.toString({ colors: true }));
            resolve();
        }),
    );
};
build.displayName = 'build:scripts';
build.description = 'Building JS with Webpack';

/* Tâche de check / vérifications
    - Vérifie que les scripts sont valides avec eslint
*/
let check = function () {
    return gulp
        .src([config.src + 'js/**/*.js', '!' + config.src + 'js/vendor/**/*'])
        .pipe(eslint())
        .pipe(eslint.format());
};
check.displayName = 'check:scripts';
check.description = 'Validating JS';

/* Tâche de clean / nettoyage
    - Supprime le dossier js dans build
*/
let clean = function () {
    return del(config.build + 'js', { force: config.forceDelete });
};
clean.displayName = 'clean:scripts';
clean.description = 'Cleaning js';

/* Tâche de watch
    - Détecte les modifications dans le dossier src et roule les tâche clean, check et build
*/
let watch = function () {
    return gulp.watch(config.src + 'js/**/*', gulp.series(clean, check, build, reload));
};
watch.displayName = 'watch:scripts';
watch.description = 'Watching js';

export default {
    build,
    check,
    watch,
};
