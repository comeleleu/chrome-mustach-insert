import del from 'del';

import config from '../config/config.js';

/* Tâche de clean / nettoyage
    - Supprime le dossier build au complet
*/
let clean = function () {
    return del(config.build, { force: config.forceDelete });
};
clean.displayName = 'clean:utils';
clean.description = 'Deleting old build folder';

export default {
    clean,
};
