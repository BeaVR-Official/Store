website.controller('resetPasswordController', function($scope, $rootScope, $http) {

  $scope.resetPasswordData = {
      email : ''
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.menu = false;
    $rootScope.filterMenu = false;
    $rootScope.registerDev = false;

    

});
