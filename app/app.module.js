var url = "http://beavr-api.herokuapp.com";

var website = angular.module('website', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMessages', 'angular-jwt', 'ui.bootstrap']);

website.factory('AuthenticationService', function($http, $window, $cookies, jwtHelper) {
	var authService = {};

	authService.login = function(data) {
		return $http.post(url + '/api/connection', data)
		.success(function(result) {
			if (result.Error == false) {
				if (data.checkbox) {
					$window.localStorage.setItem('store_token', result.Token);
				} else {
					$cookies.put('store_token', result.Token);
				}
				$window.location.href = "#/"
			}
		});
	}

	authService.disconnect = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				$window.localStorage.removeItem('store_token');
				$window.location.href = "#/"
				$window.location.reload();
			} else if ($cookies.get('store_token') !== undefined) {
				$cookies.remove('store_token');
				$window.location.href = "#/"
				$window.location.reload();
			}
		}
	}

	authService.isOffline = function() {
		return $window.localStorage.getItem('store_token') === null && $cookies.get('store_token') === undefined;
	}

	authService.isTokenFormatted = function () {
		if ($window.localStorage.getItem('store_token') !== null) {
			try {
				var userInfos = jwtHelper.decodeToken($window.localStorage.getItem('store_token'));
				return true;
			} catch (error) {
				return false;
			}
		} else if ($cookies.get('store_token') !== undefined) {
			try {
				var userInfos = jwtHelper.decodeToken($cookies.get('store_token'));
				return true;
			} catch (error) {
				return false;
			}
		}
	}

	authService.isAuthenticated = function() {
		if ($window.localStorage.getItem('store_token') !== null) {
			var token = $window.localStorage.getItem('store_token');
			if (authService.isTokenFormatted(token)) {
				var userInfos = jwtHelper.decodeToken(token);
				return userInfos.id !== undefined;
			}
		} else if ($cookies.get('store_token') !== undefined) {
			var token = $cookies.get('store_token');
			if (authService.isTokenFormatted(token)) {
				var userInfos = jwtHelper.decodeToken(token);
				return userInfos.id !== undefined;
			}
		}
	}

	authService.getToken = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				var userInfos = jwtHelper.decodeToken($window.localStorage.getItem('store_token'));
				return userInfos;
			} else if ($cookies.get('store_token') !== undefined) {
				var userInfos = jwtHelper.decodeToken($cookies.get('store_token'));
				return userInfos;
			}
		}
	}

	authService.getEncryptedToken = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				return $window.localStorage.getItem('store_token');
			} else if ($cookies.get('store_token') !== undefined) {
				return $cookies.get('store_token');
			}
		}
	}

	authService.getConnectedUserLibraryInfos = function () {
		return $http.get(url + '/api/users/applications');
	}

	authService.isAuthorized = function(authorizedRoles) {
		if (!angular.isArray(authorizedRoles)) { // prevent type conflict
			authorizedRoles = [authorizedRoles];
		}
		if (authService.isAuthenticated()) {
			var role;
			if ($window.localStorage.getItem('store_token') !== null) {
				var userInfos = jwtHelper.decodeToken($window.localStorage.getItem('store_token'));
				role = userInfos.role;
			} else if ($cookies.get('store_token') !== undefined) {
				var userInfos = jwtHelper.decodeToken($cookies.get('store_token'));
				role = userInfos.role;
			}
			return authorizedRoles.indexOf(role) !== -1;
		} else {
			return false;
		}
	}

	authService.getComments = function(idApp) {
		return $http.get(url + '/api/comments/' + idApp);
	}

	authService.getAppInfos = function(idApp) {
		return $http.get(url + '/api/applications/' + idApp);
	}

	return authService;
});

website.constant('USER_ROLES', {
	User 			: 'User',
	Developer 		: 'Developer',
	Administrator 	: 'Administrator'
});

website.config(function Config($httpProvider, jwtInterceptorProvider) {
  jwtInterceptorProvider.tokenGetter = ['config', 'AuthenticationService', function(config, AuthenticationService) {
	return AuthenticationService.getEncryptedToken();
  }];
  $httpProvider.interceptors.push('jwtInterceptor');
});

var errorMessage = {
	"INSCRIPTION_100" : "Une erreur innattendue s'est produite. Réessayez dans quelques instants.",
	"INSCRIPTION_101" : "Cette adresse mail est déjà utilisée.",
	"INSCRIPTION_104" : "Ce pseudonyme est déjà utilisé.",
	"INSCRIPTION" : "Une erreur est survenue pendant l'inscription. Réessayez dans quelques instants.",
	"CONNEXION_103" : "Cet utilisateur n'existe pas.",
	"CONNEXION_200" : "Mot de passe incorrect.",
	"CONNEXION" : "Une erreur est survenue pendant la connexion. Réessayez dans quelques instants.",
	"MDPOUBLIE_103" : "Aucun utilisateur n'est inscrit sous cette adresse.",
	"MDPOUBLIE_202" : "Echec lors de l'envoi du mail. Réessayez dans quelques instants.",
 	"MDPOUBLIE" : "Une erreur est survenue pendant la réinitialisation du mot de passe. Réessayez dans quelques instants.",
 	"FEEDBACK_102" : "Echec lors de l'envoi de votre feedback. Réessayez dans quelques instants.",
 	"FEEDBACK" : "Une erreur est survenue lors de l'envoi de votre feedback. Réessayez dans quelques instants.",
 	"FEEDBACK_OBJECT" : "L'objet de votre feedback ne peut pas être vide.",
 	"FEEDBACK_DESCRIPTION" : "Votre feedback ne peut pas être vide.",
	"EDIT_COMMENT" : "Votre commentaire n'a pas pu être modifié. Réessayez dans quelques instants.",
	"EDIT_COMMENT_102" : "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"ADD_COMMENT" : "Votre commentaire n'a pas pu être ajouté. Réessayez dans quelques instants.",
	"ADD_COMMENT_102" : "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"HAS_COMMENTED" : "Les commentaires sont temporairement désactivés. Réessayez dans quelques minutes."
};

var successMessage = {
	"INSCRIPTION" : "Inscription effectuée avec succès.",
 	"MDPOUBLIE" : "Un nouveau mot de passe va vous être envoyé par mail d'ici quelques minutes.",
 	"FEEDBACK" : "Votre feedback nous a correctement été transmis. L'équipe BeaVR vous remercie !",
	"EDIT_COMMENT" : "Votre commentaire a correctement été modifié.",
	"ADD_COMMENT" : "Votre commentaire a correctement été ajouté."
};
