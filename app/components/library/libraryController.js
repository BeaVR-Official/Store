website.controller('libraryController', function($scope, $rootScope, userData, AuthenticationService, libraryInfos) {
    $scope.load = function() {
      $('.special.cards .image').dimmer({
        on: 'hover'
      });
    }
    $scope.load();
    var userInfos = userData.data.data;
    $rootScope.menu = true;
    $rootScope.filterMenu = false;
    $rootScope.onlineMenu = true;
    $rootScope.offlineMenu = false;
    $rootScope.profilePicture = userData.data.data.picture;
    $rootScope.disconnect = AuthenticationService.disconnect;
    if (userInfos.rights.id == 2) {
      $rootScope.devMenu = true;
      $rootScope.registerDev = false;
    } else {
      $rootScope.devMenu = false;
      $rootScope.registerDev = true;
    }
    $scope.userAppsInfos = libraryInfos.data.data.applications;
});
