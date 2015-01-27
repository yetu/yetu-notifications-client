// karma-webpack cannot require io from window...
define('socket-io', [], function(){
	return global.io;
});

var	client = require('../js/client');

describe('Notification client', function () {

	it('should have connect method', function () {
		expect(client.connect).toBeDefined();
		expect(typeof client.connect).toBe("function");
	});

	it('connect method should return object', function () {
		expect(typeof client.connect('someToken')).toBe("object")
	});








});
