
website.controller('inscriptionController', function($scope, $http) {

    $scope.inscriptionData = {
      email : '',
      pseudo : '',
      password : '',
    };

    $scope.inscriptionAction = function(){

        var data = {
          email : $scope.inscriptionData.email,
          pseudo : $scope.inscriptionData.pseudo,
          password : $scope.inscriptionData.password
        };
        var returnMessage;

        if (data.pseudo.length >= 3 && data.pseudo.length <= 16 && data.password.length >= 8) {

          $http.post(url + '/api/registration', data)
              .success(function(result) {

                  if (result.Error == false) {
                    $scope.inscriptionData = {};
                    returnMessage = successMessage["INSCRIPTION"];
                  }
                  else {
                    switch (result.Code)
                    {
                      case 100:
                        returnMessage = errorMessage["INSCRIPTION_100"];
                      case 101:
                        returnMessage = errorMessage["INSCRIPTION_101"];
                      case 104:
                        returnMessage = errorMessage["INSCRIPTION_104"];
                    }
                  }

              })
              .error(function(result) {
                  returnMessage = errorMessage["INSCRIPTION"];
          });

          console.log(returnMessage);
        }
    };
});
