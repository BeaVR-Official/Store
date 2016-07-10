website.controller('applicationDetailController', function($scope, $http, $routeParams, $location, AuthenticationService, $cookies, appInfos, comments){

    var limit = 3;

    $scope.paymentType = false;
    $scope.isConnected = !(AuthenticationService.isOffline());

    $scope.appInfos = appInfos.data.Applications;
    if ($scope.appInfos.price == "0")
      $scope.paymentType = true;
    $cookies.put('id', $scope.appInfos.id);

    $scope.comments = comments.data.Comments;

    $scope.test = AuthenticationService.getToken();

    $scope.checkPriceAction = function(){

      console.log("checkPriceAction");

      if ($scope.appInfos.price == "0"){

        console.log("L'application est free");

      }else {
        console.log("il faut payer");
        $location.path('/payment');
      }
    };

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
