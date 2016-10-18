website.controller('logSuccessController', function ($scope, AuthenticationService, $http, $routeParams) {

AuthenticationService.socialNetworkLogin($routeParams);

})