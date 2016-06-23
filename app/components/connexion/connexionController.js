website.controller('connexionController', function($scope, $http, $window) {

  $scope.connectionData = {
      email : '',
      password : '',
    };

    $scope.returnMessage = '';
    $scope.loading;
    $scope.filterMenu = false;
    $scope.connexionAction = function(){

        var data = {
          email : $scope.connectionData.email,
          password : $scope.connectionData.password
        };

        if (data.password && data.password.length >= 8) {
          $scope.loading = true;
          $http.post(url + '/api/connection', data)
            .success(function(result){

                if (result.Error == false) {
                  $window.localStorage.token = result.Token;
                  $scope.connectionData = {};
                  $window.location.href = "#/"
                } else {
                  switch (result.Code)
                  {
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
            .error(function(result){
                $scope.returnMessage = errorMessage["CONNEXION"];
                $scope.loading = false;
            });
        }
      };

  console.log("Controller Connexion");
});
