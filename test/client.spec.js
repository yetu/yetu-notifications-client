'use strict';
// karma-webpack cannot require io from window...
define('socket-io', [], function () {
	return global.io;
});

var client = require('../index');

var TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzUxMiJ9.eyJzY29wZSI6ImJhciIsImlhdC' +
	'I6MTQyMjQ2MDAyMCwiZXhwIjoxNzMzNTAwMDIwLCJhdWQiOiJ0ZXN0IiwiaXNzIjoiaHR0cHM6' +
	'Ly9hdXRoLnlldHVkZXYuY29tIiwic3ViIjoic3ViamVjdC53aXRoLmRvdHMifQ.NNMlDrVNV3i' +
	'LJCzuIA9dJcArZE69evas-z1H5mgwHGhOCoZmItXkzrZm_VbCY6EqaMYseAyF6agQddYNvaUZE' +
	'Ec1rq9vgN3XpeCiT6oVktjY6D-yu70SfeG1VSTpicyQX-VmzKKxj2Qn2DHJ_qF-Ck7mCY5Ki_q' +
	'ngMWYkxiV2Hq3Mfycz9zbBOWhg-aGPhn129cNAX_J0sswG2BGriLbxfnrvQ6PBMvlfTsXrqeLQ' +
	'P2dIaw0vXciK1lx8JvCkHQGurCV719PXDD1CatdFdBMlaVN7o-qUjkpRI0RHwAv0ppQOlO14et' +
	'75DvyDwbMEEVvZvno0UnqNAb1uEQbhlqnQgny3jin8i3q--CQeiQXQEtLa2lIlvQYYSQVNOGdd' +
	'Ri5KRMMLD9_DkFacQw-yV3srnSfHZGC_hjKtcT5taDP-BBlQcQWVdetoQOYwYWJTLgOZDfNBZj' +
	'eTKcwiMWSqJSTMFhMrt9E9V4uWTRhg1sMtGqS-ZqLqmfPE3xLujbpSRAD-4Q3NKOcLAkloitps' +
	'mwD1bzfic1AVGfDR6Pl01Hya2Pq2tIquo-Jp98vBURIEVMPAubIvWWhlfNiTK04FhMMEETAKrC' +
	'6btVValmIWOfS16IdUD1_QUE12tGt2Nw6PCdJp2gwwvfyYbOVfNcwnpUGbrGhZLETc37Lcl8wGIxiORw';

var testPayload = {event: 'dummyData', data: {a: 5}};

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

		var ci = client.init(TOKEN);

		ci.subscribe(
			{event: 'subject.with.dots.yetu_notifications_client_v1'},
			function () {
				done();
			})
			.then(function () {
				ci.send(testPayload);
			});

	});
});
