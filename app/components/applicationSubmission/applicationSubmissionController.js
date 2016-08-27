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

    $scope.appInfos = {
      name: "",
      description: "",
      price: "",
      logo: null,
      screenshots: null,
      url: "nothing atm",
    };

    $scope.submitApplicationAction = function() {
    
      console.log($scope.appInfos);
      console.log($scope.filteredCategories);
      console.log($scope.filteredDevices);

      var data = {
        name : $scope.appInfos.name,
        description : $scope.appInfos.description,
        price : $scope.appInfos.price,
        logo : $scope.appInfos.logo,
        devices: ["57a7624c87b8da510e7452ad"],
        categories: ["577e89c37a108ec22897dab1"],
        url: "url bidon"
      };

      console.log(data);

      $scope.loading = true;

      $http.post(url + '/api/applications/', data)
          .success(function(result) {

              $scope.loading = false;
              console.log(result);

            })
          .error(function(result) {
              
              console.log(result);
              $scope.loading = false;
      });
    }
});
