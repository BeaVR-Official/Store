website.config(['$routeProvider', function($routeProvider){

      $routeProvider
            .when('/', {
              templateUrl : 'app/components/main/main.html',
              controller  : 'mainController',
              resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                    }
                }
            })

            .when('/profile', {
                templateUrl : 'app/components/editProfile/editProfile.html',
                controller  : 'editProfileController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/applications/details/:idApplication', {
                templateUrl : 'app/components/applicationDetail/applicationDetail.html',
                controller  : 'applicationDetailController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                    },
                    appInfos : function(AuthenticationService, $window, $route) {
                        var infos = AuthenticationService.getAppInfos($route.current.params.idApplication);
                        infos.success(function(response) {

                        }).error(function(response){
                            $window.location.href = "#/404";
                        });
                        return (infos);
                    },
                    comments : function (AuthenticationService, $window, $route) {
                        return AuthenticationService.getCommentsLimit($route.current.params.idApplication, 3);
                    }
                }
            })

            .when('/applications/details/:idApplication/comments', {
                templateUrl : 'app/components/applicationComments/applicationComments.html',
                controller  : 'applicationCommentsController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
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
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/progression', {
                templateUrl : 'app/components/progression/progression.html',
                controller  : 'progressionController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                        $window.location.href = "#/404";
                    }
                }
            })

            .when('/applications/submission', {
                templateUrl : 'app/components/applicationSubmission/applicationSubmission.html',
                controller  : 'applicationSubmissionController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                        $window.location.href = "#/404";
                    },
                    categories : function(AuthenticationService, $window) {
                        return AuthenticationService.getCategories();
                    },
                    devices : function(AuthenticationService, $window) {
                        return AuthenticationService.getDevices();
                    }
                }
            })

            .when('/transactionHistory', {
                templateUrl : 'app/components/transactionHistory/transactionHistory.html',
                controller  : 'transactionHistoryController',
                resolve     : {
                    userData : function(AuthenticationService, $window) {
                        if (!AuthenticationService.isOffline()) {
                            return AuthenticationService.getConnectedUserInfos();
                        }
                        $window.location.href = "#/404";
                    },
                }
            })

            .when('/404', {
                templateUrl : 'app/components/404/404.html',
                controller  : '404Controller'
            })

            .when('/payment', {
                templateUrl : 'app/components/payment/payment.html',
                controller  : 'paymentController'
            })

            .when('/addToLibrary', {
                templateUrl : 'app/components/payment/payment.html',
                controller  : 'paymentController'
            })

            .otherwise({
                redirectTo: '/404'
            });
}]);
