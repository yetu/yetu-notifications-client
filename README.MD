# Notifications Client

This is a library to send and consume system-wide notifications from Javascript projects.

It is based on socket.io-client library.

## How to use it in your project

The library relies on ES6 promises (which should be available through the global object) and **external** `socket.io-client` library.

Both libraries are included in the bower dependencies, but it is **end user's responsibility** to include those libraries and polyfills in his project in the most appropriate way.

### Using as a standalone build (No AMD module loaders):

1. Install the library using `bower`
1. Include `socket.io-client` and `dist/standalone.js` in your page:

        
        <script src="bower_components/socket.io-client/socket.io.js"></script>
        <script src="bower_components/nofifications-client/dist/standalone.js"></script>
     

1. Use `_yetu_notifications_client` in your code like that:


        var TOKEN = // grab your access_token to use with notifications API
        var client = _yetu_notifications_client;

        client.init(TOKEN)
          .send({event: 'my-event', data: { field: 'value'}})
          .then(function () {
           // do smth when the message is sent
          }, function (ajaxResponse) {
           // do smth when there was an error when sending a message
          });


### Using AMD module loader

1. Install the library using `bower`

1. Include `socket.io-client`. You have two possibilities here:

    1. Shim `socket.io-client` so that it can be required using:

            // Inside CJS module
            var io = require('socket.io-client);

        or

            // Inside AMD module
            define([
              'socket.io-client'
            ], function(io){
            });
    

    2. Include library directly in your HTML page:

            <script src="bower_components/socket.io-client/socket.io.js"></script>

    
1. Include `es6-promise` polyfill (or any other ES6-compatible promise implementation) to make `Promise` available in global scope:

    1. Shim `es6-promise` so that it can be required using:


            // Inside CJS module
            var promise = require('es6-promise`);
            promise.polyfill();

        or


            // Inside AMD module
            define([
              'es6-promise'
            ], function(promise){
              promise.polyfill();
            });
    
    1. Include polyfill directly in your HTML page:

    
            <script src="bower_components/es6-promise/promise.js"></script>
            <script>
              ES6Promise.polyfill();
            </script>


1. Require `notifications-client` in your code and use it like that:


        // CJS module
        var TOKEN = // grab your access_token to use with notifications API
        var client = require('notifications-client');

        client.init(TOKEN)
          .send({event: 'my-event', data: { field: 'value'}})
          .then(function () {
          // do smth when the message is sent
          }, function (ajaxResponse) {
          // do smth when there was an error when sending a message
          });

    or


        // AMD module
        define([
        'notifications-client'
        ], function(client){
        var TOKEN = // grab your access_token to use with notifications API

        client.init(TOKEN)
          .send({event: 'my-event', data: { field: 'value'}})
          .then(function () {
            // do smth when the message is sent
          }, function (ajaxResponse) {
            // do smth when there was an error when sending a message
          });
        });


## API

### client.init(token, params)

Create a new client connection using the `token` and `params`.

* `params.inboxUrl` - the HTTP url for message sending enpoint. Defaults to `http://inbox.yetudev.com/publish`
* `params.outboxUrl` - the HTTP url for message receiving endpoint. Defaults to `http://outbox.yetudev.com`
* Returns `connection`

```javascript
client.init(TOKEN, {
  inboxUrl: 'http://localhost:9000/publish',
  outboxUrl: 'http://localhost:8082'
}
```

### connection.send(message)

Send the message to the inbox endpoint.

* `message.event` - event type to send. Required field.
* `message.data` - custom data to send. Required field.
* Returns `Promise[Acknowledgement]`

```
client.init(TOKEN)
  .send({
  event: 'test-event',
  data : {
    field : 'Any custom data is allowed'
  }})
  .then(function(){
    // if the message is sent, then this callback will be triggered
  })
  .catch(function(){
    // if there was some problems while sending the message, this callback will be triggered
  });
```

### connection.subscribe(subscriptionRequest, onData, onError)

Subscribe to the outbox endpoint to receive events/notifications.

* `subscriptionRequest.event` - event type, which will be received. Require field.
* `onData(data)` - callback for every new notification/message.
* `onError(error)` - callback for any subscription error.
* Returns `Promise[SubscriptionAcknowledgement]`

```
client.init(TOKEN)
  .subscribe({ event: 'test-event' },
    function(data){
      // this callback will be triggered on every new 'test-event' message
    },
    function(error){
      // this callback will be triggered on any subscription error
  }})
  .then(function(){
    // this callback will be called if the subscription is established successfully
  })
  .catch(function(){
    // this callback will be called if the subscription failed
  });
```

## How to develop

1. Make sure you have `node` installed and you're running node version 0.10!

    ```
    node --version
    ```

1. Install `webpack`

1. Invoke `npm install` to install all nodejs modules


## Run tests

Simply invoke this command:

```
npm test
```

## Anti-ruining Automated Quality Assurance System

Are you afraid of committing "bad quality" code and ruining everything?
Afraid no more!

This project has a **git hooks integration**, which will run tests and check your javascript **before each commit**.