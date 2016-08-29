website.controller('feedbackController', function ($scope, $http, AuthenticationService) {
  $scope.feedbackData = {
    idUser: this.idUser,
    object: '',
    description: '',
    recontact: false,
  };

  $scope.returnMessage = '';
  $scope.loading;

  $scope.feedbackAction = function () {

    $scope.userInfos = AuthenticationService.getToken();

    var data = {
      idUser: $scope.userInfos.id,
      object: $scope.feedbackData.object,
      description: $scope.feedbackData.description,
      recontact: $scope.feedbackData.recontact
    };

    $scope.loading = true;
    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

    if (data.recontact == null)
      data.recontact = false;

    $http.post(url + '/api/feedbacks', data)
      .success(function (result) {
        $scope.feedbackData = {};
        returnMessageDiv.addClass("success-message");
        returnMessageDiv.removeClass("error-message");
        $scope.returnMessage = successMessage["FEEDBACK"];
        $scope.loading = false;
      })
      .error(function (result) {
        returnMessageDiv.addClass("error-message");
        returnMessageDiv.removeClass("success-message");
        switch (result.error.status) {
          case 400:
            $scope.returnMessage = errorMessage["FEEDBACK_400"];
            break;
          case 403:
            $scope.returnMessage = errorMessage["FEEDBACK_403"];
            break;
          default:
            $scope.returnMessage = errorMessage["FEEDBACK"];
            break;
        }
        $scope.loading = false;
      });
  };
});