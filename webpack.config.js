const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const NODE_ENV = process.env.NODE_ENV.trimEnd();

module.exports = {
	mode: NODE_ENV === 'production' ? 'production' : 'development',// 环境管理
	devtool: NODE_ENV == 'production' ? false : 'inline-source-map',
	entry: './src/index.ts',
	resolve: {
		extensions: ['.tsx', '.ts', '.js']
	},
	module: {
		rules: [
			{
				test: /\.ts?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: { // 用 babel-loader 需要把 es6 -> es5
						presets: [
							// '@babel/preset-env', // 这里面就是把es6 -> es5的模块
							// 按需加载es版本
							['@babel/env', {
								modules: false,
								useBuiltIns: false,
								targets: {
									browsers: [
										'Chrome >= 88'
									]
								}
							}]
						],
						plugins: [

							// [
							//     '@babel/plugin-proposal-decorators',
							//     {'legacy': true}
							// ],
							[   // 支持类(class)的写法
								'@babel/plugin-proposal-class-properties',
								{'loose': true} // 宽松模式
							]
							// '@babel/plugin-transform-runtime'，

						]
					}
				},
				include: [path.resolve(__dirname, '__tests__'), path.resolve(__dirname, 'src')],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			title: '测试fetch',
			template: './__test__/index.html'
		}),
	],
	experiments: {
		outputModule: true // 让模块可以使用import导入使用
	},
	output: {
		filename: 'index.js',
		libraryTarget: 'module', //module es6模式 umd模式
		path: path.resolve(__dirname, '__test__')
		// clean: true, // 清理冗余文件
	},
	target: 'web',
	devServer: {
		static: {
			directory: path.join(__dirname, '__test__'),
		},
		// contentBase: path.resolve(__dirname, 'dist'),
		// 压缩代码 先注释
		compress: NODE_ENV == 'production',
		// 端口
		port: 3004,
		// 打开浏览器
		open: true,
		proxy: {
			'/common': {
				secure: false,
				changeOrigin: true,
				target: 'https://api.apishop.net/'
			}
		}
	}
};
