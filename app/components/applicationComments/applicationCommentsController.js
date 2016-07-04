website.controller('applicationCommentsController', function($scope, $http, $routeParams, AuthenticationService){

    /* Liste of comments after the application of the filter. */
    $scope.filteredComments = [];

    /* Variables for the old comment section */
    $scope.hasCommented;
    $scope.oldComment = {};

    $scope.loading;
    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

    $scope.userInfos = AuthenticationService.getToken();

    /* Data used when adding a comment */
    $scope.addCommentData = {
      author : $scope.userInfos.id,
      title : '',
      comment : '',
      rating : 3,
      application : $routeParams.idApplication
    };

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

    $scope.checkHasCommented = function() {

      $http.post(url + '/api/comments/hasCommented/' + $routeParams.idApplication, { idAuthor : $scope.userInfos.id }).success(function(result) {
        console.log(result);
          if (result.Error == false) {
            $scope.hasCommented = true;
            $scope.oldComment = result.Comment;

            $scope.addCommentData = {
              idComment : $scope.oldComment.idComment,
              author : $scope.oldComment.author,
              title : $scope.oldComment.title,
              comment : $scope.oldComment.comment,
              rating : $scope.oldComment.rating,
              application : $scope.oldComment.application,
            }

            $('#input-21b').rating('update', $scope.oldComment.rating);

          } else {
            switch (result.Code)
            {
              case 102:
                $("#addCommentForm button").each(function() {
                  $(this).prop('disabled', true);
                });
                $scope.returnMessage = errorMessage["HAS_COMMENTED"];
                returnMessageDiv.addClass("error-message"); 
                break;
              case 103:
                $scope.hasCommented = false;
                break;
            }
          }
      }).error(function(result) {
          $("#addCommentForm button").each(function() {
            $(this).prop('disabled', true);
          });
          $scope.returnMessage = errorMessage["HAS_COMMENTED"];
          returnMessageDiv.addClass("error-message"); 
      });

    }

    $scope.checkHasCommented();

    $scope.getAllComments = function() {

      $http.get(url + '/api/comments/' + $routeParams.idApplication).then(function(response){
        $scope.comments = response.data.Comments;

        $scope.filteredComments = response.data.Comments;
        updateFilteredItems();
      }, function(error){
        console.debug("Failure while fetching comments' list.");
      });

    }

    $scope.getAllComments();

    /* Add Comment */

    // No Angular handling for Bootstrap star-rating so we do it à la mano
    $('#input-21b').on('rating.change', function(event, value, caption) {
      // 'value' is a string here!
      $scope.addCommentData.rating = Number(value);
    });
    $('#input-21b').on('rating.clear', function(event, value, caption) {
      // 'value' is a string here!
      $scope.addCommentData.rating = 0;
    });

    $scope.addCommentAction = function() {

        var data = {
         title : $scope.addCommentData.title,
         comment : $scope.addCommentData.comment,
         rating : $scope.addCommentData.rating,
         author : $scope.addCommentData.author,
         application : $scope.addCommentData.application
       };

       $scope.loading = true;

       $http.post(url + '/api/comments/' + $routeParams.idApplication, data)
             .success(function(result) {
                 if (result.Error == false) {
                   
                   $scope.checkHasCommented();
                   $scope.returnMessage = successMessage["ADD_COMMENT"];
                   returnMessageDiv.addClass("success-message"); 
                   $scope.getAllComments();
                   $scope.appInfos.nbComments += 1;

                   setTimeout(function() {
                      $('#addComment').collapse('hide');
                    }, 3000);

                 } else {
                   switch (result.Code)
                   {
                     case 102:
                      $scope.returnMessage = errorMessage["ADD_COMMENT_102"];
                      returnMessageDiv.addClass("error-message"); 
                      break;
                   }
                 }

                 $scope.loading = false;

              })
             .error(function(result) {
                $scope.returnMessage = errorMessage["ADD_COMMENT"];
                returnMessageDiv.addClass("error-message"); 
                $scope.loading = false;
         });

    }

    /* Edit a comment */
    $scope.editCommentAction = function() {

        var data = {
         idComment : $scope.addCommentData.idComment,
         title : $scope.addCommentData.title,
         comment : $scope.addCommentData.comment,
         rating : $scope.addCommentData.rating,
         author : $scope.addCommentData.author,
         application : $scope.addCommentData.application
       };

       $scope.loading = true;

       $http.put(url + '/api/comments/' + $scope.addCommentData.idComment, data)
             .success(function(result) {
                 if (result.Error == false) {
                   $scope.returnMessage = successMessage["EDIT_COMMENT"];
                   returnMessageDiv.addClass("success-message"); 
                   $scope.getAllComments();

                   setTimeout(function() {
                      $('#addComment').collapse('hide');
                    }, 3000);

                 } else {
                   switch (result.Code)
                   {
                     case 102:
                      $scope.returnMessage = errorMessage["EDIT_COMMENT_102"];
                      returnMessageDiv.addClass("error-message"); 
                      break;
                   }
                 }
                  console.log(result);
                 $scope.loading = false;

              })
             .error(function(result) {
                $scope.returnMessage = errorMessage["EDIT_COMMENT"];
                returnMessageDiv.addClass("error-message"); 
                $scope.loading = false;
         });

    }

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
