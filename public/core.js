// public/core.js

var chartr = angular.module('chartr', []);

function mainController($scope, $http) {
	$scope.formData = {};
	$scope.mode = 0;

	// when landing on the page, get all charts and show them
	$http.get('/api/charts')
		.success(function(data) {
			$scope.charts = data;
			console.log(data);
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createChart = function() {
		$http.post('/api/chart', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.todos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.chartsByTagname = function(tag) {
		$http.get('/api/charts?tag='+tag).success(function(data) {
			$scope.charts = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.showMain = function() {
		if ( $scope.mode === 0 ) {
			console.log("Show Main");
		} else {
			console.log("Mode is : " + $scope.mode);
		}
		return ($scope.mode === 0);
	};

	$scope.showCharts = function() {
		if ( $scope.mode === 1 ) {
			console.log("Show Charts");
		} else {
			console.log("Mode is : " + $scope.mode);
		}
		return ($scope.mode === 1);
	};

}