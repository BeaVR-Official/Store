
website.controller('mainController', function($scope, $http) {

  console.log("Controller Main");

  $scope.leftMenu = true;
  $scope.rightMenu = true;

  $http.get(url + '/api/applications').then(function(response){

      $scope.data = response.data.Message;

      console.log(response);

  }, function(error){
    console.debug("failed dans la requête pour fetch la liste des devices");
  });

});
