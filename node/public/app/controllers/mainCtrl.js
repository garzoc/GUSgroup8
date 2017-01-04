angular.module('mainCtrl', ['chart.js'])

.controller('mainController', function($rootScope, $location, Auth) {

	var vm = this;

	$rootScope.packageArray = [];
	$rootScope.sensorArray = [];
	$rootScope.user = "";
	$rootScope.selectedHub = "";
	$rootScope.selectedSensor = "";
	$rootScope.valueDigest = "";
	$rootScope.chartlabels = [];
  $rootScope.chartseries = [];
  $rootScope.chartdata = [];
  chartClick = function (points, evt) {
    //console.log(points, evt);
  };
  $rootScope.chartdatasetOverride = [];
  $rootScope.chartoptions = {};



	//vm.loggedIn = Auth.isLoggedIn();
	var user={username:""};//temp soluetion
	var socket;
	// check to see if a user is logged in on every request
	$rootScope.$on('$routeChangeStart', function() {
		vm.loggedIn = Auth.isLoggedIn();
		$rootScope.user = Auth.getUser();

		if($location.url()==="/sensors"){
			//console.log("hellow woel");
			//console.log("yoyo  "+socket);
			if(socket===undefined){
			socket=new WebSocket("ws://46.239.112.118:22759/");
			socket.onopen=function(e){
				console.log("Establishing contact");
				socket.send('{"use":"joinProcess","context":{"serverId" : 0}}');
				//socket.send('{"use":"initProcess","context":{"name" : "boo","type":"test"}}');
				//socket.send('{"use":"lol"}');
			};

			socket.onmessage=function(e){
				e=JSON.parse(e.data);
				console.log(e);
				console.log(e.sensorID);
				document.getElementById(e.sensorID).innerHTML = e.value;
				//updateValue(e);
				//var incoming = JSON.parse(e.data);
			};

			socket.onclose=function(){
				console.log("Connection Closed");
			};
			}
		}else{
			if(socket!==undefined)socket.close();
			socket=undefined;
		}

		if($location.url()==="/sensors"||$location.url()==="/packages"){

			/*var test=vm.loginData;
			console.log(test.username);
			* Angular is broken
			* */
			
			//user.username
			Auth.getPackages(Auth.getUser()).then(function(data){
				$rootScope.packageArray = data.data.array;
			});



		}

		if(!vm.loggedIn)$location.path('/login');
		// get user information on page load
		/*Auth.getUser()
			.then(function(data) {
				//console.log(data.data+"          wehruiwheufwhuifhwufweuihf");
				vm.user = data.data;
			});*/
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
					$rootScope.user = vm.loginData.username;
					console.log($rootScope.user);
					/*Auth.getPackages(vm.loginData.username).then(function(data){
						$rootScope.packageArray = data.data.array;
					});*/
					user.username=vm.loginData.username;//temp solution
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
		vm.processing = true;
		// clear the error
		vm.error = '';
		vm.message = '';
		// use the create function in the userService
		Auth.create(vm.loginData)
			.then(function(data) {
				vm.processing = false;
				vm.userData = {};
				console.log(data.data);
				vm.message = data.message;
				if (data.data.success == false) {
					vm.error = data.data.message;
				}
				else {
					vm.message = data.data.message;
					vm.success = data.data.success;
				}
			}
	);


	};


	vm.getSensors = function(host) {
			$rootScope.selectedHub = host;
		Auth.getSensors($rootScope.user,host).then(function(data){
			$rootScope.sensorArray = data.data.array;
			$location.path('/sensors');
		});
	};

	vm.getSensor = function(sensor, range) {
		$rootScope.chartdata = [];
		$rootScope.chartlabels = [];
		$rootScope.selectedSensor = sensor;
		Auth.getSensor($rootScope.user, $rootScope.selectedHub, sensor, range).then(function(data){
			$rootScope.valueDigest = data.data.values;
			console.log($rootScope.valueDigest);
			changeChart(range, $rootScope.valueDigest);
			$location.path('/details');
		});
	};

	changeChart = function(range, values){


		if (range == 300000) {		// 5 minutes in ms
		values.forEach(function(entry){
			$rootScope.chartdata.push(entry.value);
		});
		$rootScope.chartlabels = ["60min ago", "", "", "", "", "50min ago", "", "", "", "", "40min ago", "", "", "", "", "30min ago", "", "", "", "", "20min ago", "", "", "", "", "10min ago", "", "", "", "", "just now"];
	}
	else if (range == 600000) {	//10 minutes in ms
		values.forEach(function(entry){
			$rootScope.chartdata.push(entry.value);
		});
		$rootScope.chartlabels = ["24hrs ago", "", "", "", "", "20hrs ago", "", "", "", "", "16hrs ago", "", "", "", "", "12hrs ago", "", "", "", "", "8hrs ago",  "", "", "", "","1hr ago", "", "", "", "", "just now"];
	}
	else if (range == 900000) {	//15 minutes in ms
		values.forEach(function(entry){
			$rootScope.chartdata.push(entry.value);
		});
		$rootScope.chartlabels = ["3d ago", "", "", "", "", "", "", "", "", "2d ago", "", "", "", "", "", "", "", "", "1d ago", "", "", "", "", "", "", "", "", "", "just now"];
	}
	};

	//real time DOM manipulation, according to the incoming messages
	vm.updateValue = function(incoming){
		document.getElementById(incoming.sensorID).innerHTML = incoming.value;
	};


	//change theme depending on which button is pressed
	vm.setTheme = function(theme) {
		var link = "assets/css/" + theme + ".css";
    document.getElementById("customCSS").href=link;


	};

});
