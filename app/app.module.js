//var url = "http://beavr-api.herokuapp.com";

var url = "http://beavr.fr:3000";

var website = angular.module('website', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMessages', 'angular-jwt', 'isteven-multi-select', 'ngFileUpload', 'ui.bootstrap']);

website.factory('AuthenticationService', function($http, $window, $cookies, jwtHelper) {
	var authService = {};

	authService.login = function(data) {
		return $http.post(url + '/api/connection', data)
		.success(function(result) {
			if (data.checkbox) {
				$window.localStorage.setItem('store_token', result.data.token);
				$window.localStorage.setItem('store_id', result.data.userId);
			} else {
				$cookies.put('store_token', result.data.token);
				$cookies.put('store_id', result.data.userId);
			}
			$window.location.href = "#/"
		});
	}

	authService.disconnect = function() {
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

	authService.isOffline = function() {
		return $window.localStorage.getItem('store_token') === null && $window.localStorage.getItem('store_id') === null && 
		$cookies.get('store_token') === undefined && $cookies.get('store_id') === undefined;
	}

	/*authService.isTokenFormatted = function () {
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
	}*/

	authService.isAuthenticated = function() {
		return $window.localStorage.getItem('store_token') !== null && $window.localStorage.getItem('store_id') !== null ||
		$cookies.get('store_token') !== undefined && $cookies.get('store_id') !== undefined;
	}

	authService.getToken = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				return $window.localStorage.getItem('store_token');
			} else if ($cookies.get('store_token') !== undefined) {
				return $cookies.get('store_token');
			}
		}
	}

	/*authService.getEncryptedToken = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_token') !== null) {
				return $window.localStorage.getItem('store_token');
			} else if ($cookies.get('store_token') !== undefined) {
				return $cookies.get('store_token');
			}
		}
	}*/

	authService.getId = function() {
		if (authService.isAuthenticated()) {
			if ($window.localStorage.getItem('store_id') !== null) {
				return $window.localStorage.getItem('store_id');
			} else if ($cookies.get('store_id') !== undefined) {
				return $cookies.get('store_id');
			}
		}
	}

	authService.getConnectedUserInfos = function() {
		return $http.get(url + '/api/users/' + authService.getId());
	}

	authService.getConnectedUserLibraryInfos = function () {
		return $http.get(url + '/api/users/applications');
	}

	/*authService.isAuthorized = function(authorizedRoles) {
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
	}*/

	authService.getComments = function(idApp) {
		return $http.get(url + '/api/comments/' + idApp);
	}

	authService.getCommentsLimit = function(idApp, limit) {
		return $http.get(url + '/api/comments/' + idApp + '/' + limit);
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
	return AuthenticationService.getToken();
  }];
  $httpProvider.interceptors.push('jwtInterceptor');
});

var errorMessage = {
	"INSCRIPTION" : "Une erreur est survenue pendant l'inscription. Réessayez dans quelques instants.",
	"INSCRIPTION_409" : "Cet utilisateur existe déjà.",
	"CONNEXION" : "Une erreur est survenue pendant la connexion. Réessayez dans quelques instants.",
	"CONNEXION_401" : "Cet utilisateur n'existe pas ou le mot de passe renseigné est incorrect.",
	"MDPOUBLIE_404" : "Aucun utilisateur n'est inscrit sous cette adresse.",
 	"MDPOUBLIE" : "Une erreur est survenue pendant la réinitialisation du mot de passe. Réessayez dans quelques instants.",
 	"FEEDBACK_102" : "Echec lors de l'envoi de votre feedback. Réessayez dans quelques instants.",
 	"FEEDBACK" : "Une erreur est survenue lors de l'envoi de votre feedback. Réessayez dans quelques instants.",
 	"FEEDBACK_OBJECT" : "L'objet de votre feedback ne peut pas être vide.",
 	"FEEDBACK_DESCRIPTION" : "Votre feedback ne peut pas être vide.",
	"EDIT_COMMENT" : "Votre commentaire n'a pas pu être modifié. Réessayez dans quelques instants.",
	"EDIT_COMMENT_102" : "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"ADD_COMMENT" : "Votre commentaire n'a pas pu être ajouté. Réessayez dans quelques instants.",
	"ADD_COMMENT_102" : "Une erreur est survenue lors de l'envoi de votre commentaire. Réessayez dans quelques instants.",
	"EDIT_HTML" : "Modifier le code de la page pour accéder aux éléments cachés est mal.",
	"COMMENT_TITLE" : "Le titre de votre commentaire ne peut pas être vide.",
	"COMMENT_COMMENT" : "Le contenu de votre commentaire ne peut pas être vide.",
	"EDIT_PROFILE_PASSWORD" : "Les deux mots de passe ne sont pas identiques.",
	"EDIT_PROFILE" : "Une erreur est survenue lors de la modification du compte. Réessayez dans quelques instants."
};

var successMessage = {
	"INSCRIPTION" : "Inscription effectuée avec succès.",
 	"MDPOUBLIE" : "Un nouveau mot de passe va vous être envoyé par mail d'ici quelques minutes.",
 	"FEEDBACK" : "Votre feedback nous a correctement été transmis. L'équipe BeaVR vous remercie !",
	"EDIT_COMMENT" : "Votre commentaire a correctement été modifié.",
	"ADD_COMMENT" : "Votre commentaire a correctement été ajouté.",
	"EDIT_PROFILE" : "Vos informations ont été modifiées."
};

website.filter('iif', function () {
   return function(input, trueValue, falseValue) {
        return input ? trueValue : falseValue;
   };
});
