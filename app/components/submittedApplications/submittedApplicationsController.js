website.controller('submittedApplicationsController', function ($scope, $rootScope, $http, userData, AuthenticationService, categories, devices, Upload, appInfos) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
  $rootScope.onlineMenu = true;
  $rootScope.offlineMenu = false;
  $rootScope.profilePicture = userData.picture;
  $rootScope.pseudo = userData.pseudo;
  $rootScope.disconnect = AuthenticationService.disconnect;
  $rootScope.devMenu = true;
  $rootScope.registerDev = false;
  $scope.filteredCategories = [];
  $scope.filteredDevices = [];
  $scope.nbOwners = 0;
  $scope.applications = appInfos;

  $scope.localLangCategories = {
    selectAll: "",
    selectNone: "",
    reset: "",
    search: "Rechercher ...",
    nothingSelected: "Sélectionnez une ou plusieurs catégories"
  }

  $scope.localLangDevices = {
    selectAll: "",
    selectNone: "",
    reset: "",
    search: "Rechercher ...",
    nothingSelected: "Sélectionnez un ou plusieurs matériels de réalité virtuelle"
  }

  $scope.appInfos = {
    name: "",
    description: "",
    price: "",
    logo: null,
    screenshots: null,
    url: "nothing atm",
  };

  $scope.updateApp = function (app) {
    $scope.nbOwners = 0;
    $http.get(url + '/api/applications/' + app.id + '/purchase')
      .success(function (result) {
        $scope.nbOwners = result.data.count;
      })
      .error(function (result) {
        $scope.nbOwners = 0;
      });
    $scope.categories = categories.map(function (params) {
      return { name: params.name, ticked: false };
    });
    var categoriesData = {
      availableOptions: $scope.categories,
      selectedOption: app.categoriesName
    };
    angular.forEach($scope.categories, function (value1, key1) {
      for (i = 0; i < categoriesData.selectedOption.length; i++) {
        if (categoriesData.selectedOption[i] != null && categoriesData.selectedOption[i].name === value1.name) {
          value1.ticked = true;
        }
      }
    });
    $scope.devices = devices.map(function (params) {
      return { name: params.name, ticked: false };
    });
    var devicesData = {
      availableOptions: $scope.devices,
      selectedOption: app.devicesName
    };
    angular.forEach($scope.devices, function (value1, key1) {
      for (i = 0; i < devicesData.selectedOption.length; i++) {
        if (devicesData.selectedOption[i] != null && devicesData.selectedOption[i].name === value1.name) {
          value1.ticked = true;
        }
      }
    });
  };

  $scope.submitApplicationAction = function () {

    console.log($scope.appInfos);
    console.log($scope.filteredCategories);
    console.log($scope.filteredDevices);

    var data = {
      name: $scope.appInfos.name,
      description: $scope.appInfos.description,
      price: $scope.appInfos.price,
      logo: $scope.appInfos.logo,
      devices: ["57a7624c87b8da510e7452ad"],
      categories: ["577e89c37a108ec22897dab1"],
      url: "url bidon"
    };

    console.log(data);

    $scope.loading = true;

    $http.post(url + '/api/applications/', data)
      .success(function (result) {

        $scope.loading = false;
        console.log(result);

      })
      .error(function (result) {

        console.log(result);
        $scope.loading = false;
      });
  }
});