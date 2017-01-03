//.ajaxSetup({cache: false}});
angular.module('authService', [])

// ===================================================
// auth factory to login and get information
// inject $http for communicating with the API
// inject $q to return promise objects
// inject AuthToken to manage tokens
// ===================================================
.factory('Auth', function($http, $q, AuthToken,AuthUser) {

	// create auth factory object
	var authFactory = {};

	// log a user in
	authFactory.login = function(username, password) {
		// return the promise object and its data
		return $http.post('/api/authenticate', {
			username: username,
			password: password
		})
			.then(function(data) {


				var inc = data.data; //initially data.token sufficed but now data.data.token is needed
				AuthUser.setUser(inc.user);
				AuthToken.setToken(inc.token);
				console.log(inc.token);
       			return inc;
			});

	};

	// log a user out by clearing the token
	authFactory.logout = function() {
		// clear the token
		AuthToken.setToken();
		AuthUser.setUser();
	};

	// check if a user is logged in
	// checks if there is a local token
	authFactory.isLoggedIn = function() {
		if (AuthToken.getToken())
			return true;
		else
			return false;
	};

	// get the logged in user
	authFactory.getUser = function() {
		return AuthUser.getUser();
	};

	authFactory.getPackages = function(user) {

		return $http.post('/api/packages', {
			username : user });
	}

	authFactory.getSensors = function(user, host) {
		console.log(user + host);
		return $http.post('/api/sensors', {
			username : user,
			sensor_hub : host});
	}

	authFactory.getSensor = function(user, host, sensor, rrange) {
		console.log(user + host + sensor);
		return $http.post('/api/details', {
			sensor_id : user + host + sensor,
			range : rrange
		});
	}

	authFactory.create = function(userData) {

		return $http.post('/api/users/', userData);
	};
	// return auth factory object
	return authFactory;

})

// ===================================================
// factory for handling tokens
// inject $window to store token client-side
// ===================================================
.factory('AuthToken', function($window) {

	var authTokenFactory = {};

	// get the token out of local storage
	authTokenFactory.getToken = function() {
		return $window.localStorage.getItem('token');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authTokenFactory.setToken = function(token) {
		if (token)
			$window.localStorage.setItem('token', token);
	 	else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

})


.factory('AuthUser', function($window) {

	var authUserFactory = {};

	// get the token out of local storage
	authUserFactory.getUser = function() {
		return $window.localStorage.getItem('user');
	};

	// function to set token or clear token
	// if a token is passed, set the token
	// if there is no token, clear it from local storage
	authUserFactory.setUser = function(user) {
		if (user)
			$window.localStorage.setItem('user', user);
	 	else
			$window.localStorage.removeItem('user');
	};

	return authUserFactory;

})

// ===================================================
// application configuration to integrate token into requests
// ===================================================
.factory('AuthInterceptor', function($q, $location, AuthToken) {

	var interceptorFactory = {};

	// this will happen on all HTTP requests
	interceptorFactory.request = function(config) {

		// grab the token
		var token = AuthToken.getToken();

		// if the token exists, add it to the header as x-access-token
		if (token)
			config.headers['x-access-token'] = token;

		return config;
	};

	// happens on response errors
	interceptorFactory.responseError = function(response) {

		// if our server returns a 403 forbidden response
		if (response.status == 403) {
			AuthToken.setToken();
			$location.path('/login');
		}

		// return the errors from the server as a promise
		return $q.reject(response);
	};

	return interceptorFactory;

});
