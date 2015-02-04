'use strict';
define(function(require, module, exports){
	require('es6-promise').polyfill();

	var inbox = require('./js/client');
	return inbox;
});

