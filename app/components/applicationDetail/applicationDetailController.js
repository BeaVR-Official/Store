website.controller('applicationDetailController', function($scope, $http, $routeParams){

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){

      $scope.applications = response.data.Applications;

    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });

    $http.get(url + '/api/getComments/' + $routeParams.idApplications).then(function(response){

      $scope.comments = response.data.Comments;
    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });

    console.log("Controller Detail d'une application");
});
