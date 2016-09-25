website.controller('applicationDetailController', function ($scope, $rootScope, $http, $routeParams, $location, AuthenticationService, $cookies, $sce, appInfos, comments, userData, braintreeAuth) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
  $rootScope.isOwned = false;
  if (userData !== undefined) {
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = userData.picture;
    $rootScope.pseudo = userData.pseudo;
    $rootScope.disconnect = AuthenticationService.disconnect;
    if (userData.rights.id == 2) {
      $rootScope.devMenu = true;
      $rootScope.registerDev = false;
    } else {
      $rootScope.devMenu = false;
      $rootScope.registerDev = true;
    }
    angular.forEach(userData.applications, function (value, key) {
      if (value._id === appInfos._id) {
        $rootScope.isOwned = true;
      }
    });
  } else {
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
    $rootScope.devMenu = false;
  }

  var limit = 3;
  $scope.auth = braintreeAuth;
  $scope.appInfos = appInfos;
  $scope.isFree = $scope.appInfos.price == "0";

  $scope.myInterval = 2500;
  $scope.noWrapSlides = false;
  $scope.active = 0;

  $scope.appInfosScreenshots = [];
  for (var i = 0; i < $scope.appInfos.screenshots.length; i++) {
    $scope.appInfosScreenshots.push({ image: $scope.appInfos.screenshots[i], id: i });
  }

  $rootScope.successMessageAlert = $sce.trustAsHtml(successMessage["BUY_APP"]);
  $rootScope.errorMessageAlert = $sce.trustAsHtml(errorMessage["BUY_APP"]);
  
  $scope.comments = comments;

  $scope.addToLibrary = function () {
    $http.get(url + '/api/applications/' + appInfos.id + '/free')
      .success(function (result) {
        $rootScope.isOwned = true;
        $rootScope.showSuccessAlert = true;
      })
      .error(function (result) {
        console.debug(result);
      })
  };

  $scope.getNumberFullStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.ceil(n));
  };

  $scope.getNumberEmptyStar = function (n) {
    if (n == null)
      return new Array(0);
    return new Array(Math.trunc(n));
  }
});