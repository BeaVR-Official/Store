website.config(function($routeProvider){

      $routeProvider
            .when('/', {
              templateUrl : 'app/components/main/main.html',
              controller  : 'mainController'
            })

            .when('/inscription', {
                templateUrl : 'app/components/inscription/inscription.html',
                controller  : 'inscriptionController'
            })

            .when('/connexion', {
                templateUrl : 'app/components/connexion/connexion.html',
                controller  : 'connexionController'
            })

            .when('/profile', {
                templateUrl : 'app/components/editProfile/editProfile.html',
                controller  : 'editProfileController'
            })

            .when('/applications/details/:idApplications', {
                templateUrl : 'app/components/applicationDetail/applicationDetail.html',
                controller  : 'applicationDetailController',
            })

            .when('/library', {
                templateUrl : 'app/components/library/library.html',
                controller  : 'libraryController'
            })

            .when('/progression', {
                templateUrl : 'app/components/progression/progression.html',
                controller  : 'progressionController'
            })

            .when('/offline', {
                templateUrl : 'app/components/offline/offline.html',
                controller  : 'offlineController'
            })
            
            .when('/resetPassword', {
                templateUrl : 'app/components/resetPassword/resetPassword.html',
                controller  : 'resetPasswordController'
            })
            
            .when('/404', {
                templateUrl : 'app/components/404/404.html',
                controller  : '404Controller'
            })

            .when('/users/edit/:idUsers', {
                templateUrl : 'pages/usersEdit.html',
                controller  : 'usersEditController'
            })
            .otherwise({
                redirectTo: '/404'
            });
});
