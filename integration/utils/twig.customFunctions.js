import glob from 'glob';
import config from '../config/config.js';
import lorem from 'lorem-ipsum';

var customFunctions = [];

customFunctions.push({
    name: 'ceil',
    func: function (args) {
        return Math.ceil(args);
    },
});

customFunctions.push({
    name: 'floor',
    func: function (args) {
        return Math.floor(args);
    },
});

/**
 * SVG
 * Usage:
 * {{ svg('libeo-logo', '600', '120', 'Alt-text') }}
 */
customFunctions.push({
    name: 'svg',
    func: function (icon, width, height = width, alt = null) {
        return `<svg class="icon-${icon}" width="${width}" height="${height}">
                ${alt ? `<title>${alt}</title>` : ''}
                <use xlink:href="${'/svg/' + config.defaults.svgSprite.build + '#' + icon}" />
            </svg>`;
    },
});

customFunctions.push({
    name: 'placeholder',
    func: function (size, text) {
        return `<img src="http://placehold.it/${size}&text=${text}" alt="${text}" />`;
    },
});

customFunctions.push({
    name: 'lorem',
    func: function (length) {
        var min = length * 0.75,
            max = length * 1.25,
            output = lorem({
                count: Math.random() * (max - min) + min,
                units: 'words',
            });
        return output.charAt(0).toUpperCase() + output.slice(1) + '.';
    },
});

customFunctions.push({
    name: 'get_static_pages',
    func: function () {
        var baseDirectory = config.src + 'templates/views/';
        var filesPath = baseDirectory + '**/*.twig';
        var files = glob.sync(filesPath)
            .map((file) => {
                const path = file.replace(baseDirectory, '').replace('.twig', '.html');
                const {index, fileName} = path.match(/^(?<index>[0-9]+).?(?<fileName>.+)/)?.groups || {};
                return {
                    index,
                    fileName: fileName || path,
                }
            })
            .sort((a, b)=> a.index - b.index)
            .map(file => file.fileName);
        return files;
    },
});

export default customFunctions;
