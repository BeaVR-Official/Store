website.controller('applicationDetailController', function($scope, $http, $routeParams, appInfos, comments){

    $scope.appInfos = appInfos.data.Applications;
    $scope.comments = comments.data.Comments;

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
