website.controller('progressionController', function($scope, $rootScope, userData, AuthenticationService, USER_ROLES) {
    $rootScope.menu = true;
    $rootScope.filterMenu = false;
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = userData.data.data.picture;
    $rootScope.disconnect = AuthenticationService.disconnect;
    /*if (AuthenticationService.isAuthorized(USER_ROLES.Developer)) {
      $rootScope.devMenu = true;
      $rootScope.registerDev = false;
    } else {*/
      $rootScope.devMenu = false;
      $rootScope.registerDev = true;
    //}
});
