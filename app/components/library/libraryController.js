website.controller('libraryController', function($scope, $http, $window, $cookies) {

  if ($window.localStorage.getItem('token') !== null) {
      $http.get(url + '/api/users/applications/' + $window.localStorage.getItem('token')).then(function(response) {
        $scope.userAppsInfos = response.data.Users;

      }, function(error){
        console.debug("Failure while fecthing library informations.");
      });
  } else if ($cookies.get('token') !== undefined) {
    $http.get(url + '/api/users/applications/' + $cookies.get('token')).then(function(response) {
        $scope.userAppsInfos = response.data.Users;

      }, function(error){
        console.debug("Failure while fecthing library informations.");
      });
  } else {
    $window.location.href = "#/404"
  }

  console.log("Controller Library");
});
