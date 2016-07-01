website.controller('mainController', function($scope, $rootScope, $http, $window, $cookies) {

  $rootScope.filterMenu = true;
  if ($window.localStorage.getItem('token') !== null) {
    $rootScope.accountHref = '#/profile'
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;

    $http.get(url + '/api/users/' + $window.localStorage.getItem('token')).then(function(response){

        $rootScope.profilePicture = response.data.Users.profilePicture;

    }, function(error){
        console.debug("Failure while fetching user infos.");
    });

    $rootScope.disconnect = function() {
      $window.localStorage.removeItem('token');
      $window.location.href = "#/"
      $window.location.reload();
    }
  } else if ($cookies.get('token') !== undefined) {
    $rootScope.accountHref = '#/profile'
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;

    $http.get(url + '/api/users/' + $cookies.get('token')).then(function(response){

        $rootScope.profilePicture = response.data.Users.profilePicture;

    }, function(error){
        console.debug("Failure while fetching user infos.");
    });

    $rootScope.disconnect = function() {
      $cookies.remove('token');
      $window.location.href = "#/"
      $window.location.reload();
    }
  } else {
    $rootScope.accountHref = '#/connexion'
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
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

    console.log($scope.data);


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
