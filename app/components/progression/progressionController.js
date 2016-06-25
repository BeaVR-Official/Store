website.controller('progressionController', function($scope, $http, $window, $cookies) {
  if ($window.localStorage.getItem('token') !== null) {
      //create route and treat data
  } else if ($cookies.get('token') !== undefined) {
      //create route and treat data
  } else {
    $window.location.href = "#/404"
  }

  console.log("Controller Progression");
});
