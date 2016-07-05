website.config(['$routeProvider', 'USER_ROLES', function($routeProvider, USER_ROLES){

      $routeProvider
            .when('/', {
              templateUrl : 'app/components/main/main.html',
              controller  : 'mainController',
              resolve     : {
                    token : function(AuthenticationService, $window) {
                        if (AuthenticationService.isOffline() || AuthenticationService.isTokenFormatted()) {
                            return AuthenticationService.getToken();
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/inscription', {
                templateUrl : 'app/components/inscription/inscription.html',
                controller  : 'inscriptionController'
            })

            .when('/connexion', {
                templateUrl : 'app/components/connexion/connexion.html',
                controller  : 'connexionController',
                resolve     : {
                    token : function(AuthenticationService, $window) {
                        if (AuthenticationService.isOffline()) {
                            return ;
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/profile', {
                templateUrl : 'app/components/editProfile/editProfile.html',
                controller  : 'editProfileController',
                resolve     : {
                    token   : function(AuthenticationService, $window) {
                        if (AuthenticationService.isAuthorized([USER_ROLES.User, USER_ROLES.Developer, USER_ROLES.Administrator])) {
                            return AuthenticationService.getToken();
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/applications/details/:idApplication', {
                templateUrl : 'app/components/applicationDetail/applicationDetail.html',
                controller  : 'applicationDetailController'
            })

            .when('/applications/details/:idApplication/comments', {
                templateUrl : 'app/components/applicationComments/applicationComments.html',
                controller  : 'applicationCommentsController',
                resolve     : {
                    token : function(AuthenticationService, $window) {
                        if (AuthenticationService.isOffline() || AuthenticationService.isTokenFormatted()) {
                            return AuthenticationService.getToken();
                        }
                    },
                    appInfos : function(AuthenticationService, $window, $route) {
                        return AuthenticationService.getAppInfos($route.current.params.idApplication)
                    },
                    comments : function (AuthenticationService, $window, $route) {
                        return AuthenticationService.getComments($route.current.params.idApplication);
                    }
                }
            })

            .when('/library', {
                templateUrl : 'app/components/library/library.html',
                controller  : 'libraryController',
                resolve     : {
                    token   : function(AuthenticationService, $window) {
                        if (AuthenticationService.isAuthorized([USER_ROLES.User, USER_ROLES.Developer, USER_ROLES.Administrator])) {
                            return AuthenticationService.getToken();
                        }
                        $window.location.href = "#/404";
                    },
                    libraryInfos   : function(AuthenticationService, $window) {
                        if (AuthenticationService.isAuthorized([USER_ROLES.User, USER_ROLES.Developer, USER_ROLES.Administrator])) {
                            return AuthenticationService.getConnectedUserLibraryInfos();
                        }
                    }
                }
            })

            .when('/progression', {
                templateUrl : 'app/components/progression/progression.html',
                controller  : 'progressionController',
                resolve     : {
                    token   : function(AuthenticationService, $window) {
                        if (AuthenticationService.isAuthorized([USER_ROLES.User, USER_ROLES.Developer, USER_ROLES.Administrator])) {
                            return AuthenticationService.getToken();
                        }
                        $window.location.href = "#/404";
                    }
                }
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
}]);
