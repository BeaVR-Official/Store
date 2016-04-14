
website.controller('mainController', function($scope, $http) {

  console.log("Controller Main");

  $scope.leftMenu = true;
  $scope.rightMenu = true;

  $http.get(url + '/api/applications').then(function(response){

    console.log(response);

      /*$scope.data = {
        'description' : response.data.Message[0].description,
        'idApplications' : response.data.Message[0].idApplications,
        'name' : response.data.Message[0].name,
        'price' : response.data.Message[0].price,
      };*/

      $scope.data = response.data.Message;

  }, function(error){
    console.debug("failed dans la requête pour fetch la liste des devices");
  });

});
