export default {
    build: './build/',
    src: './src/',
    openBrowser: true, // Ouvre le browser lorsqu'on fait "yarn run dev"
    showDebugStaticNav: true, // Affiche la liste des templates dans le bas de l'écran
    forceDelete: false, // Mettre à true si build est en dehors de sagrada
    defaults: {
        svgSprite: {
            build: 'symbols.svg',
        },
    },
};
