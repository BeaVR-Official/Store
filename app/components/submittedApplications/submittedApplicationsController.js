website.controller('submittedApplicationsController', function ($scope, $rootScope, $http, userData, AuthenticationService, categories, devices, Upload, appInfos, $q) {
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

  var newLogo = false;
  var newScreenshots = false;
  var newArchive = false;
  var resetScreenshots = false;

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

  $scope.updateApp = function (app) {
    $scope.nbOwners = 0;
    newLogo = false;
    newScreenshots = false;
    newArchive = false;

    $http.get(url + '/api/applications/' + app.id + '/purchase')
      .success(function (result) {
        $scope.nbOwners = result.data.count;
      })
      .error(function (result) {
        $scope.nbOwners = 0;
      });
    $scope.categories = categories.map(function (params) {
      return { id: params._id, name: params.name, ticked: false };
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
      return { id: params._id, name: params.name, ticked: false };
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

  $scope.updateLogo = function () {
    newLogo = true;
  }

  $scope.updateArchive = function () {
    newArchive = true;
  }

  $scope.updateScreenshots = function () {
    newScreenshots = true;
  }

  $scope.resetScreenshots = function (application) {
    application.screenshots = undefined;
    application.screenshots = [];
    resetScreenshots = true;
  }

  $scope.submitApplicationAction = function (selectedApp, index) {
    $scope.loading = true;
    var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
    var promisesArray = [];
    var filteredCategories = $scope.categories.map(function (category) { if (category.ticked) { return category.id } });
    var filteredDevices = $scope.devices.map(function (device) { if (device.ticked) { return device.id } });
    var data = {
      name: selectedApp.name,
      description: selectedApp.description,
      categories: filteredCategories.filter(Boolean),
      devices: filteredDevices.filter(Boolean),
      price: selectedApp.price
    };

    if (newLogo) {
      var fd = new FormData();
      fd.append('screens', selectedApp.logo);
      var logoCall = $http.post(url + "/api/applications/upload/screens", fd, {
        withCredentials: false,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(function (response) {
        data.logo = response.data.screens[0];
      }).error(function (error) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = successMessage["EDIT_APP"];
        console.debug(error);
      });
      promisesArray.push(logoCall);
    }

    if (newScreenshots) {
      data.screenshots = [];
      var fd = new FormData();
      $.each(selectedApp.screenshots, function (i, file) {
        if (typeof file !== "string") {
          fd.append('screens', file);
        } else {
          data.screenshots.push(file);
        }
      });
      var screensCall = $http.post(url + "/api/applications/upload/screens", fd, {
        withCredentials: false,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(function (response) {
        for (i = 0; i < response.data.screens.length; i++) {
          data.screenshots.push(response.data.screens[i]);
        }
      }).error(function (error) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = successMessage["EDIT_APP"];
        console.debug(error);
      });
      promisesArray.push(screensCall);
    }

    if (resetScreenshots) {
      data.screenshots = [];
    }

    if (newArchive) {
      var fd = new FormData();
      fd.append('file', selectedApp.url);
      var fileCall = $http.post(url + "/api/applications/uploads/applications", fd, {
        withCredentials: false,
        headers: { 'Content-Type': undefined },
        transformRequest: angular.identity
      }).success(function (response) {
        data.url = response.data.source;
      }).error(function (error) {
        returnMessageDiv.removeClass("success-message");
        returnMessageDiv.addClass("error-message");
        $scope.returnMessage = successMessage["EDIT_APP"];
        console.debug(error);
      });
      promisesArray.push(fileCall);
    }

    // called once the previous requests are done
    $q.all(promisesArray).then(function () {
      $http.put(url + '/api/applications/' + selectedApp._id, data)
        .success(function (result) {
          $scope.loading = false;
          returnMessageDiv.removeClass("error-message");
          returnMessageDiv.addClass("success-message");
          $scope.returnMessage = successMessage["EDIT_APP"];
        })
        .error(function (result) {
          $scope.loading = false;
          returnMessageDiv.removeClass("success-message");
          returnMessageDiv.addClass("error-message");
          $scope.returnMessage = errorMessage["EDIT_APP"];
          console.debug(result);
        });
    });
  }
});