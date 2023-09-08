export default {
    plugins: [
        { prefixIds: true },
        { removeTitle: true },
        { removeDesc: true },
        { removeViewBox: false },
        { removeDimensions: true },
        {
            removeAttrs: {
                attrs: ['fill', 'opacity'],
            },
        },
    ],
};
