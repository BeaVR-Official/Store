var url = "http://beavr.fr:3000";

var website = angular.module('website', ['ngRoute', 'ngCookies', 'ngMessages', 'angular-jwt', 'isteven-multi-select', 'ngFileUpload', 'angular-loading-bar', 'counter', 'ui.bootstrap']);

website.factory('AuthenticationService', function ($http, $window, $cookies, jwtHelper) {
	var authService = {};

	authService.login = function (data) {
		return $http.post(url + '/api/connection', data)
			.success(function (result) {
				if (data.checkbox) {
					$window.localStorage.setItem('store_token', result.data.token);
					$window.localStorage.setItem('store_id', result.data.userId);
				} else {
					$cookies.put('store_token', result.data.token);
					$cookies.put('store_id', result.data.userId);
				}
				$window.location.href = "#/"
				$window.location.reload();
			});
	}

	authService.disconnect = function () {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null && $window.localStorage.getItem('store_id') !== null) {
				$window.localStorage.removeItem('store_token');
				$window.localStorage.removeItem('store_id')
				$window.location.href = "#/"
				$window.location.reload();
			} else if ($cookies.get('store_token') !== undefined && $cookies.get('store_id') !== undefined) {
				$cookies.remove('store_token');
				$cookies.remove('store_id');
				$window.location.href = "#/"
				$window.location.reload();
			}
		}
	}

	authService.isOffline = function () {
		return $window.localStorage.getItem('store_token') === null && $window.localStorage.getItem('store_id') === null &&
			$cookies.get('store_token') === undefined && $cookies.get('store_id') === undefined;
	}

	authService.isAuthenticated = function () {
		return $window.localStorage.getItem('store_token') !== null && $window.localStorage.getItem('store_id') !== null ||
			$cookies.get('store_token') !== undefined && $cookies.get('store_id') !== undefined;
	}

	authService.getToken = function () {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				return $window.localStorage.getItem('store_token');
			} else if ($cookies.get('store_token') !== undefined) {
				return $cookies.get('store_token');
			}
		}
	}

	authService.getId = function () {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_id') !== null) {
				return $window.localStorage.getItem('store_id');
			} else if ($cookies.get('store_id') !== undefined) {
				return $cookies.get('store_id');
			}
		}
	}

	authService.getConnectedUserInfos = function () {
		return $http.get(url + '/api/users/' + authService.getId())
			.then(function (response) {
				return response.data.data;
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	authService.getConnectedDeveloperInfos = function () {
		if (authService.getId() === undefined) {
			$window.location.href = "#/404";
			return;
		}
		return authService.getConnectedUserInfos()
			.then(function (response) {
				if (response.rights.id !== 2) {
					$window.location.href = "#/404";
				} else {
					return response;
				}
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	authService.getComments = function (idApp) {
		return $http.get(url + '/api/applications/' + idApp + '/comments?order=DESC')
			.then(function (response) {
				return response.data.data.comments;
			}, function (error) {
				$window.location.href = "#/404";
			});
	}

	authService.getCommentsLimit = function (idApp, limit) {
		return $http.get(url + '/api/applications/' + idApp + '/comments?limit=' + limit + "&order=DESC")
			.then(function (response) {
				return response.data.data.comments;
			}, function (error) {
				$window.location.href = "#/404";
			});
	}

	authService.getAllAppsInfos = function () {
		return $http.get(url + '/api/applications')
			.then(function (response) {
				return response.data.data.application;
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	authService.getAppInfos = function (idApp) {
		return $http.get(url + '/api/applications/' + idApp)
			.then(function (response) {
				return response.data.data.application;
			}, function (error) {
				$window.location.href = "#/404";
			});
	}

	authService.getSubmittedApps = function () {
		if (authService.getId() === undefined) {
			$window.location.href = "#/404";
			return;
		}
		return $http.get(url + '/api/applications?author=' + authService.getId())
			.then(function (response) {
				return response.data.data.application;
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	authService.getCategories = function () {
		return $http.get(url + '/api/categories/')
			.then(function (response) {
				return response.data.data.categories;
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	authService.getDevices = function () {
		return $http.get(url + '/api/devices/')
			.then(function (response) {
				return response.data.data.devices;
			}, function (error) {
				$window.location.href = "#/500";
			});
	}

	return authService;
});

website.config(function Config($httpProvider, jwtInterceptorProvider) {
	jwtInterceptorProvider.tokenGetter = ['config', 'AuthenticationService', function (config, AuthenticationService) {
		return AuthenticationService.getToken();
	}];
	$httpProvider.interceptors.push('jwtInterceptor');
});

var errorMessage = {
	"INSCRIPTION": "Une erreur est survenue pendant l'inscription. Réessayez dans quelques instants.",
	"INSCRIPTION_409": "Cet utilisateur existe déjà.",
	"CONNEXION": "Une erreur est survenue pendant la connexion. Réessayez dans quelques instants.",
	"CONNEXION_401": "Cet utilisateur n'existe pas ou le mot de passe renseigné est incorrect.",
	"MDPOUBLIE_404": "Aucun utilisateur n'est inscrit sous cette adresse.",
	"MDPOUBLIE": "Une erreur est survenue pendant la réinitialisation du mot de passe. Réessayez dans quelques instants.",
	"FEEDBACK_400": "Les informations indiquées sont incorrectes ou incomplètes.",
	"FEEDBACK_403": "Vous ne possédez pas les droits nécessaires à l'envoi de message. Veuillez contacter un administrateur.",
	"FEEDBACK": "Une erreur est survenue lors de l'envoi de votre message. Réessayez dans quelques instants.",
	"EDIT_COMMENT": "Votre commentaire n'a pas pu être modifié. Réessayez dans quelques instants.",
	"EDIT_COMMENT_102": "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"ADD_COMMENT": "Votre commentaire n'a pas pu être ajouté. Réessayez dans quelques instants.",
	"ADD_COMMENT_102": "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"EDIT_HTML": "Modifier le code de la page pour accéder aux éléments cachés est mal.",
	"COMMENT_TITLE": "Le titre de votre commentaire ne peut pas être vide.",
	"COMMENT_COMMENT": "Le contenu de votre commentaire ne peut pas être vide.",
	"EDIT_PROFILE_PASSWORD": "Les deux mots de passe ne sont pas identiques.",
	"EDIT_PROFILE_PROFILE_PICTURE": "Une erreur est survenue lors du téléversement de votre photo de profil. Réessayez dans quelques instants.",
	"EDIT_PROFILE_403": "Vous ne possédez pas les droits nécessaires à la modification de ce compte. Veuillez contacter un administrateur.",
	"EDIT_PROFILE_404": "Les informations indiquées sont incorrectes ou incomplètes.",
	"EDIT_PROFILE_409": "Cette adresse mail est déjà utilisée. Veuillez réessayer avec une adresse différente.",
	"EDIT_PROFILE": "Une erreur est survenue lors de la modification du compte. Réessayez dans quelques instants.",
	"POST_APP": "Une erreur est survenue lors de l'envoi de l'application. Réessayez dans quelques instants.",
	"EDIT_APP": "Une erreur est survenue lors de la modification de l'application. Réessayez dans quelques instants."
};

var successMessage = {
	"INSCRIPTION": "Inscription effectuée avec succès.",
	"MDPOUBLIE": "Un nouveau mot de passe va vous être envoyé par mail d'ici quelques minutes.",
	"FEEDBACK": "Votre message nous a correctement été transmis. L'équipe BeaVR vous remercie !",
	"EDIT_COMMENT": "Votre commentaire a correctement été modifié.",
	"ADD_COMMENT": "Votre commentaire a correctement été ajouté.",
	"EDIT_PROFILE": "Vos informations ont été modifiées.",
	"POST_APP": "L'application a bien été envoyée et est en cours de validation par nos équipes.",
	"EDIT_APP": "Vos modifications ont été envoyées à notre équipe et sont en cours de validation."
};

website.filter('iif', function () {
	return function (input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
	};
});

website.directive('tooltip', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                $(element).tooltip('show');
            }, function () {
                $(element).tooltip('hide');
            });
        }
    };
});

website.directive('dimmer', function () {
	return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).hover(function () {
                $(element).dimmer('show');
			}, function () {
                $(element).dimmer('hide');
			});
		}
	};
});

website.directive('progress', function () {
	return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            $(element).progress({
				percent: 50
			});
		}
	};
});

website.directive('paypalButton', function () {
	return {
        restrict: 'A',
        link: function (scope, element, attrs) {
			var paypalButton = element[0].children[1];
			// Create a Client component
			braintree.client.create({
				authorization: 'eyJ2ZXJzaW9uIjoyLCJhdXRob3JpemF0aW9uRmluZ2VycHJpbnQiOiJhNDY3NjI3MjhiOWFlZjM3NmYyMWUxNGNiYzJlYjc3OGY3Y2FhZmZkZWQwMTAyNzAxOWJhZTE1YTc4OWM3MTU3fGNyZWF0ZWRfYXQ9MjAxNi0wOS0yM1QxNToxMjo1MC4xNzY5MjQ3NjMrMDAwMFx1MDAyNm1lcmNoYW50X2lkPTM0OHBrOWNnZjNiZ3l3MmJcdTAwMjZwdWJsaWNfa2V5PTJuMjQ3ZHY4OWJxOXZtcHIiLCJjb25maWdVcmwiOiJodHRwczovL2FwaS5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tOjQ0My9tZXJjaGFudHMvMzQ4cGs5Y2dmM2JneXcyYi9jbGllbnRfYXBpL3YxL2NvbmZpZ3VyYXRpb24iLCJjaGFsbGVuZ2VzIjpbXSwiZW52aXJvbm1lbnQiOiJzYW5kYm94IiwiY2xpZW50QXBpVXJsIjoiaHR0cHM6Ly9hcGkuc2FuZGJveC5icmFpbnRyZWVnYXRld2F5LmNvbTo0NDMvbWVyY2hhbnRzLzM0OHBrOWNnZjNiZ3l3MmIvY2xpZW50X2FwaSIsImFzc2V0c1VybCI6Imh0dHBzOi8vYXNzZXRzLmJyYWludHJlZWdhdGV3YXkuY29tIiwiYXV0aFVybCI6Imh0dHBzOi8vYXV0aC52ZW5tby5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tIiwiYW5hbHl0aWNzIjp7InVybCI6Imh0dHBzOi8vY2xpZW50LWFuYWx5dGljcy5zYW5kYm94LmJyYWludHJlZWdhdGV3YXkuY29tLzM0OHBrOWNnZjNiZ3l3MmIifSwidGhyZWVEU2VjdXJlRW5hYmxlZCI6dHJ1ZSwicGF5cGFsRW5hYmxlZCI6dHJ1ZSwicGF5cGFsIjp7ImRpc3BsYXlOYW1lIjoiQWNtZSBXaWRnZXRzLCBMdGQuIChTYW5kYm94KSIsImNsaWVudElkIjpudWxsLCJwcml2YWN5VXJsIjoiaHR0cDovL2V4YW1wbGUuY29tL3BwIiwidXNlckFncmVlbWVudFVybCI6Imh0dHA6Ly9leGFtcGxlLmNvbS90b3MiLCJiYXNlVXJsIjoiaHR0cHM6Ly9hc3NldHMuYnJhaW50cmVlZ2F0ZXdheS5jb20iLCJhc3NldHNVcmwiOiJodHRwczovL2NoZWNrb3V0LnBheXBhbC5jb20iLCJkaXJlY3RCYXNlVXJsIjpudWxsLCJhbGxvd0h0dHAiOnRydWUsImVudmlyb25tZW50Tm9OZXR3b3JrIjp0cnVlLCJlbnZpcm9ubWVudCI6Im9mZmxpbmUiLCJ1bnZldHRlZE1lcmNoYW50IjpmYWxzZSwiYnJhaW50cmVlQ2xpZW50SWQiOiJtYXN0ZXJjbGllbnQzIiwiYmlsbGluZ0FncmVlbWVudHNFbmFibGVkIjp0cnVlLCJtZXJjaGFudEFjY291bnRJZCI6ImFjbWV3aWRnZXRzbHRkc2FuZGJveCIsImN1cnJlbmN5SXNvQ29kZSI6IlVTRCJ9LCJjb2luYmFzZUVuYWJsZWQiOmZhbHNlLCJtZXJjaGFudElkIjoiMzQ4cGs5Y2dmM2JneXcyYiIsInZlbm1vIjoib2ZmIn0'
			}, function (clientErr, clientInstance) {
				// Create PayPal component
				braintree.paypal.create({
					client: clientInstance
				}, function (err, paypalInstance) {
					paypalButton.addEventListener('click', function () {
						// Tokenize here!
						paypalInstance.tokenize({
							flow: 'checkout', // Required
							amount: scope.appInfos.price, // Required
							currency: 'EUR', // Required
							locale: 'fr_FR',
							enableShippingAddress: false,
							shippingAddressEditable: true
						}, function (err, tokenizationPayload) {
							// Tokenization complete
							// Send tokenizationPayload.nonce to server
						});
					});
				});
			});
		}
	};
});