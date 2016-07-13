website.controller('paymentController', function($scope, $rootScope, $http, $window, $routeParams, AuthenticationService, $cookies, $location){
  $rootScope.menu = true;
  $rootScope.filterMenu = false;
  $rootScope.onlineMenu = false;
  $rootScope.offlineMenu = false;
  $rootScope.devMenu = false;
  $rootScope.registerDev = false;

  $scope.purchaseData = {
      application : $cookies.get('idApplication'),
      retailer : 1,
      buyer : $cookies.get('buyer'),
      price : $cookies.get('price'),
      commission : $cookies.get('commission'),
      originalPrice : $cookies.get('originalPrice')
    };            
    $scope.returnText = "Une erreur est survenue lors de l'achat. Veuillez contacter le support.";
    console.log($scope.purchaseData);
    $http.post(url + '/api/applications/addToLibrary', $scope.purchaseData)
        .success(function(result) {
              console.log(result);
            if (result.Error == false) {
                $scope.returnText = "L'achat de s'est correctement déroulé.";
                //$location.path('/#');
            } else {
              console.log(result);
              $scope.returnText = "Une erreur est survenue lors de l'achat. Veuillez contacter le support.";
              //$location.path('/#')

            }
        })
        .error(function(result) {
              console.log(result);
    });

    $scope.backStore = function() {
      $('#paymentModal').modal('toggle');
      $window.location.href = "#/";
    }
});
