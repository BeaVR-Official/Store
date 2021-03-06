website.controller('devPropagandaController', function ($scope, $http, $route, AuthenticationService) {
    $scope.returnMessage = '';
    $scope.loading;

    $scope.devPropagandaAction = function () {
        var userId = AuthenticationService.getId();

        $scope.loading = true;
        var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));

        $http.get(url + '/api/users/' + userId + '/developer/enabled')
            .success(function (result) {
                $scope.feedbackData = {};
                returnMessageDiv.addClass("success-message");
                returnMessageDiv.removeClass("error-message");
                $scope.returnMessage = successMessage["DEV_PROPAGANDA"];
                $route.reload();
                $scope.loading = false;
            })
            .error(function (result) {
                returnMessageDiv.addClass("error-message");
                returnMessageDiv.removeClass("success-message");
                $scope.returnMessage = errorMessage["DEV_PROPAGANDA"];
                $scope.loading = false;
            });
    };
});