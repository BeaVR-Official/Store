website.controller('editProfileController', function ($scope, $rootScope, $http, $sce, userData, AuthenticationService, Upload) {
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
          $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE_PROFILE_PICTURE"]);
          $rootScope.showErrorAlert = true;
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

    var dataToSend = {
      email: data.email
    };

    if (data.password && data.confirmPassword) {
      if (!arePasswordsMatching(data.password, data.confirmPassword)) {
        $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE_PASSWORD"]);
        $rootScope.showErrorAlert = true;
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
        $rootScope.successMessageAlert = $sce.trustAsHtml(successMessage["EDIT_PROFILE"]);
        $rootScope.showSuccessAlert = true;
        $scope.loading = false;
      })
      .error(function (result) {
        switch (result.error.status) {
          case 403:
            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE_403"]);
            break;
          case 404:
            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE_404"]);
            break;
          case 409:
            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE_409"]);
            break;
          default:
            $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["EDIT_PROFILE"]);
            break;
        }
        $scope.loading = false;
        $rootScope.showErrorAlert = true;
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