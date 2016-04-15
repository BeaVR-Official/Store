
website.controller('libraryController', function($scope, $http, $routeParams) {

  console.log("Controller Library");

  /**
  * @TODO: envoyer en paramètre l'id de l'utilisateurs stocké dans les cookies
  **/

  $http.get(url + '/api/applications/1').then(function(response){

    $scope.applicationsList = response.data.Applications;

    console.log(response);

  }, function(error){
    console.debug("failed dans la requête pour fetch la liste des devices");
  });

});
