import path from 'path';
import webpack, { web } from 'webpack';
import HtmlWebPackPlugin from 'html-webpack-plugin';
import ForksTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const config: webpack.Configuration = {
    // whether this app is bundled for production or development
    // webpack will auto-set process.env.NODE_ENV to "development"
    mode: "development",
    output: {
        // needed so that deep linking in dev server will work properly
        publicPath: '/'
    },
    // where webpack starts looking for modules to bundle
    entry: "./src/app.tsx",
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
                test: /\.module\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                compileType: "module",
                                mode: "local",
                                auto: (path: string) => path.endsWith(".module.css"),
                                exportGlobals: true,
                                localIdentName: "[path][name]__[local]--[hash:base64:5]",
                                localIdentContext: path.resolve(__dirname, "src"),
                                localIdentHashPrefix: "psueQ-hash",
                                namedExport: false,
                                exportLocalsConvention: "camelCaseOnly",
                                exportOnlyLocals: false
                            }
                        }
                    }
                ]
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
        // allows modules to be updated while application is running, along with 
        // making devServer.hot be true
        new webpack.HotModuleReplacementPlugin(),
        // enables webpack to typecheck the code
        new ForksTsCheckerWebpackPlugin({
            // don't emit any code until type-checking is finished
            async: false
        }),
        new ESLintPlugin({
            extensions: ["js", "jsx", "ts", "tsx"]
        }),
    ],
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, "build"),
        // necessary for deep links to work in multi-page apps
        historyApiFallback: true,
        port: 4000,
        // webpack will auto open the browser when server starts.
        open: true,
        hot: true
    }
};

export default config;