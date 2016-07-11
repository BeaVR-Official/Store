website.controller('editProfileController', function($scope, $rootScope, $http, token, AuthenticationService, USER_ROLES, userInfos, Upload) {
    $rootScope.menu = true;
    $rootScope.filterMenu = false;
	  $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = token.profilePicture;
    $rootScope.disconnect = AuthenticationService.disconnect;
    if (AuthenticationService.isAuthorized(USER_ROLES.Developer)) {
      $rootScope.devMenu = true;
      $rootScope.registerDev = false;
    } else {
      $rootScope.devMenu = false;
      $rootScope.registerDev = true;
    }
  $scope.userInfos = {
    firstName: userInfos.data.Users.firstName,
    lastName: userInfos.data.Users.lastName,
    email: userInfos.data.Users.email,
    pseudo: userInfos.data.Users.pseudo,
    password: '',
    confirmPassword: '',
    profilePicture: userInfos.data.Users.profilePicture,
    newProfilePicture: null
  };
  $scope.returnMessage = '';
  $scope.loading;

  /* A update quand l'upload d'image sera fix */
  $scope.uploadImageAction = function() {
    var file = $scope.userInfos.newProfilePicture;
    file.upload = Upload.upload({
      url: url + '/api/users/upload/' + userInfos.data.Users.id,
      method: 'POST',
      fields: {id: userInfos.data.Users.id},
      file: file,
      fileFormDataName: 'file'
    });

    file.upload.then(function(response) {
      file.result = response.data;
    }, function(response) {
      if (response.status > 0)
        console.log(response.data);
    });

    file.upload.progress(function(event) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * event.loaded / event.total));
    })
  }

  $scope.editProfileAction = function() {
    var data = {
      firstName: $scope.userInfos.firstName,
      lastName: $scope.userInfos.lastName,
      email: $scope.userInfos.email,
      password: $scope.userInfos.password,
      confirmPassword: $scope.userInfos.confirmPassword,
      profilePicture: $scope.userInfos.profilePicture,
      newProfilePicture: $scope.userInfos.newProfilePicture
    };

    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
    if (data.password && data.confirmPassword) {
      if (!arePasswordsMatching(data.password, data.confirmPassword)) {
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = errorMessage["EDIT_PROFILE_PASSWORD"];
        return ;
      }
    }
    $scope.loading = true;
    var dataToSend = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      profilePicture: data.profilePicture
    };
    if (!data.newProfilePicture === null)
      dataToSend.profilePicture = data.newProfilePicture;
      $http.put(url + '/api/users/' + userInfos.data.Users.id, dataToSend)
          .success(function(result) {
              if (result.Error == false) {
                  console.log(result);
                  $scope.userInfos = {
                    firstName: result.Users.firstName,
                    lastName: result.Users.lastName,
                    email: result.Users.email,
                    pseudo: result.Users.pseudo,
                    password: '',
                    confirmPassword: '',
                    profilePicture: result.Users.profilePicture,
                    newProfilePicture: null
                  };
                  returnMessageDiv.addClass("success-message");
                  $scope.returnMessage = successMessage["EDIT_PROFILE"];
                  $scope.loading = false;
              } else {
                switch (result.Code)
                {
                  case 102:
                    $scope.returnMessage = errorMessage["EDIT_PROFILE"];
                    returnMessageDiv.addClass("error-message"); 
                    break;
                }
              }
              $scope.loading = false;
            })
          .error(function(result) {
              $scope.returnMessage = errorMessage["EDIT_PROFILE"];
              returnMessageDiv.addClass("error-message"); 
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