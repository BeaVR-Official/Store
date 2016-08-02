website.controller('inscriptionController', function($scope, $rootScope, $http) {

    $scope.inscriptionData = {
      email : '',
      pseudo : '',
      password : '',
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.menu = false;
    $rootScope.filterMenu = false;
    $rootScope.registerDev = false;

    $scope.inscriptionAction = function(){

        var data = {
          email : $scope.inscriptionData.email,
          pseudo : $scope.inscriptionData.pseudo,
          password : $scope.inscriptionData.password
        };

        if (data.password && data.pseudo && data.pseudo.length >= 3 && data.pseudo.length <= 16 && data.password.length >= 8) {

          $scope.loading = true;
          var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

          $http.post(url + '/api/users', data)
              .success(function(result) {

                $scope.inscriptionData = {};
                $scope.returnMessage = successMessage["INSCRIPTION"];
                returnMessageDiv.addClass("success-message");
                $scope.loading = false;

              })
              .error(function(result) {

                  switch (result.error.status)
                  {
                    case 409:
                      $scope.returnMessage = errorMessage["INSCRIPTION_409"];
                      break;
                    default:
                      $scope.returnMessage = errorMessage["INSCRIPTION"];
                  }

                  $scope.loading = false;
                  returnMessageDiv.addClass("error-message");
          });
              
        }
    };
});
