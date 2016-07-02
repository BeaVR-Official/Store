website.controller('progressionController', function($scope, $http, $window, $cookies) {
  if ($window.localStorage.getItem('store_token') !== null) {
      //create route and treat data
  } else if ($cookies.get('store_token') !== undefined) {
      //create route and treat data
  } else {
    $window.location.href = "#/404"
  }

  console.log("Controller Progression");
});
