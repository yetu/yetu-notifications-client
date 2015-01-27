define([
	'socket-io'
], function (io) {
	'use strict';

	var INBOX = 'http://inbox.yetu.me';
	var OUTBOX = 'http://outbox.yetu.me';

	var connnect = function (params) {
		params.inboxUrl = params.inboxUrl || INBOX;
		params.outboxUrl = params.outboxUrl || OUTBOX;
		return {};
	}

	return {
		connect : connnect
	};
});