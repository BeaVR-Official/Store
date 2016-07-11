website.controller('applicationDetailController', function($scope, $rootScope, token, $http, $routeParams, $location, AuthenticationService, $cookies, appInfos, comments, USER_ROLES){
    
    $rootScope.menu = true;
    $rootScope.filterMenu = false;
    if (token !== undefined) {
      $rootScope.onlineMenu = true;
      $rootScope.offlineMenu = false;
      $rootScope.profilePicture = token.profilePicture;
      $rootScope.disconnect = AuthenticationService.disconnect;
      if (AuthenticationService.isAuthorized(USER_ROLES.Developer)) {
        $rootScope.devMenu = true;
        $rootScope.registerDev = false;
      } else {
        $rootScope.devMenu = false;
        $rootScope.registerDev = true;
      }
    } else {
      $rootScope.onlineMenu = false;
      $rootScope.offlineMenu = true;
      $rootScope.devMenu = false;
    }

    var limit = 3;

    $scope.paymentType = false;
    $scope.isConnected = !(AuthenticationService.isOffline());

    $scope.appInfos = appInfos.data.Applications;
    if ($scope.appInfos.price == "0")
      $scope.paymentType = true;

    $scope.myInterval = 10000;
    $scope.noWrapSlides = false;
    $scope.active = 0;
    $scope.appInfosScreenshots = [];
    $scope.appInfos.screenshots.split(",").forEach(function(data, i) {
      $scope.appInfosScreenshots.push({ image: data, id: i });
    });

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
