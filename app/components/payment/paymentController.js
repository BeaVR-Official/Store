website.controller('paymentController', function($scope, $http, $routeParams, AuthenticationService, $cookies){

  $scope.purchaseData = {
      purchaseDate : '',
      application : '',
      retailer : '',
      buyer : '',
      price : '',
      commission : '',
      originalPrice : ''
    };


    $http.get(url + '/api/applications/' + $routeParams.idApplication).then(function(response){

      $scope.appInfos = response.data.Applications;

      console.log($scope.appInfos);


      $cookies.put('id', $scope.appInfos.id);

    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });




    //console.log("Controller le payement d'une application");

    //$scope.paymentAction = function(){

      /*$http.get(url + '/api/payment/check').then(function(response){


      }, function(error){
        console.debug("Failure while payment");
      });

    };*/


});
