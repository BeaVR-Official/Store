

var url = "http://localhost:3000";

var website = angular.module('website', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ngMessages']);

var errorMessage = {
	"INSCRIPTION_100" : "Une erreur innattendue s'est produite. Réessayez dans quelques instants.",
	"INSCRIPTION_101" : "Cette adresse mail est déjà utilisée.",
	"INSCRIPTION_104" : "Ce pseudonyme est déjà utilisé.",
	"INSCRIPTION" : "Une erreur est survenue pendant l'inscription. Réessayez dans quelques instants.",
};

var successMessage = {
	"INSCRIPTION" : "Inscription effectuée avec succès.",
};
