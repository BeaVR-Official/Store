

website.controller('connexionController', function($scope, $http, $window) {

  $scope.connexion = {
      email : '',
      password : '',
    };

    $scope.connexionAction = function(){

        data = {
          email : $scope.connexion.email,
          password : CryptoJS.SHA1($scope.connexion.password).toString()
        };

        $http.post(url + '/api/connection', data).then(function(){

          /*
          * @TODO : check plus profondément la response pour être sur que la requête a bien été effectué
          */
          $window.location.href = '#/'
        }, function(error){

          alert("Echec lors de la connexion.");
          $scope.message = 'Une erreur est survenue durant la connexion';
        });
      };

  console.log("Controller Connexion");
});
