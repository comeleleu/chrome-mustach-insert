import browserSync from 'browser-sync';

const server = browserSync.create('Sagrada');

import config from '../config/config.js';

/* Tâche de démarrage
    - Démarre un serveur BrowserSync
    - Détecte les modifications dans le dossier build pour recharger la page
*/
let start = function () {
    let browsersyncConfig = {
        open: config.openBrowser,
        server: config.build,
        notify: false,
    };

    server.init(browsersyncConfig);
};
start.displayName = 'start:server';
start.description = 'Starting local webserver';

let reload = function (done) {
    server.reload();
    done();
};
reload.displayName = 'reload:server';
reload.displayName = 'Reloading';

export { server, start, reload };
export default {
    server,
    start,
    reload,
};
