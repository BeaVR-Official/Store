/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/**
* @api {get} /categoryTypes/ Liste des thèmes
* @apiVersion 1.0.0
* @apiName Liste des thèmes
* @apiGroup Gestion Categories
* @apiDescription Retourne la liste de tous les thèmes.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Categories Liste des thèmes
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *          {
    *           "idCategoryType": 1,
*           "description": "Sport"
    *          },
*          {
    *            "idCategoryType": 2,
    *            "description": "Sciences"
        *          },
*         ...
*       ]
*     }
*
* @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.get("/categoryTypes", function(req, res){
    var query = "SELECT * FROM `CategoryTypes`";

    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "Categories": rows}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Error
    });
});

/**
* @api {post} /categoryTypes Ajouter un thème
* @apiVersion 1.0.0
* @apiName Ajouter un thème
* @apiGroup Gestion Categories
* @apiDescription Ajouter un thème.
*
* @apiParam {String} description Nom du thème
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1
    *     }
*
* @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.post("/categoryTypes", function(req,res){

    var query = "INSERT INTO `CategoryTypes` (`description`) VALUES (?)";
    var table = [req.body.description];

    query = mysql.format(query,table);

    req.app.locals.connection.query(query,function(err,rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Error
    });
});

/**
* @api {get} /categories/ Liste des catégories
* @apiVersion 1.0.0
* @apiName Liste des catégories
* @apiGroup Gestion Categories
* @apiDescription Retourne la liste de toutes les catégories.
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Categories Liste des catégories
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *         {
    *           "idCategorie": 1,
*           "name": "Mathématique",
*           "description": "Les chiffres vous parlent ? ",
*           "type": 2
    *         },
*         {
    *           "idCategorie": 2,
    *           "name": "Géologie",
    *           "description": "Les pierres ça vous dit ",
    *           "type": 2
        *         },
*         ...
*       ]
*     }
*
* @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.get("/", function(req, res){
    var query = "SELECT * FROM `Categories`";

    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "Categories": rows}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Error
    });
});

/**
* @api {get} /categories/:idType Récupérer les catégories d'un thème
* @apiVersion 1.0.0
* @apiName Récupérer les catégories d'un thème
* @apiGroup Gestion Categories
* @apiDescription Retourne la liste de toutes les catégories pour un thème donné.
*
* @apiParam {Number} type ID du thème
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Categories Liste des catégories
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "Categories": [
    *         {
    *           "idCategorie": 1,
*           "name": "Mathématique",
*           "description": "Les chiffres vous parlent ? ",
*           "type": 2
    *         },
*         {
    *           "idCategorie": 2,
    *           "name": "Géologie",
    *           "description": "Les pierres ça vous dit ",
    *           "type": 2
        *         },
*         ...
*       ]
*     }
*
* @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = Le thème n'existe pas)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.get("/:idType", function(req, res){

    var query = "SELECT * FROM `Categories` WHERE ??=?";
    var table = ["type", req.params.idType];
    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
            else
                res.json({"Error" : false, "Code" : 1, "Categories" : rows}); // OK
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /categorytypesanddevices Récupérer les thèmes et les devices
* @apiVersion 1.0.0
* @apiName Récupérer les thèmes et les devices
* @apiGroup Gestion Categories
* @apiDescription Retourne la liste de tout les thèmes et de tout les devices.
*
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object} Categories Liste des thèmes et des devices
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "CategoryTypesAndDevices": {
    *             "CategoryTypes": "Toutes, Sciences, Sports, Mécanique",
    *             "Devices": "Leap Motion, Oculus Rift, HTC Vive, Samsung VR, HoloLens, Project Morpheus"
        *        }
*     }
*
* @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.get("/categorytypesanddevices", function(req, res){
    var query = "SELECT * FROM `AllCategoryTypesAndDevices`";

    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "CategoryTypesAndDevices": rows[0]}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Erreur
    });
});

module.exports = router;