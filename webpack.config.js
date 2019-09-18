const packageJson = require('./package.json');
const version = packageJson.version;
const path = require("path");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {

    const conf = {
        mode: 'development',//production,development
        devServer: {
            open: true,
            openPage: "index.html",
            contentBase: path.join(__dirname, '/public'),
            watchContentBase: true,
            disableHostCheck: true,
            port: 8080,
        },
        entry: {
            jsframe: './src/index.js',
        },
        resolve: {
            extensions: [ '.tsx', '.ts', '.js' ]
        },
        output: {
            path: path.join(__dirname, "dist"),
            filename: argv.mode === 'production' ? `[name].min.js` : `[name].js`,
            libraryTarget: 'umd'
        },
        optimization: {
            minimizer: [
                new UglifyJSPlugin({
                    uglifyOptions: {compress: {drop_console: true}},
                }),
            ],
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        { loader: "style-loader" },
                        { loader: "css-loader" }
                    ]
                },
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.js?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                }
            ],
        },
        plugins: [
            new webpack.BannerPlugin(`[name] v${version} Copyright (c) 2019 Tom Misawa`)
        ]
    };

    if (argv.mode !== 'production') {
        conf.devtool = 'inline-source-map';
    }

    return conf;
};

