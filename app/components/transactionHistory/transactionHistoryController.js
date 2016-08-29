website.controller('transactionHistoryController', function ($scope, $rootScope, userData, AuthenticationService) {
  $rootScope.menu = true;
  $rootScope.homePage = false;
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

  // Here get the history

});