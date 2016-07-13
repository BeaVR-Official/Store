website.controller('paymentController', function($scope, $http, $routeParams, AuthenticationService, $cookies){

  /* recuperer les infos dans les cookies */

  $scope.purchaseData = {
      application : $cookies.get('idApplication'),
      retailer : $cookies.get('retailer'),
      buyer : $cookies.get('buyer'),
      price : $cookies.get('price'),
      commission : $cookies.get('commission'),
      originalPrice : $cookies.get('originalPrice')
    };


  console.log("Controller de paiement");
  console.log($scope.purchaseData);

  $http.post(url + '/api/applications/addToLibrary', $scope.purchaseData)
      .success(function(result) {
          if (result.Error == false) {
            alert("l'achat c'est bien passé");
              $location.path('/#');
          } else {
            $location.path('/#')
            alert("Un soucis est survenue veuillez contacter le support");
          }
      })
      .error(function(result) {
  });

});
