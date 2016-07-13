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


    $http.post(url + '/api/applications/addToLibrary', $scope.purchaseData)
        .success(function(result) {
            if (result.Error == false) {
                $(window).load(function(){
                    $scope.returnText = "L'achat de s'est correctement déroulé.";
                });
                //$location.path('/#');
            } else {
              console.log(result);
              $scope.returnText = "Une erreur est survenue lors de l'achat. Veuillez contacter le support.";
              //$location.path('/#')

            }
        })
        .error(function(result) {
    });

    $scope.backStore = function() {
      $('#paymentModal').modal('toggle');
      $window.location.href = "#/";
    }
});
