import gulp from 'gulp';
import svgSymbols from 'gulp-svg-symbols';
import svgo from 'gulp-svgo';
import del from 'del';
import fs from 'fs';
import _ from 'lodash';
import rename from 'gulp-rename';
import { reload } from './server.js';

import svgoConfig from '../config/svgo.config.js';
import config from '../config/config.js';

/* Tâche de copie
    - Copie tous les svgs de src à build (svg/originals)
*/
let copy = function () {
    return gulp.src(config.src + 'svg/**/*').pipe(gulp.dest(config.build + 'svg/originals'));
};
copy.displayName = 'copy:svgs';
copy.description = 'Copying assets svgs';

function parseSvgs(baseDir, svgs) {
    var src = [];
    for (var i = 0, len = svgs.length; i < len; i++) {
        var script = svgs[i];
        if (typeof script === 'object') {
            var key = Object.keys(script)[0];
            src = src.concat(parseSvgs(baseDir + '/' + key, script[key]));
        } else {
            src.push(baseDir + '/' + script);
        }
    }
    return src;
}

/* Tâche de sprite
    - Compile les svgs dans les bundles indiqués dans svgs.json
*/
let sprite = function () {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(config.src + 'svg/svgs.json')) {
            var svgs = JSON.parse(fs.readFileSync(config.src + 'svg/svgs.json'));
            _.forEach(svgs, function (list, name) {
                var globSvgs = parseSvgs(config.src + 'svg', list);
                var destPath = 'svg/' + name + (name != 'symbols' ? '_symbols' : '') + '.svg';
                gulp.src(globSvgs)
                    .pipe(svgo(svgoConfig))
                    .pipe(svgSymbols({ templates: [`default-svg`] }))
                    .pipe(rename(destPath))
                    .pipe(gulp.dest(config.build));
            });
            resolve();
        } else {
            reject('svgs.json not found.');
        }
    });
};
sprite.displayName = 'sprite:svgs';
sprite.description = 'Making svg sprites';

/* Tâche d'optimization
    - Optimize toutes les images dans le dossier src avec svgmin
*/
let optimize = function () {
    return gulp
        .src(config.src + 'svg/**/*.svg')
        .pipe(svgo(svgoConfig))
        .pipe(gulp.dest(config.src + 'svg/'));
};
optimize.displayName = 'optimize:svgs';
optimize.description = 'Optimizing svgs';

/* Tâche de clean / nettoyage
    - Supprime le dossier svg dans build
*/
let clean = function () {
    return del(config.build + 'svg', { force: config.forceDelete });
};
clean.displayName = 'clean:svgs';
clean.description = 'Cleaning svgs';

/* Tâche de watch / surveillance
    - Détecte les modifications dans le dossier src et roule les tâche clean, sprite et copy
*/
let watch = function () {
    return gulp.watch(config.src + 'svg/**/*', gulp.series(clean, sprite, copy, reload));
};
watch.displayName = 'watch:svgs';
watch.description = 'Watching svgs';

export default {
    copy,
    sprite,
    optimize,
    clean,
    watch,
};
