'use strict';
define(function(require, module, exports){
	require('es6-promise/promise').polyfill();

	var inbox = require('./js/client');
	return inbox;
});

