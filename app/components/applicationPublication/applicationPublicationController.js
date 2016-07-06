
website.controller('applicationPublicationController', function($scope, $http, $routeParams){

  console.log("Controller Publication d'une application");

  $scope.publicationData = {
    auteur : '',
    nom : '',
    description : '',
    prix : '',
    archive : '',
  };

  $scope.publicationAction = function(){

    var data = {
      auteur : $scope.publicationData.auteur,
      nom : $scope.publicationData.nom,
      description : $scope.publicationData.description,
      prix : $scope.publicationData.prix,
      archive : $scope.publicationData.archive,
    };

    console.log("DATA");
    console.log(data);
    console.log("END DATA");

    alert("L'upload a bien été effectué");
    /*$http.post(url + '/api/applications/uploadArchive', data)
        .success(function(result) {
            console.log("RESULT => ");
            console.log(result);
            console.log("END RESULT ");

            if (result.Error == false) {
              console.log("NORMALEMENT SUCCESS ");
            } else {
              console.log("SUCESS MAIS ERREUR QUAND MËME ");
            }

        })
        .error(function(result) {

        //  console.log("UPLOAD FAIL");
          //console.log(result);

        });*/

    }

    console.log("Controller Publication d'une application");
});
