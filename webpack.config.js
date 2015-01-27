module.exports = {
	entry: './index.js',
	resolve : {
		modulesDirectories : ['bower_components']
	},
	output: {
		path: __dirname+'/dist',
		filename: 'bundle.js',
		// export itself to a global var
		libraryTarget: 'umd',
		// name of the global var: 'Foo'
		library: '_yetu_notifications_client'
	},
	externals: {
		// require('jquery') is external and available
		//  on the global var jQuery
		'socket-io': 'io'
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' }
		]
	}
};