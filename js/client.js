'use strict';
/* global Promise */
define([
	'socket.io-client',
	'reqwest'
], function (io, reqwest) {

	var INBOX = 'http://inbox.yetudev.com/publish';
	var OUTBOX = 'http://outbox.yetudev.com';
	//var INBOX = 'http://localhost:9000/publish';
	//var OUTBOX = 'http://localhost:8082';
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
		return function(payload){
			payload.timeToLive = payload.timeToLive || 10000;

			var dataTosend = {
				token: token,
				payload: payload
			};

			return new Promise(function(resolve, reject){
				reqwest({
					url: connectionParams.inboxUrl,
					contentType: 'application/json',
					method: 'POST',
					success : resolve,
					error: reject,
					data: JSON.stringify(dataTosend)
				});
			});
		};
	}

	function subscribe(token){
		return function (payload, onData, onError) {
			var socket = io.connect(connectionParams.outboxUrl + '/?token=' + token, {forceNew: true});
			return new Promise(function(resolve, reject){
				socket.on('connect', function () {
					socket.emit('join', payload);
					socket.on('joined', function(event){
						resolve(function onDataPutter(handler){
							socket.on('data', handler);
						});
					});

					if (onData){
						socket.on('data', onData);
					}

					if (onError){
						socket.on('error', onError);
					}
				});
				// potentially a buggy place
				// need to check the socket-io behavior
				socket.on('disconnect', reject);

				socket.on('error', reject);
			});


		};
	}

	return {
		init: init
	};
});
