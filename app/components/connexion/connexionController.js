website.controller('connexionController', function($scope, $rootScope, AuthenticationService) {
  $scope.connectionData = {
      email : '',
      password : '',
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.menu = false;
    $rootScope.filterMenu = false;
    $rootScope.registerDev = false;

    $scope.connexionAction = function(){

        var data = {
          email : $scope.connectionData.email,
          password : $scope.connectionData.password,
          checkbox : $scope.connectionData.checkbox
        };

        if (data.password && data.password.length >= 8) {
          $scope.loading = true;
          AuthenticationService.login(data)
          .success(function(result) {

            $scope.loading = false;

          })
          .error(function(result) {

            switch (result.error.status)
            {
              case 401:
                $scope.returnMessage = errorMessage["CONNEXION_401"];
                break;
              default:
                $scope.returnMessage = errorMessage["CONNEXION"];
                break;
            }

            $scope.loading = false;

          });
        }
  };
});
