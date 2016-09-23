website.controller('applicationDetailController', function ($scope, $rootScope, $http, $routeParams, $location, AuthenticationService, $cookies, appInfos, comments, userData) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
  $scope.isOwned = false;
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
        $scope.isOwned = true;
      }
    });
  } else {
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = true;
    $rootScope.devMenu = false;
  }

  var limit = 3;

  $scope.appInfos = appInfos;
  $scope.isFree = $scope.appInfos.price == "0";

  $scope.myInterval = 10000;
  $scope.noWrapSlides = false;
  $scope.active = 0;

  $scope.appInfosScreenshots = [];
  for (var i = 0; i < $scope.appInfos.screenshots.length; i++)
    $scope.appInfosScreenshots.push({ image: $scope.appInfos.screenshots[i], id: i });

  /*$cookies.put('idApplication', $scope.appInfos.id);
  $cookies.put('retailer', 999);
  $cookies.put('buyer', AuthenticationService.getToken().id);
  $cookies.put('price', $scope.appInfos.price);
  $cookies.put('commission', 0);
  $cookies.put('originalPrice', $scope.appInfos.price);*/

  $scope.comments = comments;

  $scope.addToLibrary = function () {

  }

  /*
  
  $scope.checkPriceAction = function(){
*/
  /*if ($scope.applicationIsOwned == false) {
    alert("Vous ne pouvez pas acheter deux fois la même application");
    return;
  }*/
  /*
        if ($scope.appInfos.price == "0"){
          $scope.purchaseData = {
              application : $routeParams.idApplication,
              retailer : 1,
              buyer : AuthenticationService.getToken().id,
              price : $scope.appInfos.price,
              commission : 0,
              originalPrice : $scope.appInfos.price
            };
  
          $http.post(url + '/api/applications/addToLibrary', $scope.purchaseData)
              .success(function(result) {
                  if (result.Error == false) {
                    alert("L'application a bien été ajoutée à votre bibliothèque");
                  } else {
                    console.log(result);
                    alert("Un soucis est survenue veuillez contacter le support");
                  }
              })
              .error(function(result) {
                console.log("ERROR DANS .error de ADDTOLIB");
                console.log(result);
          });
        }else {
          $location.path('/payment');
        }
      };*/

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