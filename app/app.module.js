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

	authService.socialNetworkLogin = function(data, socialNetwork) {
		return $http.get(url + '/api/auth/' + socialNetwork, data)
			.success(function(result) {
				console.log("ok");
				console.log(result);
				if (data.checkbox) {
					$window.localStore.setItem('store_token', result.data.token);
				} else {
					$cookies.put('store_token', result.data.token);
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

	authService.getUserInfos = function (idUser) {
		return $http.get(url + '/api/users/' + idUser)
			.then(function (response) {
				return response.data.data;
			}, function (error) {
				$window.location.href = "#/404";
			});
	}

	authService.getUserSubmittedApps = function (idUser) {
		return $http.get(url + '/api/applications/?author=' + idUser)
			.then(function (response) {
				return response.data.data;
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

	authService.getBraintreeAuth = function (idApp) {
		return $http.get(url + '/api/applications/' + idApp + '/payment')
			.then(function (response) {
				return response.data.data.clientToken;
			}, function (error) {
				$window.location.href = "#/404";
			});
	}

	return authService;
});


website.config(function Config($httpProvider, jwtInterceptorProvider) {
	jwtInterceptorProvider.whiteListedDomains = ['5.196.88.52', 'ns375152.ip-5-196-88.eu', 'beavr.fr', 'localhost'];
	jwtInterceptorProvider.tokenGetter = ['options', 'AuthenticationService', function (options, AuthenticationService) {
		if (options.url.substr(options.url.length - 5) == '.html') {
			return null;
        }
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
	"POST_APP": "<i class='fa fa-times'></i> Une <strong>erreur</strong> est survenue lors de l'envoi de l'application. Réessayez dans quelques instants.",
	"EDIT_APP": "<i class='fa fa-times'></i> Une <strong>erreur</strong> est survenue lors de la modification de l'application. Réessayez dans quelques instants.",
	"BUY_APP": "<i class='fa fa-times'></i> Une <strong>erreur</strong> est survenue lors de l'achat de l'application. Veuillez réessayer ou contacter un administrateur."
};

var successMessage = {
	"INSCRIPTION": "Inscription effectuée avec succès.",
	"MDPOUBLIE": "Un nouveau mot de passe va vous être envoyé par mail d'ici quelques minutes.",
	"FEEDBACK": "Votre message nous a correctement été transmis. L'équipe BeaVR vous remercie !",
	"EDIT_COMMENT": "Votre commentaire a correctement été modifié.",
	"ADD_COMMENT": "Votre commentaire a correctement été ajouté.",
	"EDIT_PROFILE": "Vos informations ont été modifiées.",
	"POST_APP": "<i class='fa fa-check'></i> L'application a bien été envoyée et est <strong>en cours de validation</strong> par nos équipes.",
	"EDIT_APP": "<i class='fa fa-check'></i> Vos modifications ont été envoyées à notre équipe et sont <strong>en cours de validation</strong>.",
	"BUY_APP": "<i class='fa fa-check'></i> L'application a été ajoutée à votre <strong>bibliothèque</strong>."
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
			attrs.$observe('progressvalue', function(value) {
				if (value) {
					$(element).progress({
						percent: value,
					});
				}
			});
		}
	};
});

website.directive('paypalButton', ['$http', function ($http) {
	return {
        restrict: 'A',
        link: function (scope, element, attrs) {
			if (scope.appInfos.price != 0) {
				var paypalButton = element[0].children[1];
				// Create a Client component
				braintree.client.create({
					authorization: scope.auth
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
								if (err) {
									scope.$root.showErrorAlert = true;
								} else {
									var data = {
										payment_method_nonce: tokenizationPayload.nonce
									};
									$http.post(url + '/api/applications/' + scope.appInfos.id + '/checkout', data)
										.success(function (result) {
											scope.$root.showSuccessAlert = true;
											scope.$root.isOwned = true;
										})
										.error(function (result) {
											console.debug(result);
											scope.$root.showErrorAlert = true;
										});
								}
							});
						});
					});
				});
			}
		}
	};
}]);

website.directive('fadeAlertSuccess', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch("showSuccessAlert", function () {
				if (scope.$root.showSuccessAlert === true) {
					$(element).fadeTo(5000, 500).slideUp(500, function () {
						$(element).slideUp(500);
						scope.$root.showSuccessAlert = false;
					});
				}
			});
		}
	}
});

website.directive('fadeAlertError', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			scope.$watch("showErrorAlert", function () {
				if (scope.$root.showErrorAlert === true) {
					$(element).fadeTo(5000, 500).slideUp(500, function () {
						$(element).slideUp(500);
						scope.$root.showErrorAlert = false;
					});
				}
			});
		}
	}
});