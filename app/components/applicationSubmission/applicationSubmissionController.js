website.controller('applicationSubmissionController', function ($scope, $rootScope, $http, userData, AuthenticationService, categories, devices, $q) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
  $rootScope.onlineMenu = true;
  $rootScope.offlineMenu = false;
  $rootScope.profilePicture = userData.picture;
  $rootScope.pseudo = userData.pseudo;
  $rootScope.disconnect = AuthenticationService.disconnect;
  $rootScope.devMenu = true;
  $rootScope.registerDev = false;

  $scope.categories = categories;
  $scope.devices = devices;

  $scope.filteredCategories = [];
  $scope.filteredDevices = [];

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
    url: null
  };

  $scope.submitApplicationAction = function () {
    $scope.loading = true;
    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
    var promisesArray = [];
    var data = {
      name: $scope.appInfos.name,
      description: $scope.appInfos.description,
      categories: $scope.filteredCategories.map(function (category) { return category._id }),
      devices: $scope.filteredDevices.map(function (devices) { return devices._id }),
      price: $scope.appInfos.price.toString(),
    };

    var fd = new FormData();
    fd.append('screens', $scope.appInfos.logo);
    var logoCall = $http.post(url + "/api/applications/upload/screens", fd, {
      withCredentials: false,
      headers: { 'Content-Type': undefined },
      transformRequest: angular.identity
    }).success(function (response) {
      data.logo = response.data.screens[0];
    }).error(function (error) {
      returnMessageDiv.removeClass("success-message");
      returnMessageDiv.addClass("error-message");
      $scope.returnMessage = successMessage["POST_APP"];
      console.debug(error);
    });
    promisesArray.push(logoCall);

    if ($scope.appInfos.screenshots !== null) {
      var fd = new FormData();
      $.each($scope.appInfos.screenshots, function (i, file) {
        fd.append('screens', file);
      });
      var screensCall = $http.post(url + "/api/applications/upload/screens", fd, {
        withCredentials: false,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(function (response) {
        data.screenshots = response.data.screens;
      }).error(function (error) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = successMessage["POST_APP"];
        console.debug(error);
      });
      promisesArray.push(screensCall);
    }

    var fd = new FormData();
    fd.append('file', $scope.appInfos.url);
    var fileCall = $http.post(url + "/api/applications/uploads/applications", fd, {
      withCredentials: false,
      headers: { 'Content-Type': undefined },
      transformRequest: angular.identity
    }).success(function (response) {
      data.url = response.data.source;
    }).error(function (error) {
      returnMessageDiv.removeClass("success-message");
      returnMessageDiv.addClass("error-message");
      $scope.returnMessage = successMessage["POST_APP"];
      console.debug(error);
    });
    promisesArray.push(fileCall);

    // called once the previous requests are done
    if ($scope.appInfos.screenshots !== null) {
      $q.all(promisesArray).then(function () {
        $http.post(url + '/api/applications/', data)
          .success(function (result) {
            $scope.loading = false;
            returnMessageDiv.removeClass("error-message");
            returnMessageDiv.addClass("success-message");
            $scope.returnMessage = successMessage["POST_APP"];
          })
          .error(function (result) {
            $scope.loading = false;
            returnMessageDiv.removeClass("success-message");
            returnMessageDiv.addClass("error-message");
            $scope.returnMessage = errorMessage["POST_APP"];
            console.debug(result);
          });
      });
    }
  }
});
