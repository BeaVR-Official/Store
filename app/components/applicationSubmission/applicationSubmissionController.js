website.controller('applicationSubmissionController', function($scope, $rootScope, $http, userData, AuthenticationService, Upload) {
    $rootScope.menu = true;
    $rootScope.homePage = false;
    if (userData !== undefined) {
      var userInfos = userData.data.data;
      $rootScope.onlineMenu = true;
      $rootScope.offlineMenu = false;
      $rootScope.profilePicture = userData.data.data.picture;
      $rootScope.pseudo = userData.data.data.pseudo;
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

    $('.ui.dropdown')
  .dropdown({
    maxSelections:3,
    message : {
      maxSelections : "Kappa"
    }
  })
;
    $scope.uploadScreenshots = function (files) {
        $scope.files = files;
        if (files && files.length) {
            Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {
                    files: files
                }
            }).then(function (response) {
                $scope.screenshotsResult = response.data;
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            });
        }
    };
  });
