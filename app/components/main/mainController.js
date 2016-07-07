website.controller('mainController', function($scope, $rootScope, $http, AuthenticationService, token, USER_ROLES) {

  $rootScope.filterMenu = true;

  if (token !== undefined) {
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
  } else {
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
    $rootScope.devMenu = false;
  }

  $http.get(url + '/api/applications/state/1').then(function(response) {
    $scope.data = response.data.Applications;

    $scope.data.sort(function(a, b) {
      ratingA = a.avgRating;
      ratingB = b.avgRating;

      if (ratingA == null)
        ratingA = 0;
      if (ratingB == null)
        ratingB = 0;

      return parseFloat(ratingB) - parseFloat(ratingA);
    });

    $scope.filteredApplications = angular.copy($scope.data);

    }, function(error){
      console.debug("Failure while fetching applications' list.");
  });

  $scope.getRating = function(n) {
    if (n == null)
      return new Array(0);
     return new Array(n);
  };

  /*
  *
  * Filtering
  *
  */
  $scope.$on('filters', function(event, filteredDevices, filteredCategories) {
    $scope.filteredDevices = filteredDevices;
    $scope.filteredCategories = filteredCategories;

    $scope.applyFilters();
  })

  $scope.applyFilters = function() {
    if ($scope.filteredDevices.length == 0 && $scope.filteredCategories.length == 0) {
      $scope.filteredApplications = angular.copy($scope.data);
    }
    else {
      $scope.filteredApplications = angular.copy($scope.data);

      for (var j = 0; j < $scope.filteredApplications.length; j++) {
        var compatibleDevices = 0;
        for (var i = 0; i < $scope.filteredDevices.length; i++)
            if ($scope.filteredApplications[j].devicesNames.search($scope.filteredDevices[i].name) != -1)
              compatibleDevices++;
        for (var k = 0; k < $scope.filteredCategories.length; k++)
          if ($scope.filteredApplications[j].categoriesNames.search($scope.filteredCategories[k].name) != -1)
            compatibleDevices++;
        if (compatibleDevices == 0) {
          $scope.filteredApplications.splice(j, 1);
          j--;
        }
      }
    }
  }

});

website.controller('navbarController', function($scope, $location) {
      $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
})

website.controller('carouselController', function($scope) {
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

website.controller('filterController', function($scope, $rootScope, $http) {

  $http.get(url + '/api/devices').success(function(result) {
      if (result.Error == false) {
        $scope.devices = result.Devices;
        
      } 
  }).error(function(result) {

  });


  $http.get(url + '/api/categories').success(function(result) {
      if (result.Error == false) {
        $scope.categories = result.Categories;
      } 
  }).error(function(result) {

  });

  $scope.filteredDevices = [];
  $scope.filteredCategories = [];

  $scope.localLangDevices = {
    selectAll       : "",
    selectNone      : "",
    reset           : "",
    search          : "Rechercher ...",
    nothingSelected : "Tous les matériels"
  }

  $scope.localLangCategories = {
    selectAll       : "",
    selectNone      : "",
    reset           : "",
    search          : "Rechercher ...",
    nothingSelected : "Toutes les catégories"
  }

  $scope.sendFilters = function() {
    $rootScope.$broadcast('filters', $scope.filteredDevices, $scope.filteredCategories);
  }

})