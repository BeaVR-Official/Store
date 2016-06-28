website.controller('inscriptionController', function($scope, $rootScope, $http) {

    $scope.inscriptionData = {
      email : '',
      pseudo : '',
      password : '',
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.filterMenu = false;
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = false;

    $scope.inscriptionAction = function(){

        var data = {
          email : $scope.inscriptionData.email,
          pseudo : $scope.inscriptionData.pseudo,
          password : $scope.inscriptionData.password
        };

        if (data.password && data.pseudo && data.pseudo.length >= 3 && data.pseudo.length <= 16 && data.password.length >= 8) {

          $scope.loading = true;

          $http.post(url + '/api/registration', data)
              .success(function(result) {

                  if (result.Error == false) {
                    $scope.inscriptionData = {};
                    $scope.returnMessage = successMessage["INSCRIPTION"];
                  } else {
                    switch (result.Code)
                    {
                      case 100:
                        $scope.returnMessage = errorMessage["INSCRIPTION_100"];
                        break;
                      case 101:
                        $scope.returnMessage = errorMessage["INSCRIPTION_101"];
                        break;
                      case 104:
                        $scope.returnMessage = errorMessage["INSCRIPTION_104"];
                        break;
                    }
                  }

                  $scope.loading = false;
    
              })
              .error(function(result) {
                  $scope.returnMessage = errorMessage["INSCRIPTION"];
                  $scope.loading = false;
          });
              
        }
    };
});
