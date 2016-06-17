/**
 * Created by kersal_e on 16/06/2016.
 */

var mysql = require("mysql");
var express = require('express');
var router = express.Router();
var sha1 = require('sha1');

/**
* @api {get} /devices/ Liste des devices
* @apiVersion 1.0.0
* @apiName Liste des devices
* @apiGroup Gestion Devices
* @apiDescription Retourne la liste de tous les devices (casques et gants de réalité virtuelle).
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object[]} Devices Liste des devices
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "Devices": [
    *         {
    *           "idDevice": 1,
*           "name": "Leap Motion",
*           "image": "Lien vers l'image"
    *         },
*         {
    *           "idDevice": 2,
    *           "name": "Oculus Rift",
    *           "image": "Lien vers l'image"
        *         },
*         ...
*      ]
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
    var query = "SELECT * FROM `Devices`";

    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error": false, "Code" : 1, "Devices": rows}); // OK
        else
            res.json({"Error": true, "Code" : 102}); // Erreur
    });
});

/**
* @api {get} /devices/:idDevice Récupérer les informations d'un device
* @apiVersion 1.0.0
* @apiName Récupérer les informations d'un device donné
* @apiGroup Gestion Devices
* @apiDescription Retourne les informations d'un device (casque ou gants de réalité virtuelle).
*
* @apiParam {Number} idDevice ID du device
*
* @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
* @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
* @apiSuccess (Succès) {Object} Devices Informations du device
*
* @apiSuccessExample Succès - Réponse :
*     {
*       "Error": false,
*       "Code" : 1,
*       "Devices": {
    *           "idDevices": 1,
    *           "name": "Leap Motion",
    *           "image": "Lien vers l'image"
        *         },
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
router.get("/:idDevice", function(req, res){

    var query = "SELECT * FROM Devices WHERE ??=?";
    var table = ["idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
            else
                res.json({"Error" : false, "Code" : 1, "Device" : rows[0]}); // OK
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Erreur
    });
});

/**
* @api {post} /devices Ajouter un device
* @apiVersion 1.0.0
* @apiName Ajouter un device
* @apiGroup Gestion Devices
* @apiDescription Ajouter un device.
*
* @apiParam {Number} name Nom du device
* @apiParam {String} image URL de l'image du device
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
router.post("/", function(req,res){

    var query = "INSERT INTO ?? (??, ??) VALUES (?,?)";
    var table = ["Devices", "name", "image", req.body.name, req.body.image];

    query = mysql.format(query,table);

    req.app.locals.connection.query(query,function(err,rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1});
        else
            res.json({"Error" : true, "Code" : 102});
    });
});

/**
* @api {delete} /devices/:idDevice Supprimer un device
* @apiVersion 1.0.0
* @apiName Suppression d'un device
* @apiGroup Gestion Devices
* @apiDescription Supprimer un device.
*
* @apiParam {Number} idDevice ID du device
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
* @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = Le device n'existe pas)
*
* @apiErrorExample Erreur - Réponse :
*     {
*       "Error" : true,
*       "Code" : 102
    *     }
*
*/
router.delete("/:idDevice", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Devices", "idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
        {
            if (rows.affectedRows == 1)
                res.json({"Error" : false, "Code" : 1}); // OK
            else
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
        }
        else
            res.json({"Error" : true, "Code" : 102}); // Error
    });
});

/**
* @api {put} /devices/:idDevice Mettre à jour un device
* @apiVersion 1.0.0
* @apiName Mettre à jour un device
* @apiGroup Gestion Devices
* @apiDescription Permet de mettre à jour un device.
*
* @apiParam {String} name Nom du device
* @apiParam {String} image Lien vers l'image
* @apiParam {Number} idDevice ID du device
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
router.put("/:idDevice", function(req, res){

    var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
    var table = ["Devices", "name", req.body.name, "image", req.body.image, "idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    req.app.locals.connection.query(query, function(err, rows){
        if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
        else
            res.json({"Error" : true, "Code" : 102}); // Error
    });
});

module.exports = router;