// defined a shim for karma-webpack
// karma-webpack cannot resolve webpack externals using global, it tries to use window instead

define([
], function( ){
   return global.io;
});
