'use strict';
define([
	'socket-io',
	'reqwest'
], function (io, reqwest) {

	var INBOX = 'http://inbox.yetu.me';
	var OUTBOX = 'http://outbox.yetu.me';

	var connnect = function (token, params) {
		params = params || {};
		params.inboxUrl = params.inboxUrl || INBOX;
		params.outboxUrl = params.outboxUrl || OUTBOX;

		return {
			subscribe: subscribeToOutbox(token, params.outboxUrl),
			send: sendToInbox(params.inboxUrl)
		};
	};

	var subscribeToOutbox = function (token, url)  {
		var socket = io(url + '/?token=' + token);

		var onDisconnect = function(handler){
			socket.on('disconnect', handler);
		};

		var onError = function (handler) {
			socket.on('error', handler);
		};

		return function (event, onData) {
			socket.emit('join', {topic: event});
			socket.on('joined', function () {
				socket.on('data', onData);
			});
			return {
				onDisconnect : onDisconnect,
				onError : onError
			};
		};
	};


	//var connect = nt.connect('1');
	//var handlers  =  connect.subscribe('video');
	//handlers.onError(function (e) {
	//
	//});
	//
	//handlers.onDisconnect(function(){
	//
	//});



	var sendToInbox = function (inboxUrl) {
		return function (token, feature, payload) {
			return reqwest({
				url: inboxUrl,
				type: 'post',
				data: {token: token, feature: feature, payload: payload}
			});
		};
	};

	return {
		connect: connnect
	};
});
