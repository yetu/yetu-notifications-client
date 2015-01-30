'use strict';
// karma-webpack cannot require io from window...
define('socket-io', [], function () {
	return global.io;
});

var client = require('../index');

var TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzY29wZSI6ImJhci' +
	'IsInVzZXJVVUlEIjoic29tZS11c2VyLXN0cmFuZ2UtdXVpZCIsImNsaWVudElkIjo' +
	'iY29tLnlldHUudGVzdC5hcHAuaWQiLCJpYXQiOjE0MjI2MzU5MTIsImV4cCI6MTcz' +
	'MzY3NTkxMiwiYXVkIjoidGVzdCIsImlzcyI6Imh0dHBzOi8vYXV0aC55ZXR1ZGV2L' +
	'mNvbSIsInN1YiI6InN1YmplY3Qud2l0aC5kb3RzIn0.kmjhtTnOyYiFu5cMYJ-G1k' +
	'aPyAspi0z68s1tmS-2q8RU3AXjbpSDlAdVyjJohHnVMX08oS15Rg3mZQTk_tSNft4' +
	'AnDKbpLw7x2_HXZmHofbi-9wXhiQjUp8dCdlugUOc6H04t_bOE0Pj8kE3Wg5Z2TGr' +
	'bNoW6jpl_fBloP-ZfxJuppIhLuRyxE6jVOc57x8LOGhNtaWaQmvvK8GnHZa1aIOKt' +
	'yHt1Qm263ZbNRgDKOCPfZOIvrNU_g7-aCYQik8oaFCiD2aTA7qK-VXvmYchY9tgAq' +
	'2wGZ2qjmIdYczbuzDdCH-1lrYW9JGeCKA_gJnMrWQRbMrlHZLj0obl0GyHO30M55A' +
	'4CGLo1VTd-NG2YbxhnEoO8LEOw4XvzSn5ISBY1ht5A7mGAx8mdh79Wz1W0WY7N-ZH' +
	'RsX5G9uowR1GVaBtxpiykwE5yDHjmF3FzlJZB3WHjBKHi0I6Vqzl_Wt2EAK72gnlw' +
	'PPag9eUgyub0Jn96z7_i2H7doGSNzMZp8sg-1UQeqeexk55lbk8HocZ-vwonbPtRF' +
	'w8-Yr34RduS_oLJzthOjijjfboGVgMGEiZe8Lij9sGt8OkS690yehokto_U4Gn6My' +
	'Q_aSLsqXj7NPMDdAv_7VX_HKsuTJEd7_pcT1sNTqtGxwCLsRIYTeLsyepd2yeWxmhhQrLKz3_cm4';

var testPayload = {event: 'dummy_event', data: {a: 5}};

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
			}, function (ajaxResponse) {
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

		var ci = client.init(TOKEN, {inboxUrl: 'http://localhost:9000/publish', outboxUrl: 'http://localhost:8082'});


		ci.subscribe(
			{event: 'dummy_event'},
			function () {
				done();
			})
			.then(function () {
				ci.send(testPayload);
			});

	});
});
