import gulp from 'gulp';
import checkFilesize from 'gulp-check-filesize';
import imagemin from 'gulp-imagemin';
import del from 'del';

import config from '../config/config.js';

/* Tâche de copie
    - Copie toutes les images de src à build
*/
let copy = function () {
    return gulp.src(config.src + 'img/**/*').pipe(gulp.dest(config.build + 'img'));
};
copy.displayName = 'copy:images';
copy.description = 'Copying assets images';

/* Tâche de check / vérifications
    - Vérifie que toutes les images soit en dessous d'une certaine taille
*/
let check = function () {
    return gulp.src(config.src + 'img/**/*').pipe(checkFilesize({ fileSizeLimit: 300 * 1024 }));
};
check.displayName = 'check:images';
check.description = 'Checking images size';

/* Tâche d'optimization
    - Optimize toutes les images dans le dossier src avec imagemin
*/
let optimize = function () {
    return gulp
        .src(config.src + 'img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.src + 'img/'));
};
optimize.displayName = 'optimize:images';
optimize.description = 'Optimizing images';

/* Tâche de clean / nettoyage
    - Supprime le dossier img dans build
*/
let clean = function () {
    return del(config.build + 'img', { force: config.forceDelete });
};
clean.displayName = 'clean:images';
clean.description = 'Cleaning images';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean et copy
*/
let watch = function () {
    return gulp.watch(config.src + 'img/**/*', gulp.series(clean, copy));
};
watch.displayName = 'watch:images';
watch.description = 'Watching images';

export default {
    copy,
    check,
    optimize,
    clean,
    watch,
};
