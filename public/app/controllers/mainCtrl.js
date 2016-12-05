angular.module('mainCtrl', [])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	// get info if a person is logged in



	//vm.loggedIn = Auth.isLoggedIn();

	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		//console.log(vm.loggedIn);
		if(!vm.loggedIn)$location.path('/login');
		// get user information on page load
		Auth.getUser()
			.then(function(data) {
				vm.user = data.data;
			});
	});

	// function to handle login form
	vm.doLogin = function() {
		vm.processing = true;
		// clear the error
		vm.error = '';

		Auth.login(vm.loginData.username, vm.loginData.password)
			.then(function(data) {
				vm.processing = false;

				// if a user successfully logs in, redirect to packages page
				if (data.success) {
          $location.path('/packages');
        }

				else{
          vm.error = data.message;
        }

			});
	};

	// function to handle logging out
	vm.doLogout = function() {
		Auth.logout();
		vm.user = '';

		$location.path('/login');
	};
	vm.doRegister = function() {
		console.log("madafaka");
		vm.processing = true;
		vm.message = '';
		console.log(vm.loginData);
		// use the create function in the userService
		Auth.create(vm.loginData)
			.then(function(data) {
				vm.processing = false;
				vm.userData = {};
				vm.message = data.data.message;
			});


	};


	vm.setTheme = function(theme) {
		var link = "assets/css/" + theme + ".css";
    document.getElementById("customCSS").href=link;


	};

});
