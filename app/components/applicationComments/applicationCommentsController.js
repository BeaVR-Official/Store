website.controller('applicationCommentsController', function($scope, $http, $routeParams){

    /* Liste of comments after the application of the filter. */
    $scope.filteredComments = [];

    /* Variables used for the pagination. */
    $scope.currentPage = 1;
    $scope.numPerPage = 2;

    $http.get(url + '/api/applications/' + $routeParams.idApplication).then(function(response){
      $scope.appInfos = response.data.Applications;
    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });

    $http.get(url + '/api/comments/' + $routeParams.idApplication).then(function(response){
      $scope.comments = response.data.Comments;
      $scope.filteredComments = response.data.Comments;
      updateFilteredItems();
    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });

    $scope.$watch('currentPage + numPerPage', updateFilteredItems);
  
    function updateFilteredItems() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        if ($scope.comments != null)
            $scope.filteredComments = $scope.comments.slice(begin, end);
    }

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
