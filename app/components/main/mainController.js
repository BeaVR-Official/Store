
website.controller('mainController', function($scope, $http) {

  console.log("Controller Main");

  $scope.leftMenu = true;
  $scope.rightMenu = true;
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