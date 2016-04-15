
website.controller('applicationDetailController', function($scope, $http, $routeParams){

    console.log("Controller Detail d'une application");

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){

      $scope.applications = response.data.Applications;

    }, function(error){
      console.debug("failed dans la requête pour fetch la liste des devices");
    });

    $http.get(url + '/api/comments/' + $routeParams.idApplications).then(function(response){

      $scope.comments = response.data.Message;
    }, function(error){
      console.debug("failed dans la requête pour fetch la liste des devices");
    });

    console.log("Controller Detail d'une application");
});
