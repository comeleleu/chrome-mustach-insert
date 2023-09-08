import gulp from 'gulp';
import del from 'del';

import config from '../config/config.js';

/* Tâche de copie
    - Copie toutes les fonts de src à build
*/
let copy = function () {
    return gulp.src(config.src + 'fonts/**/*').pipe(gulp.dest(config.build + 'fonts'));
};
copy.displayName = 'copy:fonts';
copy.description = 'Copying fonts';

/* Tâche de clean / nettoyage
    - Supprime le dossier fonts dans build
*/
let clean = function () {
    return del(config.build + 'fonts', { force: config.forceDelete });
};
clean.displayName = 'clean:fonts';
clean.description = 'Cleaning fonts';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean et copy
*/
let watch = function () {
    return gulp.watch(config.src + 'fonts/**/*', gulp.series(clean, copy));
};
watch.displayName = 'watch:fonts';
watch.description = 'Watching fonts';

export default {
    copy,
    clean,
    watch,
};
