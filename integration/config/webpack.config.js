/* global __dirname */
import path from 'path';

const env = process.env.NODE_ENV === 'production' ? 'production' : 'development';

export default {
    mode: env,
    entry: {
        main: ['./js/app.js'],
    },
    devtool: 'source-map',
    output: {
        filename: './js/app.bundle.js',
        path: path.resolve(__dirname, '../build'),
        chunkFilename: './js/[name].chunk.js'
    },
    context: path.resolve(__dirname, '../src'),
    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                include: [path.resolve(__dirname, '../src/js')],
            },
        ],
    },
};
