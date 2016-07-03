website.controller('libraryController', function($scope, $rootScope, token, AuthenticationService, USER_ROLES, libraryInfos) {
    $rootScope.filterMenu = false;
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
    $scope.userAppsInfos = libraryInfos.data.Users;
});
