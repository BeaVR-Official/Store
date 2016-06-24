website.controller('editProfileController', function($scope, $http, $window, $cookies) {
	
	if ($window.localStorage.getItem('token') !== null) {
	    $http.get(url + '/api/users/' + $window.localStorage.getItem('token')).then(function(response) {
	      $scope.userInfos = response.data.Users;

	    }, function(error){
	      console.debug("failed dans la requête pour fetch la liste des applications");
	    });
	} else if ($cookies.get('token') !== undefined) {
		$http.get(url + '/api/users/' + $cookies.get('token')).then(function(response) {
	      $scope.userInfos = response.data.Users;

	    }, function(error){
	      console.debug("failed dans la requête pour fetch la liste des applications");
	    });
	} else {
		$window.location.href = "#/404"
	}

    console.log("Controller Edit Profile");
});