website.controller('resetPasswordController', function($scope, $rootScope, $http) {

  $scope.resetPasswordData = {
      email : ''
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.menu = false;
    $rootScope.filterMenu = false;
    $rootScope.registerDev = false;

    $scope.resetPasswordAction = function(){

        var data = {
          email : $scope.resetPasswordData.email
        };

        $scope.loading = true;
        var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

        $http.post(url + '/api/reset-password', data)
        .success(function(result){

            $scope.connectionData = {};
            $scope.returnMessage = successMessage["MDPOUBLIE"];
            returnMessageDiv.addClass("success-message");
            returnMessageDiv.removeClass("error-message");
            $scope.loading = false;

        })
        .error(function(result){

            switch (result.error.status)
            {
            case 404:
                $scope.returnMessage = errorMessage["MDPOUBLIE_404"];
                break;
            default:
                $scope.returnMessage = errorMessage["MDPOUBLIE"];
            }
            $scope.loading = false;
            returnMessageDiv.addClass("error-message");
            returnMessageDiv.removeClass("success-message");

        });
      };

});
