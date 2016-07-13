website.controller('paymentController', function($scope, $http, $routeParams, AuthenticationService, $cookies, $location){

  /* recuperer les infos dans les cookies */

  $scope.purchaseData = {
      application : $cookies.get('idApplication'),
      retailer : 1,
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
              //$location.path('/#');
          } else {
            console.log(result);
            alert("Un soucis est survenue veuillez contacter le support");
            //$location.path('/#')

          }
      })
      .error(function(result) {
  });

});
