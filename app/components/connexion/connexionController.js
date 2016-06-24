website.controller('connexionController', function($scope, $rootScope, $http, $window, $cookies) {

  if ($window.localStorage.getItem('token') === null && $cookies.get('token') === undefined) {
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
            $http.post(url + '/api/connection', data)
              .success(function(result) {

                  if (result.Error == false) {
                    if (data.checkbox) {
                      $window.localStorage.setItem('token', result.Token);
                    } else {
                      $cookies.put('token', result.Token);
                    }
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
              .error(function(result) {
                  $scope.returnMessage = errorMessage["CONNEXION"];
                  $scope.loading = false;
              });
          }
    };
  } else {
    $window.location.href = '#/404';
  }

  console.log("Controller Connexion");
});
