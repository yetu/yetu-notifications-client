// karma-webpack cannot require io from window...
define('socket-io', [], function(){
	return global.io;
});

var	client = require('../js/client');

describe('Client', function () {
	it('should return some object', function () {
		expect(client.connect).toBeDefined();
	});



});
