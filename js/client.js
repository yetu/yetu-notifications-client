'use strict';
/* global Promise */
define([
	'socket.io-client',
	'reqwest'
], function (io, reqwest) {

	var INBOX = 'http://inbox.yetudev.com/publish';
	var OUTBOX = 'http://outbox.yetudev.com';
	var connectionParams = {};

	var init = function (token, params) {
		params = params || {};
		connectionParams.inboxUrl = params.inboxUrl || INBOX;
		connectionParams.outboxUrl = params.outboxUrl || OUTBOX;

		return {
			subscribe: subscribe(token),
			send: send(token)
		};
	};

	function send(token) {
		return function (payload) {
			payload.timeToLive = payload.timeToLive || 10000;

			var dataTosend = {
				token: token,
				payload: payload
			};

			return new Promise(function (resolve, reject) {
				reqwest({
					url: connectionParams.inboxUrl,
					contentType: 'application/json',
					method: 'POST',
					success: resolve,
					error: reject,
					data: JSON.stringify(dataTosend)
				});
			});
		};
	}

	function compose(f1, f2) {
		return function () {
			return f1(f2.apply(this, [].splice.call(arguments, 0)));
		};
	}

	function string2Json(string) {
		return JSON.parse(string);
	}

	function subscribe(token) {
		return function (payload, onData, onError) {
			var socket = io.connect(connectionParams.outboxUrl + '/?token=' + token);
			return new Promise(function (resolve, reject) {
				socket.on('connect', function () {

					socket.emit('join', {event: payload.event});

					socket.on('joined', function (event) {

						resolve(function onDataPutter(handler) {
							socket.on('data', compose(handler, string2Json));
						});
					});

					if (onData) {
						socket.on('data', compose(onData, string2Json));
					}

					if (onError) {
						socket.on('error', onError);
					}

					socket.on('error', reject);
				});

				// potentially a buggy place
				// need to check the socket-io behavior
				socket.on('disconnect', reject);
			});


		};
	}

	return {
		init: init
	};
});
