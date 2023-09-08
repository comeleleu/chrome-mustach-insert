import gulp from 'gulp';

import utils from './tasks/utils.js';
import scripts from './tasks/scripts.js';
import styles from './tasks/styles.js';
import images from './tasks/images.js';
import svgs from './tasks/svgs.js';
import fonts from './tasks/fonts.js';
import assets from './tasks/assets.js';
import templates from './tasks/templates.js';
import server from './tasks/server.js';

import config from './config/config.js';

/* Tâche de build sans watch
    - Clean le dossier build (supprime tout)
    - En parallèle, ↴
        - Roule les checks des styles (sass-lint) et build les styles (styles.js)
        - Roules les checks des scripts (eslint), build les scripts (scripts.js)
        - Roule les checks des images (grosseurs max) et fait la copie vers build (images.js)
        - Copie les svgs dans build (originals) et construit les sprites pour les svgs (symbols) (svg.js)
        - Construit les données json pour twig et fait le build des templates (templates.js)
        - Copie les fonts dans le build
        - Copie les assets dans le build
*/
let build = gulp.series(
    utils.clean,
    gulp.parallel(
        gulp.series(styles.check, styles.build),
        gulp.series(scripts.check, scripts.build),
        gulp.series(images.check, images.copy),
        gulp.series(svgs.copy, svgs.sprite),
        gulp.series(templates.json, templates.build),
        fonts.copy,
        assets.copy,
    ),
);
build.description = 'Building assets';

/* Tâche de watch des assets
    - Roule les tâche de watch en paralèle pour chaque segment
*/
let watch = gulp.parallel(
    templates.watch,
    styles.watch,
    scripts.watch,
    images.watch,
    svgs.watch,
    fonts.watch,
    assets.watch,
);
watch.description = 'Watching assets';

/* Tâche de dev
    - Build le projet (selon la tâche build)
    - En paralèle, ↴
        - Démarre le serveur web
        - Roule la tâche watch
*/
let dev = gulp.series(build, gulp.parallel(server.start, watch));
dev.description = 'Starting local webserver';

/* Tâche de démarrage de serveur
    - Build le projet (selon la tâche build)
    - Démarre le serveur web
*/
let start = gulp.series(build, server.start);
start.description = 'Starting local webserver';

/* Tâche d'optimization
    - Optimize les images dans le dossier source
    - Optimize les svgs dans le dossier source
*/
let optimize = gulp.parallel(images.optimize, svgs.optimize);
optimize.description = 'Optimizing assets';

/* Tâche par défaut est dev */
export default dev;
export { dev, start, build, optimize };
