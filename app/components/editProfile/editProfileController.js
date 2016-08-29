website.controller('editProfileController', function ($scope, $rootScope, $http, userData, AuthenticationService, Upload) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
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
  $scope.userInfos = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    pseudo: userData.pseudo,
    password: '',
    confirmPassword: '',
    profilePicture: userData.picture,
    newProfilePicture: null
  };
  $scope.returnMessage = '';
  $scope.loading;

  $scope.uploadImageAction = function () {
    var file = Upload.base64DataUrl($scope.userInfos.newProfilePicture).then(function (res) {
      var data = {
        picture: {
          filename: $scope.userInfos.newProfilePicture.name,
          buffer: res
        }
      };
      $http.put(url + '/api/users/' + userData.id, data)
        .success(function (result) {
          $scope.userInfos = {
            firstName: result.data.user.firstName,
            lastName: result.data.user.lastName,
            email: result.data.user.email,
            pseudo: result.data.user.pseudo,
            password: '',
            confirmPassword: '',
            profilePicture: result.data.user.picture,
            newProfilePicture: null
          };
          $rootScope.profilePicture = result.data.user.picture;
        }).error(function (error) {
          var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
          returnMessageDiv.removeClass("success-message");
          returnMessageDiv.addClass("error-message");
          $scope.returnMessage = errorMessage["EDIT_PROFILE_PROFILE_PICTURE"];
        });
    });
  }

  $scope.editProfileAction = function () {
    var data = {
      firstName: $scope.userInfos.firstName,
      lastName: $scope.userInfos.lastName,
      email: $scope.userInfos.email,
      password: $scope.userInfos.password,
      confirmPassword: $scope.userInfos.confirmPassword
    };

    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
    var dataToSend = {
      email: data.email
    };

    if (data.password && data.confirmPassword) {
      if (!arePasswordsMatching(data.password, data.confirmPassword)) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = errorMessage["EDIT_PROFILE_PASSWORD"];
        return;
      } else {
        dataToSend.password = data.password;
      }
    }
    $scope.loading = true;

    if (data.firstName)
      dataToSend.firstName = data.firstName;
    if (data.lastName)
      dataToSend.lastName = data.lastName;
    $http.put(url + '/api/users/' + userData.id, dataToSend)
      .success(function (result) {
        $scope.userInfos = {
          firstName: result.data.user.firstName,
          lastName: result.data.user.lastName,
          email: result.data.user.email,
          pseudo: result.data.user.pseudo,
          password: '',
          confirmPassword: '',
          profilePicture: result.data.user.picture,
          newProfilePicture: null
        };
        returnMessageDiv.removeClass("error-message");
        returnMessageDiv.addClass("success-message");
        $scope.returnMessage = successMessage["EDIT_PROFILE"];
        $scope.loading = false;
      })
      .error(function (result) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        switch (result.error.status) {
          case 403:
            $scope.returnMessage = errorMessage["EDIT_PROFILE_403"];
            break;
          case 404:
            $scope.returnMessage = errorMessage["EDIT_PROFILE_404"];
            break;
          case 409:
            $scope.returnMessage = errorMessage["EDIT_PROFILE_409"];
            break;
          default:
            $scope.returnMessage = errorMessage["EDIT_PROFILE"];
            break;
        }
        $scope.loading = false;
      });
  };

  function arePasswordsMatching(password, confirmPassword) {
    if (password.length >= 8 && confirmPassword.length >= 8) {
      if (password === confirmPassword)
        return true;
    }
    return false;
  };
});