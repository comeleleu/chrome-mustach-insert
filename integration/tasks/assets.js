import gulp from 'gulp';
import del from 'del';

import config from '../config/config.js';

/* Tâche de copie
    - Copie tous les assets de src à build
*/
let copy = function () {
    return gulp.src(config.src + 'assets/**/*').pipe(gulp.dest(config.build + 'assets'));
};
copy.displayName = 'copy:assets';
copy.description = 'Copying assets';

/* Tâche de clean / nettoyage
    - Supprime le dossier assets dans build
*/
let clean = function () {
    return del(config.build + 'assets', { force: config.forceDelete });
};
clean.displayName = 'clean:assets';
clean.description = 'Cleaning assets';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean et copy
*/
let watch = function () {
    return gulp.watch(config.src + 'assets/**/*', gulp.series(clean, copy));
};
watch.displayName = 'watch:assets';
watch.description = 'Watching assets';

export default {
    copy,
    clean,
    watch,
};
