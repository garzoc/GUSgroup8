angular.module('app.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

	$routeProvider
    //route for main page PLACEHOLDER,get rid of it
    .when('/', {
      templateUrl : 'app/views/pages/home.html'
    })

		// route for the packages page
		.when('/packages', {
			templateUrl : 'app/views/pages/packages.html'
		})
		// route for the sensors page
		.when('/sensors', {
			templateUrl : 'app/views/pages/sensors.html'

		})

		// login page
		.when('/login', {
			templateUrl : 'app/views/pages/login.html',
   			controller  : 'mainController',
    			controllerAs: 'login'
		});

		// show all users
	//	.when('/users', {
	//		templateUrl: 'app/views/pages/users/all.html',
	//		controller: 'userController',
	//		controllerAs: 'user'
	//	})

		// page to edit a user
	//	.when('/users/:user_id', {
	//		templateUrl: 'app/views/pages/users/single.html',
	//		controller: 'userEditController',
	//		controllerAs: 'user'
	//	});

	$locationProvider.html5Mode(true);

});
