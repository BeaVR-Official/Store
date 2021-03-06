website.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/components/main/main.html',
            controller: 'mainController',
            resolve: {
                userData: function (AuthenticationService) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                },
                appInfos: function (AuthenticationService) {
                    return AuthenticationService.getAllAppsInfos();
                }
            }
        })

        .when('/profile', {
            templateUrl: 'app/components/editProfile/editProfile.html',
            controller: 'editProfileController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                    $window.location.href = "#/404";
                }
            }
        })

        .when('/applications/details/:idApplication', {
            templateUrl: 'app/components/applicationDetail/applicationDetail.html',
            controller: 'applicationDetailController',
            resolve: {
                userData: function (AuthenticationService) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                },
                appInfos: function (AuthenticationService, $route) {
                    return AuthenticationService.getAppInfos($route.current.params.idApplication);
                },
                comments: function (AuthenticationService, $route) {
                    return AuthenticationService.getCommentsLimit($route.current.params.idApplication, 3);
                },
                braintreeAuth: function (AuthenticationService, $route) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getBraintreeAuth($route.current.params.idApplication);
                    }
                }
            }
        })

        .when('/applications/details/:idApplication/comments', {
            templateUrl: 'app/components/applicationComments/applicationComments.html',
            controller: 'applicationCommentsController',
            resolve: {
                userData: function (AuthenticationService) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                },
                appInfos: function (AuthenticationService, $route) {
                    return AuthenticationService.getAppInfos($route.current.params.idApplication)
                },
                comments: function (AuthenticationService, $route) {
                    return AuthenticationService.getComments($route.current.params.idApplication);
                }
            }
        })

        .when('/library', {
            templateUrl: 'app/components/library/library.html',
            controller: 'libraryController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                    $window.location.href = "#/404";
                }
            }
        })

        .when('/progression', {
            templateUrl: 'app/components/progression/progression.html',
            controller: 'progressionController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                    $window.location.href = "#/404";
                }
            }
        })

        .when('/applications/submission', {
            templateUrl: 'app/components/applicationSubmission/applicationSubmission.html',
            controller: 'applicationSubmissionController',
            resolve: {
                userData: function (AuthenticationService) {
                    return AuthenticationService.getConnectedDeveloperInfos();
                },
                categories: function (AuthenticationService) {
                    return AuthenticationService.getCategories();
                },
                devices: function (AuthenticationService) {
                    return AuthenticationService.getDevices();
                }
            }
        })

        .when('/applications/submitted', {
            templateUrl: 'app/components/submittedApplications/submittedApplications.html',
            controller: 'submittedApplicationsController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    return AuthenticationService.getConnectedDeveloperInfos();
                },
                categories: function (AuthenticationService) {
                    return AuthenticationService.getCategories();
                },
                devices: function (AuthenticationService) {
                    return AuthenticationService.getDevices();
                },
                appInfos: function (AuthenticationService) {
                    return AuthenticationService.getSubmittedApps();
                }
            }
        })

        .when('/transactionHistory', {
            templateUrl: 'app/components/transactionHistory/transactionHistory.html',
            controller: 'transactionHistoryController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                    $window.location.href = "#/404";
                },
            }
        })

        .when('/user/:idUser', {
            templateUrl: 'app/components/userProfile/userProfile.html',
            controller: 'userProfileController',
            resolve: {
                userData: function (AuthenticationService, $window) {
                    if (!AuthenticationService.isOffline()) {
                        return AuthenticationService.getConnectedUserInfos();
                    }
                    $window.location.href = "#/404";
                },
                userInfos: function (AuthenticationService, $route) {
                    return AuthenticationService.getUserInfos($route.current.params.idUser);
                },
                appInfos: function (AuthenticationService, $route) {
                    return AuthenticationService.getUserSubmittedApps($route.current.params.idUser);
                }
            }
        })

        .when('/logSuccess', {
            templateUrl: 'app/components/logSuccess/logSuccess.html',
            controller: 'logSuccessController'
        })

        .when('/logError', {
            templateUrl: 'app/components/500/500.html',
            controller: '500Controller'
        })

        .when('/404', {
            templateUrl: 'app/components/404/404.html',
            controller: '404Controller'
        })

        .when('/500', {
            templateUrl: 'app/components/500/500.html',
            controller: '500Controller'
        })

        .otherwise({
            redirectTo: '/404'
        });
}]);
