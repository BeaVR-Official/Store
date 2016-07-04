website.controller('applicationDetailController', function($scope, $http, $routeParams, $location){

    var limit = 3;

    $scope.paymentType = false;

    $http.get(url + '/api/applications/' + $routeParams.idApplications).then(function(response){

      $scope.appInfos = response.data.Applications;

      if ($scope.appInfos.price == "0")
        $scope.paymentType = true;

    }, function(error){
      console.debug("Failure while fetching applications' list.");
    });

    $http.get(url + '/api/comments/' + $routeParams.idApplications + '/' + limit).then(function(response){

      $scope.comments = response.data.Comments;

      console.log($scope.comments);

    }, function(error){
      console.debug("Failure while fetching comments' list.");
    });

    $scope.checkPriceAction = function(){

      console.log("checkPriceAction");

      if ($scope.appInfos.price == "0"){

        console.log("L'application est free");

        /* Faire l'appel d'api qui va add directement à la librairie */

      } else {
        console.log("il faut payer");

        $location.path('/payment');
      }
    };
});
