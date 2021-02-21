import path from 'path';
import webpack from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import ForksTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';
// the following plugin clears out the build folder at the start of bundling.
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const config: webpack.Configuration = {
    mode: 'production',
    entry: './src/app.tsx',
    output: {
        path: path.resolve(__dirname, 'build'),
        // the [name] token allows Webpack to name the files if our
        // code is split.  The [contenthash] token is updated whenever our
        // code changes, so it will bust the browser cache. 
        filename: '[name].[contenthash].js',
        publicPath: ''
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)x?$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript'
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            }
        ]
    },
    resolve: {
        // tells webpack which file types to look for in which order in module
        // resolution.
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: 'src/index.html',
            favicon: "./src/assets/BallLogoHD.png"
        }),
        // enables webpack to typecheck the code
        new ForksTsCheckerWebpackPlugin({
            // don't emit any code until type-checking is finished
            async: false
        }),
        new ESLintPlugin({
            extensions: ["js", "jsx", "ts", "tsx"]
        }),
        new CleanWebpackPlugin(),
    ],
};

export default config;