angular.module('smosApp', ['ngAnimate', 'app.routes', 'mainCtrl', 'authService']) //, 'userCtrl', 'userService'])

// application configuration to integrate token into requests
.config(function($httpProvider) {

	// attach our auth interceptor to the http requests
	$httpProvider.interceptors.push('AuthInterceptor');

});
