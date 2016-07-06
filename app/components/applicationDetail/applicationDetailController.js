website.controller('applicationDetailController', function($scope, $http, $routeParams, $location, AuthenticationService, $cookies){

    var limit = 3;

    $scope.paymentType = false;
    $scope.isConnected = !(AuthenticationService.isOffline());

    $scope.test = AuthenticationService.getToken();

    console.log("TOKEN INFOS ");
    console.log($scope.test);
    console.log("END TOKEN INFOS");

    
    $scope.checkPriceAction = function(){

      console.log("checkPriceAction");

      if ($scope.appInfos.price == "0"){

        console.log("L'application est free");

      }else {
        console.log("il faut payer");
        $location.path('/payment');
      }
    };

    $http.get(url + '/api/applications/' + $routeParams.idApplication).then(function(response){

      $scope.appInfos = response.data.Applications;

      console.log($scope.appInfos);

      if ($scope.appInfos.price == "0")
        $scope.paymentType = true;

        	$cookies.put('id', $scope.appInfos.id);

    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });


    $http.get(url + '/api/comments/' + $routeParams.idApplication + '/' + limit).then(function(response){
      $scope.comments = response.data.Comments;
    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });

    $scope.getRating = function(n) {
      if (n == null)
        return new Array(0);
      return new Array(n);
    };
});
