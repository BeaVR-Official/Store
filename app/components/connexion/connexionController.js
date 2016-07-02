website.controller('connexionController', function($scope, $rootScope, AuthenticationService) {
  $scope.connectionData = {
      email : '',
      password : '',
    };

    $scope.returnMessage = '';
    $scope.loading;
    $rootScope.filterMenu = false;
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = false;
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
            if (result.Error != false) {
              switch (result.Code) {
                  case 103:
                    $scope.returnMessage = errorMessage["CONNEXION_103"];
                    break;
                  case 200:
                    $scope.returnMessage = errorMessage["CONNEXION_200"];
                    break;
                }
            }
            $scope.loading = false;
          })
          .error(function(result) {
            $scope.returnMessage = errorMessage["CONNEXION"];
            $scope.loading = false;
          });
        }
  };

  console.log("Controller Connexion");
});
