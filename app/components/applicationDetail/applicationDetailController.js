
website.controller('applicationDetailController', function($scope, $http, $routeParams){

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){

      $scope.applications = response.data.Applications;

    }, function(error){
      console.debug("failed dans la requête pour fetch la liste des applications");
    });

    $http.get(url + '/api/getComments/' + $routeParams.idApplications).then(function(response){

      $scope.comments = response.data.Comments;
    }, function(error){
      console.debug("failed dans la requête pour fetch la liste des commentaires");
    });

    console.log("Controller Detail d'une application");
});
