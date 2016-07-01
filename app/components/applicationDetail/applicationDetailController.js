website.controller('applicationDetailController', function($scope, $http, $routeParams){

    var limit = 3;

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){

      $scope.appInfos = response.data.Applications;

    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });

    $http.get(url + '/api/comments/' + $routeParams.idApplications + '/' + limit).then(function(response){

      $scope.comments = response.data.Comments;

      console.log($scope.comments);

    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });
});
