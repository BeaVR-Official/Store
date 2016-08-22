website.controller('libraryController', function($scope, $rootScope, userData, AuthenticationService) {
    var userInfos = userData.data.data;
    $rootScope.menu = true;
    $rootScope.homePage = false;
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = userData.data.data.picture;
    $rootScope.pseudo = userData.data.data.pseudo;
    $rootScope.disconnect = AuthenticationService.disconnect;
    if (userInfos.rights.id == 2) {
      $rootScope.devMenu = true;
      $rootScope.registerDev = false;
    } else {
      $rootScope.devMenu = false;
      $rootScope.registerDev = true;
    }
    $scope.userAppsInfos = userData.data.data.applications;
});
