website.controller('applicationDetailController', function($scope, $http, $routeParams){

    var limit = 3;

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){
      $scope.appInfos = response.data.Applications;
    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });

    $http.get(url + '/api/comments/' + $routeParams.idApplications + '/' + limit).then(function(response){
      $scope.comments = response.data.Comments;
    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
