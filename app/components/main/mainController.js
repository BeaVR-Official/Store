website.controller('mainController', function ($scope, $rootScope, $http, AuthenticationService, userData, appInfos) {
  $rootScope.menu = true;
  $rootScope.homePage = true;
  if (userData !== undefined) {
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
  } else {
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
    $rootScope.devMenu = false;
  }
  $scope.data = appInfos;

  $scope.data.sort(function (a, b) {
    ratingA = a.noteAvg;
    ratingB = b.noteAvg;

    if (ratingA == null)
      ratingA = 0;
    if (ratingB == null)
      ratingB = 0;

    return parseFloat(ratingB) - parseFloat(ratingA);
  });

  $scope.filteredApplications = angular.copy($scope.data);

  $scope.getNumberFullStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.ceil(n));
  };

  $scope.getNumberEmptyStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.trunc(n));
  }

  $scope.formatStringDevicesAndCategories = function (devicesArray) {

    var finalString = "";

    for (var i = 0; i < devicesArray.length; i++) {
      finalString += devicesArray[i].name;
      if (i != (devicesArray.length - 1))
        finalString += ", ";
    }

    return (finalString);
  }
  /*
  *
  * Filtering
  *
  */
  $scope.$on('filters', function (event, filteredDevices, filteredCategories, filterPrice) {
    $scope.filteredDevices = filteredDevices;
    $scope.filteredCategories = filteredCategories;
    $scope.filterPrice = filterPrice;
    $scope.applyFilters();
  })

  $scope.applyFilters = function () {
    if ($scope.filteredDevices.length == 0 && $scope.filteredCategories.length == 0) {
      $scope.filteredApplications = angular.copy($scope.data);
      for (var j = 0; j < $scope.filteredApplications.length; j++) {
        var compatibleDevices = 0;
        if ($scope.checkPriceFilter($scope.filteredApplications[j].price, $scope.filterPrice.priceFilter) == true)
          compatibleDevices++;
        if (compatibleDevices == 0) {
          $scope.filteredApplications.splice(j, 1);
          j--;
        }
      }
    }
    else {
      $scope.filteredApplications = angular.copy($scope.data);

      for (var j = 0; j < $scope.filteredApplications.length; j++) {
        var compatibleDevices = 0;
        for (var i = 0; i < $scope.filteredDevices.length; i++)
          for (var n = 0; n < $scope.filteredApplications[j].devicesName.length; n++)
            if ($scope.filteredApplications[j].devicesName[n]._id == $scope.filteredDevices[i]._id)
              if ($scope.checkPriceFilter($scope.filteredApplications[j].price, $scope.filterPrice.priceFilter) == true)
                compatibleDevices++;
        for (var k = 0; k < $scope.filteredCategories.length; k++) {
          for (var n = 0; n < $scope.filteredApplications[j].categoriesName.length; n++)
            if ($scope.filteredApplications[j].categoriesName[n]._id == $scope.filteredCategories[k]._id)
              if ($scope.checkPriceFilter($scope.filteredApplications[j].price, $scope.filterPrice.priceFilter) == true)
                compatibleDevices++;
        }
        if (compatibleDevices == 0) {
          $scope.filteredApplications.splice(j, 1);
          j--;
        }
      }
    }
  }

  $scope.checkPriceFilter = function (price, priceFilter) {
    if (priceFilter == -1)
      return (true);
    if (priceFilter == 0) {
      if (price == 0)
        return (true);
      return (false);
    }
    if (priceFilter > 0) {
      if (price > 0)
        return (true);
      return (false);
    }
    return (false);
  }

});

website.controller('navbarController', function ($scope, $location) {
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };
})

website.controller('carouselController', function ($scope) {
  $scope.myInterval = 3000;
  $scope.noWrapSlides = false;
  $scope.active = 0;
  $scope.slides = [
    {
      image: 'assets/img/carrousel/img1.jpg',
      id: 0
    },
    {
      image: 'assets/img/carrousel/img2.jpg',
      id: 1
    },
    {
      image: 'assets/img/carrousel/img3.png',
      id: 2
    }
  ];
})

website.controller('filterController', function ($scope, $rootScope, $http) {

  $http.get(url + '/api/devices').success(function (result) {
    $scope.devices = result.data.devices;
  }).error(function (result) {

  });

  $http.get(url + '/api/categories').success(function (result) {
    $scope.categories = result.data.categories;
  }).error(function (result) {

  });

  $scope.prices = [{ name: "Toutes les applications", priceFilter: -1, ticked: true }, { name: "Gratuites", priceFilter: 0 }, { name: "Payantes", priceFilter: 1 }];

  $scope.filteredDevices = [];
  $scope.filteredCategories = [];
  $scope.filteredPrice = [];

  $scope.localLangDevices = {
    selectAll: "",
    selectNone: "",
    reset: "",
    search: "Rechercher ...",
    nothingSelected: "Tous les matériels de Réalité Virtuelle"
  }

  $scope.localLangCategories = {
    selectAll: "",
    selectNone: "",
    reset: "",
    search: "Rechercher ...",
    nothingSelected: "Toutes les catégories"
  }

  $scope.localLangPrices = {
    selectAll: "",
    selectNone: "",
    reset: "",
    search: "Rechercher ...",
    nothingSelected: "Toutes les applications"
  }

  $scope.sendFilters = function () {
    $rootScope.$broadcast('filters', $scope.filteredDevices, $scope.filteredCategories, $scope.filteredPrice[0]);
  }

})