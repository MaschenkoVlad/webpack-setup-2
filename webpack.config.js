const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const mode = process.env.NODE_ENV ?? 'development'

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const optimizer = () => {
    const config = {
        splitChunks: {
            chunks: 'all'  // если в двух файлах будут одинаковые импорты то объединить их в отдельный файл
        }
    }

    if (!isDev) {
        config.minimizer = [
            new OptimizeCssAssetsWebpackPlugin(), // оптимизация стилей
            new TerserWebpackPlugin()
        ]
    }

    return config
}

module.exports = {
    context: path.resolve(__dirname, 'src'), // где лежат все исходники приложения
    mode: mode,
    // entry: './src/index.js', // входной файл для приложения
    entry: {
        main: ['@babel/polyfill', './index.jsx'],
        analytics: './analytic.ts',
    },
    output: {
        // filename: '[name].bundle.js', // [name] позволяет динамически указывать имя
        filename: filename('js'), // [contenthash]название зависит от контента файла
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'assets/[hash][ext][query]', // Все ассеты будут складываться в dist/assets
        // __dirname - текущая директория
    },  // указывает куда вебпаку складывать результат
    resolve:{
        extensions: ['.js', '.json', '.png'], // какие расширения нужно понимать по умолчанию
        alias: {
            '@models': path.resolve(__dirname, 'src/models'), // src/models заменятся на @models в имортах
            '@':  path.resolve(__dirname, 'src'),
        }
    },
    optimization : optimizer(),
    devServer: {
        port: 4200,
        hot: isDev,
    },
    devtool: isDev ? 'source-map' : '', // благодаря этой настройке нумерация строк и названия функций и переменных в инструментах разработчика отображаются как в исходном коде.
    plugins: [
        new HTMLWebpackPlugin({
            // title: 'TalanT',
            template: './index.html',
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(), // чистит папку дист
        new CopyWebpackPlugin({ // копировать файлы
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/favicon.ico'),
                    to: path.resolve(__dirname, 'dist')
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ],
    module: { // добавлят возможность работы с другими типами файлов отличных от js
            // {
            //     test: /\.css$/, // если встречается файл с типом css то включить опреденный тип лоадеров
            //     use: ['style-loader', 'css-loader'] // вебпак идет справа на лево
            // },
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: isDev,
                            reloadAll: true,
                        },
                      },
                      'css-loader'
                ]
            },
            {
                test: /\.less$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: isDev,
                            reloadAll: true,
                        },
                      },
                      'css-loader',
                      'less-loader'
                ]
            },
            {
                test: /\.s[ac]ss$/,
                use:[
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: '',
                            hmr: isDev,
                            reloadAll: true,
                        },
                      },
                      'css-loader',
                      'sass-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/, // убрать из поиска папку нодмодулс
                use: {
                    loader: 'babel-loader', // дает возможность пользоваться самыми новыми фичами js
                    options: {
                        presets: ['@babel/preset-env'], 
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                  cache: true,
                },
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-typescript'], 
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env','@babel/preset-react'], 
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    }
}