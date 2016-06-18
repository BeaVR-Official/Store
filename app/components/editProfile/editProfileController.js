website.controller('editProfileController', function($scope, $http, $window) {

    $http.get(url + '/api/users/' + $window.localStorage.token).then(function(response){
      $scope.userInfos = response.data.Users;

    }, function(error){
      console.debug("failed dans la requête pour fetch la liste des applications");
    });

    console.log("Controller Edit Profile");
});