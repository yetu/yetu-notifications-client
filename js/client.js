'use strict';
/* global Promise */
define([
	'socket.io-client',
	'reqwest'
], function (io, reqwest) {

	/** -- Probably use this to run test against local env -- */
	var OUTBOX = 'http://localhost:8082';
	var INBOX = 'http://localhost:8080/publish';

	/** -- And this as the devlopment env --
	 var INBOX = 'https://inbox-dev.yetu.me/publish';
	 var OUTBOX = 'https://outbox-dev.yetu.me'; */

	var JOINED_DELAY = 100;
	var connectionParams = {};

	var init = function (token, params) {
		params = params || {};
		connectionParams.inboxUrl = params.inboxUrl || INBOX;
		connectionParams.outboxUrl = params.outboxUrl || OUTBOX;
		connectionParams.joinedDelay = params.joinedDelay || JOINED_DELAY;

		return {
			subscribe: subscribe(token),
			send: send(token)
		};
	};

	function send (token) {
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

	function compose (f1, f2) {
		return function () {
			return f1(f2.apply(this, [].splice.call(arguments, 0)));
		};
	}

	function string2Json (string) {
		return JSON.parse(string);
	}


	function processSubscription (socket, resolve, reject) {
		return function (payload, onData, onError) {
			socket.emit('join', payload);
			socket.on('joined', function (event) {
				// wait for really connecting to MQ, can be improved
				// by sending separate message from outbox to data
				setTimeout(function () {
					resolve(function onDataPutter (handler) {
						socket.on(payload.clientId + '.' + payload.event, handler);
					});
				}, connectionParams.joinedDelay);
			});

			if (onData) {
				socket.on(payload.clientId + '.' + payload.event, compose(onData, string2Json));
			}

			if (onError) {
				socket.on('error', onError);
			}
		};
	}

	function subscribe (token) {
		return function (payload, onData, onError) {
			var socket = io.connect(connectionParams.outboxUrl + '/?token=' +
			token, {secure: true});
			return new Promise(function (resolve, reject) {
				if (socket.connected) {
					processSubscription(socket, resolve, reject)(payload, onData, onError)
				}
				socket.on('connect',function(){
					processSubscription(socket, resolve, reject)(payload, onData, onError)
				});
			});
		};
	}

	return {
		init: init
	};
});
