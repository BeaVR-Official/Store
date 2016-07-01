website.controller('resetPasswordController', function($scope, $rootScope, $http) {

  $scope.resetPasswordData = {
      email : ''
    };

    $scope.returnMessage = '';
    $scope.loading;

    $rootScope.filterMenu = false;
    $rootScope.onlineMenu = false;
    $rootScope.offlineMenu = false;

    $scope.resetPasswordAction = function(){

        var data = {
          email : $scope.resetPasswordData.email
        };

        $scope.loading = true;
        var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

        $http.post(url + '/api/reset-password', data)
        .success(function(result){

            if (result.Error == false) {
                $scope.connectionData = {};
                $scope.returnMessage = successMessage["MDPOUBLIE"];
                returnMessageDiv.addClass("success-message");
            } else {
                switch (result.Code)
                {
                case 103:
                    $scope.returnMessage = errorMessage["MDPOUBLIE_103"];
                    break;
                case 202:
                    $scope.returnMessage = errorMessage["MDPOUBLIE_202"];
                    break;
                }
                returnMessageDiv.addClass("error-message");
            }
            $scope.loading = false;
        })
        .error(function(result){
            $scope.returnMessage = errorMessage["MDPOUBLIE"];
            $scope.loading = false;
            returnMessageDiv.addClass("error-message");
        });
      };

  console.log("Controller Reset Password");
});
