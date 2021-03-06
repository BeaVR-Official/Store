website.controller('applicationCommentsController', function ($scope, $rootScope, $http, $routeParams, $sce, AuthenticationService, appInfos, comments, userData) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
  if (userData !== undefined) {
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = userData.picture;
    $rootScope.pseudo = userData.pseudo;
    $rootScope.disconnect = AuthenticationService.disconnect;
    if (userData.rights.id == 2) {
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
    $scope.userInfos = userData;
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

  $scope.comments = comments;
  $scope.filteredComments = comments;
  updateFilteredItems();

  /* Variables for the old comment section */
  $scope.hasCommented;
  $scope.oldComment = {};

  /* Loading and stuff */
  $scope.loading = false;

  /* Data used when adding a comment */
  $scope.addCommentData = {
    author: (userData === undefined ? 0 : $scope.userInfos.id),
    title: '',
    comment: '',
    rating: 3,
    application: $routeParams.idApplication
  };

  /* We bind the preloaded data about the informations of the current application */
  $scope.appInfos = appInfos;

  /* Check if the user has already commented this application */
  $scope.checkHasCommented = function () {

    /* Get the comment of the user if he already posted one */
    var userComment = $.grep($scope.comments, function (e) { return e.author._id == $scope.addCommentData.author; });

    if (userComment !== undefined && userComment.length > 0) {
      $scope.hasCommented = true;
      $scope.oldComment = userComment[0];

      $scope.addCommentData = {
        idComment: $scope.oldComment.id,
        author: $scope.oldComment.author,
        title: $scope.oldComment.title,
        comment: $scope.oldComment.comment,
        rating: $scope.oldComment.rating,
        application: $scope.oldComment.application,
      }

      $('#input-21b').rating('update', $scope.oldComment.rating);
    }
    else {
      $scope.hasCommented = false;
    }

  }

  $scope.checkHasCommented();

  /* Add Comment */

  $scope.initialRating = null;

  // No Angular handling for Bootstrap star-rating so we do it à la mano
  $('#input-21b').on('rating.change', function (event, value, caption) {
    if ($scope.hasCommented == true && $scope.initialRating == null)
      $scope.initialRating = $scope.addCommentData.rating;
    // 'value' is a string here!
    $scope.addCommentData.rating = Number(value);
  });
  $('#input-21b').on('rating.clear', function (event, value, caption) {
    // 'value' is a string here!
    $scope.addCommentData.rating = 0;
  });

  $scope.addCommentAction = function () {

    if ($scope.canComment == false) {
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_HTML"]);
        $rootScope.showErrorAlert = true;
    }
    else {

      var data = {
        title: $scope.addCommentData.title,
        comment: $scope.addCommentData.comment,
        rating: $scope.addCommentData.rating,
        author: { public: { picture: "" } },
      };

      $scope.loading = true;

      if (!data.title || data.title.length == 0) {
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["COMMENT_TITLE"]);
        $rootScope.showErrorAlert = true;
        $scope.loading = false;
      }
      else if (!data.comment || data.comment.length == 0) {
        $scope.loading = false;
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["COMMENT_COMMENT"]);
        $rootScope.showErrorAlert = true;
      }
      else {
        $http.post(url + '/api/applications/' + $scope.appInfos._id + "/comments", data)
          .success(function (result) {

            $scope.checkHasCommented();
            $rootScope.successMessageAlert = $sce.trustAsHtml(successMessage["ADD_COMMENT"]);
            $rootScope.showSuccessAlert = true;

            // Add the comment to the list so it can refresh dynamically.
            data.created_at = new Date();
            data.author.public.picture = $scope.userInfos.picture;
            data.author.public.pseudo = $scope.userInfos.pseudo;
            data.author._id = $scope.userInfos.id;
            $scope.comments.push(data);
            $scope.filteredComments = comments;
            updateFilteredItems();
            updateAverageNote(null, data.rating);

            $scope.appInfos.commentsNb += 1;
            $scope.hasCommented = true;
            $scope.initialRating = data.rating;

            setTimeout(function () {
              $('#addComment').collapse('hide');
            }, 3000);

            $scope.loading = false;

          })
          .error(function (result) {
            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["ADD_COMMENT"]);
            $rootScope.showErrorAlert = true;
            $scope.loading = false;
          });
      }
    }

  }

  /* Edit a comment */
  $scope.editCommentAction = function () {

    if ($scope.canComment == false) {
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_HTML"]);
        $rootScope.showErrorAlert = true;
    }
    else {

      var data = {
        title: $scope.addCommentData.title,
        comment: $scope.addCommentData.comment,
        rating: $scope.addCommentData.rating,
      };

      $scope.loading = true;

      if (!data.title || data.title.length == 0) {
        $scope.loading = false;
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["COMMENT_TITLE"]);
        $rootScope.showErrorAlert = true;
      }
      else if (!data.comment || data.comment.length == 0) {
        $scope.loading = false;
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["COMMENT_COMMENT"]);
        $rootScope.showErrorAlert = true;
      }
      else {
        $http.put(url + '/api/applications/' + $scope.appInfos.id + "/comments/" + $scope.addCommentData.idComment, data)
          .success(function (result) {

            $rootScope.successMessageAlert = $sce.trustAsHtml(successMessage["EDIT_COMMENT"]);
            $rootScope.showSuccessAlert = true;

            for (var i = 0; i < $scope.comments.length; i++) {
              if ($scope.comments[i].author._id == $scope.userInfos._id) {
                $scope.comments[i].title = data.title;
                $scope.comments[i].comment = data.comment;
                $scope.comments[i].rating = data.rating;
              }
            }

            updateAverageNote($scope.initialRating, data.rating);
            $scope.initialRating = data.rating;
          
            setTimeout(function () {
              $('#addComment').collapse('hide');
            }, 3000);

            $scope.loading = false;

          })
          .error(function (result) {

            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_COMMENT"]);
            $rootScope.showErrorAlert = true;
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

  $scope.getNumberFullStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.ceil(n));
  };

  $scope.getNumberEmptyStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.trunc(n));
  }

  function updateAverageNote(oldRating, newRating) {
    var oldTotal = $scope.appInfos.noteAvg * $scope.appInfos.commentsNb;
    oldTotal += newRating;

    if (oldRating != null) {
      oldTotal -= oldRating;
      var newTotal = oldTotal / ($scope.appInfos.commentsNb);
    }
    else {
      oldTotal -= oldRating;
      var newTotal = oldTotal / ($scope.appInfos.commentsNb + 1);
    }
    $scope.appInfos.noteAvg = newTotal;
  }
});
