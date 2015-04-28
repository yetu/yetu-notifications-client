'use strict';
/* global Promise */
define([
	'socket.io-client',
	'reqwest'
], function (io, reqwest) {

	var INBOX = 'https://inbox-dev.yetu.me/publish';
	//var OUTBOX = 'http://outbox.yetudev.com';
	//var INBOX = 'http://localhost:9000/publish';
	var OUTBOX = 'https://outbox-dev.yetu.me';
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
			var socket = io.connect(connectionParams.outboxUrl + '/?token=' +
			 token, {forceNew: true, secure: true});
			return new Promise(function(resolve, reject){
				socket.on('connect', function () {
					socket.emit('join', payload);
					socket.on('joined', function(event){
						// wait for really connecting to MQ, can be improved 
						// by sending separate message from outbox to data
						setTimeout(function(){
							resolve(function onDataPutter(handler){
								socket.on('data', handler);
							});
						}, connectionParams.joinedDelay);
					});

					if (onData) {
						socket.on('data', compose(onData, string2Json));
					}

					if (onError) {
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
