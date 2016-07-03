website.controller('applicationCommentsController', function($scope, $http, $routeParams){

    /* Liste of comments after the application of the filter. */
    $scope.filteredComments = [];

    /* Variables used for the pagination. */
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 5;

    /* Variables used for the filtering */
    $scope.commentFilters = ["Par date de publication", "Par note (décroissante)", "Par note (croissante)"];
    $scope.orderByFilters = ['-date', '-rating', '-rating'];
    $scope.reverseFilters = [false, false, true];
    $scope.selectedFilter = 0;

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

    /* Filtering functions */

    $scope.filterSelected = function (filter) {
      $scope.selectedFilter = $scope.commentFilters.indexOf(filter);
    }

    /* Pagination functions */

    $scope.$watch('currentPage + numPerPage', updateFilteredItems);
  
    function updateFilteredItems() {
        var begin = (($scope.currentPage - 1) * $scope.numPerPage);
        var end = begin + $scope.numPerPage;

        if ($scope.comments != null)
            $scope.filteredComments = $scope.comments.slice(begin, end);
    }

    /* Rating handling */

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
