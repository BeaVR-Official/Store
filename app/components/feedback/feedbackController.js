 website.controller('feedbackController', function($scope, $http, $window, $cookies) {
 
     $scope.feedbackData = {
       idUser : this.idUser,
       object : '',
       description : '',
       recontact : false,
     };
 
     $scope.returnMessage = '';
     $scope.loading;
 
     $scope.feedbackAction = function(){

        if ($window.localStorage.getItem('token') !== null) {
            $http.get(url + '/api/users/' + $window.localStorage.getItem('token')).then(function(response) {
              $scope.userInfos = response.data.Users;
        }, function(error){
              console.debug("Failure while fecthing profile informations.");
          });
        } else if ($cookies.get('token') !== undefined) {
            $http.get(url + '/api/users/' + $cookies.get('token')).then(function(response) {
              $scope.userInfos = response.data.Users;
            }, function(error){
              console.debug("Failure while fecthing profile informations.");
          });
        }
 
       var data = {
         idUser : $scope.userInfos.id,
         object : $scope.feedbackData.object,
         description : $scope.feedbackData.description,
         recontact : $scope.feedbackData.recontact
       };
 
       $scope.loading = true;
       var returnMessageDiv = angular.element(document.querySelector('#returnMessage'));
 
       if (data.recontact == null)
         data.recontact = false;
 
       if (!data.object || data.object.length == 0)
       {
         $scope.returnMessage = errorMessage["FEEDBACK_OBJECT"];
         $scope.loading = false;
         returnMessageDiv.addClass("error-message");
       }
       else if (!data.description || data.description.length == 0)
       {
         $scope.returnMessage = errorMessage["FEEDBACK_DESCRIPTION"];    
         $scope.loading = false;
         returnMessageDiv.addClass("error-message"); 
       }
       else {
         $http.post(url + '/api/sendFeedback', data)
             .success(function(result) {
 
                 if (result.Error == false) {
                   $scope.feedbackData = {};
                   $scope.returnMessage = successMessage["FEEDBACK"];
                   returnMessageDiv.addClass("success-message"); 
                 } else {
                   switch (result.Code)
                   {
                     case 102:
                       $scope.returnMessage = errorMessage["FEEDBACK_102"];
                       break;
                   }
                   returnMessageDiv.addClass("error-message"); 
                 }
 
                 $scope.loading = false;
             })
             .error(function(result) {
                 $scope.returnMessage = errorMessage["FEEDBACK"];
                 $scope.loading = false;
                 returnMessageDiv.addClass("error-message"); 
         });
       }
 
     };
 });