website.controller('applicationCommentsController', function($scope, $rootScope, $http, $routeParams, AuthenticationService, appInfos, comments, userData){
    
    $rootScope.menu = true;
    $rootScope.filterMenu = false;
    if (userData !== undefined) {
      var userInfos = userData.data.data;
      $rootScope.onlineMenu = true;
      $rootScope.offlineMenu = false;
      $rootScope.profilePicture = userData.data.data.picture;
      $rootScope.disconnect = AuthenticationService.disconnect;
      if (userInfos.rights.id == 2) {
        $rootScope.devMenu = true;
        $rootScope.registerDev = false;
      } else {
        $rootScope.devMenu = false;
        $rootScope.registerDev = true;
      }
    } else {
      $rootScope.onlineMenu = false;
      $rootScope.offlineMenu = true;
      $rootScope.devMenu = false;
    }

    /* If the user is connected, then he can add or edit a comment. Otherwise, the button are disabled and hidden. */
    if (userData === undefined) {
      $scope.canComment = false;
    }
    else {
      $scope.canComment = true;
      $scope.userInfos = userData.data.data;
    }

    /* Variables used for the pagination. */
    $scope.currentPage = 1;
    $scope.numPerPage = 5;
    $scope.maxSize = 5;

    /* Liste of comments after the application of the filter. */
    $scope.filteredComments = [];
    
    /* Variables used for the filtering */
    $scope.commentFilters = ["Par date de publication", "Par note (décroissante)", "Par note (croissante)"];
    $scope.orderByFilters = ['-date', '-rating', '-rating'];
    $scope.reverseFilters = [false, false, true];
    $scope.selectedFilter = 0;

    $scope.comments = comments.data.data.comments;
    $scope.filteredComments = comments.data.data.comments;
    updateFilteredItems();

    /* Variables for the old comment section */
    $scope.hasCommented;
    $scope.oldComment = {};

    /* Loading and stuff */
    $scope.loading = false;
    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

    /* Data used when adding a comment */
    $scope.addCommentData = {
      author : (userData === undefined ? 0 : $scope.userInfos.id),
      title : '',
      comment : '',
      rating : 3,
      application : $routeParams.idApplication
    };

    /* We bind the preloaded data about the informations of the current application */
    $scope.appInfos = appInfos.data.data.application;

    /* Check if the user has already commented this application */
    $scope.checkHasCommented = function() {

        /* Get the comment of the user if he already posted one */
        var userComment = $.grep($scope.comments, function(e){ return e.author._id == $scope.addCommentData.author; });
        
        if (userComment !== undefined && userComment.length > 0) {
          $scope.hasCommented = true;
          $scope.oldComment = userComment[0];

          $scope.addCommentData = {
            idComment : $scope.oldComment.id,
            author : $scope.oldComment.author,
            title : $scope.oldComment.title,
            comment : $scope.oldComment.comment,
            rating : $scope.oldComment.rating,
            application : $scope.oldComment.application,
          }
          
          $('#input-21b').rating('update', $scope.oldComment.rating);
        }
        else {
          $scope.hasCommented = false;
        }

    }

    $scope.checkHasCommented();

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

        if ($scope.canComment == false) {
          returnMessageDiv.addClass("error-message");
          $scope.returnMessage = errorMessage["EDIT_HTML"];
        }
        else {

          var data = {
            title : $scope.addCommentData.title,
            comment : $scope.addCommentData.comment,
            rating : $scope.addCommentData.rating,
            author : { public : { picture : "" } },
          };

          $scope.loading = true;

          if (!data.title || data.title.length == 0)
          {
            $scope.returnMessage = errorMessage["COMMENT_TITLE"];
            $scope.loading = false;
            returnMessageDiv.addClass("error-message");
          }
          else if (!data.comment || data.comment.length == 0)
          {
            $scope.returnMessage = errorMessage["COMMENT_COMMENT"];    
            $scope.loading = false;
            returnMessageDiv.addClass("error-message"); 
          }
          else {
            $http.post(url + '/api/applications/' + $scope.appInfos._id + "/comments", data)
                .success(function(result) {

                    $scope.checkHasCommented();
                    $scope.returnMessage = successMessage["ADD_COMMENT"];
                    returnMessageDiv.addClass("success-message");

                    // Add the comment to the list so it can refresh dynamically.
                    data.created_at = new Date(); //(new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ');
                    console.log(data.created_at);
                    data.author.public.picture = $scope.userInfos.picture;
                    data.author.public.pseudo = $scope.userInfos.pseudo;
                    $scope.comments.push(data);
                    $scope.filteredComments = comments.data.data.comments;
                    updateFilteredItems();
                    
                    $scope.appInfos.commentsNb += 1;

                    setTimeout(function() {
                        $('#addComment').collapse('hide');
                      }, 3000);

                    $scope.loading = false;

                  })
                .error(function(result) {
                    $scope.returnMessage = errorMessage["ADD_COMMENT"];
                    returnMessageDiv.addClass("error-message"); 
                    $scope.loading = false;
            });
          }
        }

    }

    /* Edit a comment */
    $scope.editCommentAction = function() {

        if ($scope.canComment == false) {
          returnMessageDiv.addClass("error-message");
          $scope.returnMessage = errorMessage["EDIT_HTML"];
        }
        else {

          var data = {
            title : $scope.addCommentData.title,
            comment : $scope.addCommentData.comment,
            rating : $scope.addCommentData.rating,
          };

          $scope.loading = true;

          if (!data.title || data.title.length == 0)
          {
            $scope.returnMessage = errorMessage["COMMENT_TITLE"];
            $scope.loading = false;
            returnMessageDiv.addClass("error-message");
          }
          else if (!data.comment || data.comment.length == 0)
          {
            $scope.returnMessage = errorMessage["COMMENT_COMMENT"];    
            $scope.loading = false;
            returnMessageDiv.addClass("error-message"); 
          }
          else {
            $http.put(url + '/api/applications/' + $scope.appInfos.id + "/comments/" + $scope.addCommentData.idComment, data)
                  .success(function(result) {

                      $scope.returnMessage = successMessage["EDIT_COMMENT"];
                      returnMessageDiv.addClass("success-message"); 
                      
                      for (var i = 0; i < $scope.comments.length; i++)
                      {
                        if ($scope.comments[i].author._id == $scope.userInfos._id) {
                          $scope.comments[i].title = data.title;
                          $scope.comments[i].comment = data.comment;
                          $scope.comments[i].rating = data.rating;
                        }
                      }

                      setTimeout(function() {
                          $('#addComment').collapse('hide');
                        }, 3000);

                      $scope.loading = false;

                    })
                  .error(function(result) {

                      $scope.returnMessage = errorMessage["EDIT_COMMENT"];
                      returnMessageDiv.addClass("error-message"); 
                      $scope.loading = false;
              });
          }
        }
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

    $scope.getNumberFullStar = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(Math.ceil(n));
    };

    $scope.getNumberEmptyStar = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(Math.trunc(n));
    }
});
