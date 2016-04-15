
website.controller('inscriptionController', function($scope, $http) {

  console.log("Controller Inscription");

  $scope.inscription = {
      email : '',
      password : '',
    };

    $scope.inscriptionAction = function(){

        data = {
          email : $scope.inscription.email,
          password : CryptoJS.SHA1($scope.inscription.password).toString()
        };

        $http.post(url + '/api/inscription', data).then(function(){

          //faire une alerte
          //$scope.message = 'Connection réussi';
          alert("Inscription réussie");

        }, function(error){

          alert("l'inscription n'a pas réussie");
          $scope.message = 'Une erreur est survenue durant la connection';
        });
      };
});
