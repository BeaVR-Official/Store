website.controller('authenticationController', function ($scope, AuthenticationService, $http) {
  $scope.connectionData = {
    email: '',
    password: '',
  };
  $scope.resetPasswordData = {
    email: ''
  };
  $scope.subscriptionData = {
    firstName: '',
    lastName: '',
    email: '',
    pseudo: '',
    password: '',
  };
  $scope.justSubscribed = false;
  // 0 = connect, 1 = subscribe, 2 = reset pwd
  $scope.showMenu = 0;
  $scope.showForm = function (form) {
    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.showMenu = form;
  }
  $scope.connexionAction = function () {
    $scope.errorMessage = '';
    $scope.successMessage = '';
    var data = {
      email: $scope.connectionData.email,
      password: $scope.connectionData.password,
      checkbox: $scope.connectionData.checkbox
    };

    if (data.password && data.password.length >= 8) {
      AuthenticationService.login(data)
        .success(function (result) {
        })
        .error(function (result) {
          switch (result.error.status) {
            case 401:
              $scope.errorMessage = errorMessage["CONNEXION_401"];
              break;
            default:
              $scope.errorMessage = errorMessage["CONNEXION"];
              break;
          }
        });
    }
  };

  $scope.resetPasswordAction = function () {
    $scope.errorMessage = '';
    $scope.successMessage = '';
    var data = {
      email: $scope.resetPasswordData.email
    };

    $http.post(url + '/api/reset-password', data)
      .success(function (result) {
        $scope.successMessage = successMessage["MDPOUBLIE"];
      })
      .error(function (result) {
        switch (result.error.status) {
          case 404:
            $scope.errorMessage = errorMessage["MDPOUBLIE_404"];
            break;
          default:
            $scope.errorMessage = errorMessage["MDPOUBLIE"];
        }
      });
  };

  $scope.subscriptionAction = function () {
    var data = {
      email: $scope.subscriptionData.email,
      pseudo: $scope.subscriptionData.pseudo,
      password: $scope.subscriptionData.password
    };

    if ($scope.subscriptionData.firstName)
      data.firstName = $scope.subscriptionData.firstName;
    if ($scope.subscriptionData.lastName)
      data.lastName = $scope.subscriptionData.lastName;
    if (data.password && data.pseudo && data.pseudo.length >= 3 && data.pseudo.length <= 16 && data.password.length >= 8) {
      $http.post(url + '/api/users', data)
        .success(function (result) {
          $scope.subscriptionData = {};
          $scope.justSubscribed = true;
          $scope.showForm(0);
        })
        .error(function (result) {
          switch (result.error.status) {
            case 409:
              $scope.errorMessage = errorMessage["INSCRIPTION_409"];
              break;
            default:
              $scope.errorMessage = errorMessage["INSCRIPTION"];
          }
        });
    }
  };

  /***
  * Social Network
  */
  $scope.facebookConnection = function() {
    AuthenticationService.socialNetworkLogin(data, "facebook");
  }

  $scope.googleConnection = function() {
    $scope.errorMessage = '';
    $scope.successMessage = '';
    var data = {
      checkbox: $scope.connectionData.checkbox
    };

    AuthenticationService.socialNetworkLogin(data, "google")
      .success(function (result) {
      })
      .error(function (result) {
        switch (result.error.status) {
          case 401:
            $scope.errorMessage = errorMessage["CONNEXION_401"];
            break;
          default:
            $scope.errorMessage = errorMessage["CONNEXION"];
            break;
        }
    });
  }

});
