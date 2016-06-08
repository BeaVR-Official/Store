
website.controller('mainController', function($scope, $http) {

  console.log("Controller Main");

  $scope.leftMenu = true;
  $scope.rightMenu = true;
  $http.get(url + '/api/applications').then(function(response){

  $scope.data = response.data.Applications;
  }, function(error){
    console.debug("Failure while fetching devices' list.");
  });
});

website.controller('navbarController', function($scope, $location) {
      $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
})