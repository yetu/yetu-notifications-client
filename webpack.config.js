module.exports = {
	entry: './index.js',
	resolve : {
		modulesDirectories : ['node_modules','bower_components'],
		alias: {
			'es6-promise' : 'es6-promise/promise.js'
		}
	},
	output: {
		path: __dirname+'/dist',
		filename: 'standalone.js',
		// export itself to a global var
		libraryTarget: 'umd',
		// name of the global var: 'Foo'
		library: '_yetu_notifications_client'
	},
	externals: {
		// require('jquery') is external and available
		//  on the global var jQuery
		'socket.io-client': {
			root: 'io',
			commonjs: 'socket.io-client',
			commonjs2: 'socket.io-client',
			amd : 'socket.io-client'
		}
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' },
			{ test: /\.json$/, loader: 'json'}
		]
	}
};
