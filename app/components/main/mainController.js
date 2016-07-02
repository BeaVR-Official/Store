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

    }, function(error){
      console.debug("Failure while fetching applications' list.");
  });

  $scope.getRating = function(n) {
    if (n == null)
      return new Array(0);
     return new Array(n);
  };

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

  console.log("Controller Main");
})
