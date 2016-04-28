
website.controller('offlineController', function($scope, $http) {

  console.log("Controller offline");

  $scope.leftMenu = true;
  $scope.rightMenu = true;

  $http.get(url + '/api/applications').then(function(response){

      $scope.data = response.data.Applications;
  }, function(error){
    console.debug("failed dans la requête pour fetch la liste des devices");
  });

});
