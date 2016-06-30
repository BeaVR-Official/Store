var url = "http://beavr-api.herokuapp.com";

var website = angular.module('website', ['ngRoute', 'ngAnimate', 'ngCookies', 'ngMessages', 'ui.bootstrap']);

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
 	"FEEDBACK_DESCRIPTION" : "Votre feedback ne peut pas être vide."
};

var successMessage = {
	"INSCRIPTION" : "Inscription effectuée avec succès.",
 	"MDPOUBLIE" : "Un nouveau mot de passe va vous être envoyé par mail d'ici quelques minutes.",
 	"FEEDBACK" : "Votre feedback nous a correctement été transmis. L'équipe BeaVR vous remercie !"
};
