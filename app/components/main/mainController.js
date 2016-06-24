
website.controller('mainController', function($scope, $rootScope, $http, $window) {

  console.log("Controller Main");

  $rootScope.filterMenu = true;
  if ($window.localStorage.getItem('token') !== null) {
    $rootScope.accountHref = '#/profile'
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;

    $http.get(url + '/api/users/' + $window.localStorage.getItem('token')).then(function(response){

        $rootScope.profilePicture = response.data.Users.profilePicture;

    }, function(error){
        console.debug("failed dans la requête pour fetch la liste des applications");
    });

    $rootScope.disconnect = function() {
      $window.localStorage.removeItem('token');
      $window.location.href = "#/"
      $window.location.reload();
    }
  } else {
    $rootScope.accountHref = '#/connexion'
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
  }
  $http.get(url + '/api/applications').then(function(response){

  $scope.data = response.data.Applications;
  }, function(error){
    console.debug("Failure while fetching devices' list.");
  });
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
