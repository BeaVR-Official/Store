website.controller('applicationSubmissionController', function($scope, $rootScope, $http, userData, AuthenticationService, categories, devices, Upload) {
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

    $scope.categories = categories.data.data.categories;
    $scope.devices = devices.data.data.devices;
    
    $scope.filteredCategories = [];
    $scope.filteredDevices = [];

    $scope.localLangCategories = {
      selectAll       : "",
      selectNone      : "",
      reset           : "",
      search          : "Rechercher ...",
      nothingSelected : "Sélectionnez une ou plusieurs catégories"
    }

    $scope.localLangDevices = {
      selectAll       : "",
      selectNone      : "",
      reset           : "",
      search          : "Rechercher ...",
      nothingSelected : "Sélectionnez un ou plusieurs matériels de réalité virtuelle"
    }
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
