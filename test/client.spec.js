'use strict';
// karma-webpack cannot require io from window...
define('socket.io-client', [], function () {
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

var DIFFERENT_CLIENT_ID_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzY29wZSI6ImJhciIsInVzZXJVVUlEIjoic29tZS11c2VyLXN0cmFuZ2UtdXVpZCIsImNsaWVudElkIjoiY29tLmFub3RoZXIudGVzdC5hcHAuaWQiLCJpYXQiOjE0MjMyMzkyNDEsImV4cCI6MTczNDI3OTI0MSwiYXVkIjoidGVzdCIsImlzcyI6Imh0dHBzOi8vYXV0aC55ZXR1ZGV2LmNvbSIsInN1YiI6InN1YmplY3Qud2l0aC5kb3RzIn0.Sr8xsBxtGKF-UbO4E51JSYrGYAhcTRcO3lTTig_TPyEVaNJno6U4h2_9A74cyEon7me3ry2OFNIgGg6m61E1yuE9PhKOs-NyGzx42EkQZ1Hn_QOmY6xB_WNhb0AbtzmVF6xjR6nSuDTE7nDmHSeubL8SWZMXP9vQE3nUc6R1bfku_XA_BI_yvf0wJQosvltEyrpFl9cP-61DjhmS7q2ZzN618KXICCsFRu_5XlB1QWR-74YHW71GeBzO_1SWj5OKJWk1zMQ5pAZsaSuqCGt94hIrFu1DS-hgVX-bxZiiSqqOsyk4apc5TVaL4lUHLTHL2IFfoLwyPht1DZtAZemVIHoilMBPO3fY3fCtrOUj8AtInNUm6Q7M1IPypoZFVt0P7X9_dRSNFeUptIf_UPrY9eG7OHEtZdczj2X6vItDcbjfi99CdW6vnOgknPC6keeITCZwMMlLbd_4alKlgsu2DFab0_W70HilAZzOqwHul0zyHEB3Xc-ioGmb4R2nFDgvxmjYEXbcB3X_J4MTShCpBy0ZuqQG8BgWJ-yY75hdJOb7WYnsbw4ueta_iAksHhdSPkmNUBfOkmkyBxtgtUmvnGWjY19lCj6uZ5X3p_iofiXuARfaFr-lEhZJh4mK1km7Mtgu-SuMWIK9D5EK66eXgu2OCsXlab5nZUPscjHGF04';

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
			}, function (ajaxResponse) {
				done();
			});

	});


	it('should call success handler when valid payload is provided',
		function (done) {
			client.init(TOKEN).send(testPayload)
				.then(function () {
					done();
				}, function(e){
					console.log(e);
				});
		});

	it('should subscribe to given event and receive a message', function (done) {
		var ci = client.init(TOKEN);
		ci.subscribe(
			{event: 'youtube_event'},
			function (data) {
				console.log(data);
				done();
			}).then(function(data){
			console.log("some message: ",data);
				ci.send({
					event: 'youtube_event',
					data: {
						a: 1
					}
				});
			});

	});

	it('should subscribe to given event and receive a message with clientId as a parameter', function (done) {
		var ci = client.init(TOKEN);
		ci.subscribe(
			{event: 'some_event', clientId: newClientId},
			function (data) {
				console.log(data);
				done();
			},
			function(p){
				console.log("error: ", p);
			}).then(function(data){
			console.log(data);


				client.init(DIFFERENT_CLIENT_ID_TOKEN).send({
					event: 'some_event',
					data: {
						a: 1
					}
				});
			}).catch(function(e){console.log(e);});

	});


});
