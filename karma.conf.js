'use strict';

var webpackConfig = require('./webpack.config');
webpackConfig.cache = true;

// workaround for externals socketio setup
webpackConfig.resolve.alias['socket.io-client'] = __dirname + '/test/socket-io-shim.js';

webpackConfig.module.postLoaders = [{
	test: /\.js$/,
	exclude: /(_spec|vendor|node_modules)/,
	loader: 'istanbul-instrumenter'
}];


module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine'],
		files: [
			'bower_components/socket.io-client/socket.io.js',
			'test/**/*.spec.js'
		],
		webpack: {
			resolve: webpackConfig.resolve,
			module: webpackConfig.module
		},
		preprocessors: {
			'test/**/*.spec.js': ['webpack']
		},
		reporters: ['progress', 'coverage'],
		coverageReporter: {
			dir: 'coverage/',
			subdir: function (browser) {
				return browser.toLowerCase().split(/[ /-]/)[0];
			},
			reporters: [
				{type: 'cobertura', file: 'cobertura.xml'},
				{type: 'text', file: 'text.txt'},
				{type: 'text-summary', file: 'text-summary.txt'},
				{type: 'html'}
			]
		},
		port: 9876,
		colors: true,
		autoWatch: true,
		browsers: ['PhantomJS']
	});
};
