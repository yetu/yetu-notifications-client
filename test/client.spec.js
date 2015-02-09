'use strict';
// karma-webpack cannot require io from window...
define('socket.io-client', [], function () {
	return global.io;
});

var client = require('../index');

var TOKEN = require('./tokens').client1;
var DIFFERENT_CLIENT_ID_TOKEN = require('./tokens').client2;

var testPayload = {event: 'dummy_event', data: {a: 5}};
var newClientId = 'com.another.test.app.id';

describe('Notification client', function () {

	it('should have init method', function () {
		expect(client.init).toBeDefined();
		expect(typeof client.init).toBe('function');
	});

	it('init method should return object', function () {
		expect(typeof client.init('someToken')).toBe('object');
	});

	it('should return promise on send method call', function (done) {
		client.init(TOKEN).send(testPayload)
			.then(function () {
				done();
			}, function () {
				done();
			});

	});


	it('should call success handler when valid payload is provided',
		function (done) {
			client.init(TOKEN).send(testPayload)
				.then(function () {
					done();
				});
		});

	it('should subscribe to given event and receive a message', function (done) {
		var ci = client.init(TOKEN);
		ci.subscribe(
			{event: 'youtube_event'},
			function () {
				done();
			}).then(function () {
				ci.send({
					event: 'youtube_event',
					data: {
						a: 1
					}
				});
			}).catch(function(e){
				console.error('error', e);
			});

	});

	it('should receive a message for different clientId', function (done) {
		var ci = client.init(TOKEN);
		ci.subscribe(
			{event: 'some_event', clientId: newClientId},
			function () {
				done();
			})
			.then(function () {

				client.init(DIFFERENT_CLIENT_ID_TOKEN).send({
					event: 'some_event',
					data: {
						a: 1
					}
				});
			});
	});

});
