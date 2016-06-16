var mysql = require("mysql");
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
    service: 'Yahoo',
    auth: {
        user: 'beavrfr@yahoo.com',
        pass: 'epitech2017'
    }
}));

function REST_ROUTER(router, connection, sha1){
  var self = this;
  self.handleRoutes(router, connection, sha1);
}


REST_ROUTER.prototype.handleRoutes = function(router, connection, sha1){

  /*
   _______ _________          _______  _______  _______
  (  ___  )\__   __/|\     /|(  ____ \(  ____ )(  ____ \
  | (   ) |   ) (   | )   ( || (    \/| (    )|| (    \/
  | |   | |   | |   | (___) || (__    | (____)|| (_____
  | |   | |   | |   |  ___  ||  __)   |     __)(_____  )
  | |   | |   | |   | (   ) || (      | (\ (         ) |
  | (___) |   | |   | )   ( || (____/\| ) \ \__/\____) |
  (_______)   )_(   |/     \|(_______/|/   \__/\_______)

  */

  /**
  * @api {get} / Réponse basique
  * @apiVersion 1.0.0
  * @apiName Réponse basique
  * @apiGroup Autres
  * @apiDescription Réponse basique de l'API. Utilisée principalement lors des tests de connexion.
  *
  * @apiSuccess (Succès) {String} Message Message basique de bienvenue de la part de l'API
  * @apiSuccess (Succès) {Number} Code Code d'erreur (retourne 1 si aucune erreur n'est détectée)
  *
  * @apiSuccessExample Succès - Réponse:
  *     {
  *       "Message": "Bienvenue sur l'API BeaVR",
  *       "Code" : 1
  *     }
  */
  router.get("/", function(req, res){
    res.json({
      "Message" : "Bienvenue sur l'API BeaVR.",
      "Code" : 1
    });
  });

  /**
  * @api {post} /registration Inscription
  * @apiVersion 1.0.0
  * @apiName Inscription
  * @apiGroup Autres
  * @apiDescription Permet l'inscription d'un nouvel utilisateur.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur
  * @apiParam {String} pseudo Pseudonyme de l'utilisateur
  * @apiParam {String} password Mot de passe de l'utilisateur
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
  * @apiError (Erreur) {Number} Code Code d'erreur (100 = Un des champs est mal renseigné, 101 = L'utilisateur existe déja, 104 = Le pseudonyme est déjà utilisé)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 100
  *     }
  *
  */
  router.post("/registration", function(req,res){

      var query = "INSERT INTO ?? (`pseudo`, `email`, `password`, `role`) VALUES (?, ?, ?, 4)";
      var table = ["Users", req.body.pseudo, req.body.email, sha1(req.body.password)];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
          else
          {
            if (err.code == "ER_DUP_ENTRY")
            {
              var pattern = ".*Duplicate entry '.*' for key '(.*)'";
              var matches = err.message.match(pattern);

              if (matches != null)
              {
                if (matches[1] == "pseudo")
                  res.json({"Error" : true, "Code" : 104}); // Le pseudo est déjà utilisé
                if (matches[1] == "email")
                  res.json({"Error" : true, "Code" : 101}); // L'email est déjà utilisé
              }
            }
            else
              res.json({"Error" : true, "Code" : 100}); // Un des champs est mal renseigné
          }
      });
  });

  /**
  * @api {post} /connection Connexion
  * @apiVersion 1.0.0
  * @apiName Connexion
  * @apiGroup Autres
  * @apiDescription Permet la connexion d'un utilisateur.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur
  * @apiParam {String} password Mot de passe de l'utilisateur
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object} Data Informations de l'utilisateur
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Data" : {
  *         "idUser": 1,
  *         "email": "j.dujardin@gmail.com",
  *         "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *         "pseudo" : "JeanJean",
  *         "lastName": "Dujardin",
  *         "firstName": "Jean",
  *         "role": 4,
  *         "registration": "2015-12-05T06:24:33.000Z"
  *       }
  *     }
  *
  * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas, 200 = Mot de passe incorrect)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/connection", function(req,res){

      var query = "SELECT * FROM ?? WHERE ?? = ?";
      var table = ["Users", "email", req.body.email];

      query = mysql.format(query, table);

      connection.query(query, function(err, rows) {
        if (!err)
        {
          if (rows == 0)
            res.json({"Error" : true, "Code" : 103}) // L'utilisateur n'existe pas
          else
          {
            var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table = ["Users","email", req.body.email, "password", sha1(req.body.password)];

            query = mysql.format(query, table);

            connection.query(query, function(err, rows) {
              if (!err)
              {
                if (rows.length == 0)
                  res.json({"Error" : true, "Code" : 200}); // Mot de passe incorrect
                else
                  res.json({"Error" : false, "Code" : 1, "Data" : rows[0]}); // OK
              }
              else
                res.json({"Error" : true, "Code" : 102}); // Erreur
            })
          }
        }
        else
          res.json({"Error" : true, "Code" : 102}); // Erreur
      })
  });

  /**
  * @api {post} /email Vérifier l'existence d'une adresse mail
  * @apiVersion 1.0.0
  * @apiName Vérifier l'existence d'une adresse mail
  * @apiGroup Autres
  * @apiDescription Vérifie si une adresse mail existe bien dans la base de données.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/email", function(req,res){

      var query = "SELECT * FROM ?? WHERE ?? = ?";
      var table = ["Users", "email", req.body.email];

      query = mysql.format(query, table);

      connection.query(query, function(err, rows) {
        if (!err)
        {
          if (rows == 0)
            res.json({"Error" : true, "Code" : 103}) // N'existe pas
          else
            res.json({"Error" : false, "Code" : 1}); // Existe
        }
        else
          res.json({"Error" : true, "Code" : 102});
      })
  });

  /**
  * @api {post} /reset-password Réinitialiser le mot de passe
  * @apiVersion 1.0.0
  * @apiName Réinitialiser le mot de passe
  * @apiGroup Autres
  * @apiDescription Vérifie si une adresse mail existe bien dans la base de données et réinitialise le mot de passe associé en cas de succès.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur dont le mot de passe associé doit être réinitialisé
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/reset-password", function(req,res){

      var query = "SELECT * FROM ?? WHERE ?? = ?";
      var table = ["Users", "email", req.body.email];

      query = mysql.format(query, table);

      connection.query(query, function(err, rows) {
        if (err)
          res.json({"Error" : true, "Code" : 102});
        else
        {
          if (rows == 0)
            res.json({"Error" : true, "Code" : 103})
          else
          {
             var query = "UPDATE ?? SET `password`= ? WHERE `email` = ?";
             var password = randomstring.generate(8);
             var table = ["Users", sha1(password), req.body.email];

             query = mysql.format(query, table);
             connection.query(query, function(err, rows) {
                if (err)
                    res.json({"Error" : true, "Code" : 102});
                else
                {
                    if (rows == 0)
                        res.json({"Error" : true, "Code" : 103});
                    else
                    {
                        var mailOptions = {
                            from: 'BeaVR <beavrfr@yahoo.com>',
                            to: req.body.email,
                            subject: 'Réinitialisation du mot de passe',
                            text: 'Bonjour, votre nouveau mot de passe est le suivant : ' + password
                        };
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error)
                                res.json({"Error" : true, "Code" : 202})
                            else
                                res.json({"Error" : false, "Code" : 1});
                            console.log(info);
                        })
                        transporter.close();
                    }
                }
             })
          }
        }
      })
  });

/**
  * @api {post} /sendFeedback Effectuer un retour sur le Store
  * @apiVersion 1.0.0
  * @apiName Effectuer un retour sur le Store
  * @apiGroup Autres
  * @apiDescription Permet de transmettre son avis sur le Store, d'effectuer un retour directement aux développeurs.
  *
  * @apiParam {Number} idUser ID de l'utilisateur
  * @apiParam {String} object Sujet du feedback
  * @apiParam {String} description Contenu du feedback
  * @apiParam {Boolean} recontact True si l'utilisateur souhaite être recontacté, False autrement
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
  router.post("/sendFeedback",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
      var table = ["Feedbacks","user","object","description","recontact",req.body.idUser,req.body.object,req.body.description,req.body.recontact];

      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /**
  * @api {get} /getFeedbacks Récupérer la liste des retours sur le Store
  * @apiVersion 1.0.0
  * @apiName Récupérer la liste des retours sur le Store
  * @apiGroup Autres
  * @apiDescription Permet récupérer les différents retours sur le Store de la part des utilisateurs.
  *
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object[]} Feedbacks Liste des feedbacks
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Feedbacks": [
  *         {
  *           "idFeedback": 1,
  *           "user": 1,
  *           "object": "Premier feedback",
  *           "description": "Ceci est le premier feedback !",
  *           "recontact": 1
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
  router.get("/getFeedbacks",function(req,res){
      var query = "SELECT * FROM ??";
      var table = ["Feedbacks"];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1, "Feedbacks" : rows});
          }
      });
  });

  /*
            _______  _______  _______  _______
  |\     /|(  ____ \(  ____ \(  ____ )(  ____ \
  | )   ( || (    \/| (    \/| (    )|| (    \/
  | |   | || (_____ | (__    | (____)|| (_____
  | |   | |(_____  )|  __)   |     __)(_____  )
  | |   | |      ) || (      | (\ (         ) |
  | (___) |/\____) || (____/\| ) \ \__/\____) |
  (_______)\_______)(_______/|/   \__/\_______)

  */

  /**
  * @api {get} /users Liste des utilisateurs
  * @apiVersion 1.0.0
  * @apiName Liste des utilisateurs
  * @apiGroup Gestion Utilisateurs
  * @apiDescription Retourne la liste de tous les utilisateurs.
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object[]} Users Liste des utilisateurs
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : [
  *         {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
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
  router.get("/users", function(req, res){
    var query = "SELECT * FROM `Users`";

    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error": false, "Code" : 1, "Users": rows}); // OK
      else
        res.json({"Error": true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {get} /users/:idUser Récupérer les informations d'un utilisateur
  * @apiVersion 1.0.0
  * @apiName Informations d'un utilisateur
  * @apiGroup Gestion Utilisateurs
  * @apiDescription Retourne les informations d'un utilisateur donné.
  *
  * @apiParam {Number} idUser ID de l'utilisateur souhaité
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object} Users Informations de l'utilisateur
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
  *       }
  *     }
  *
  * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.get("/users/:idUser", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Users", "idUser", req.params.idUser];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.length == 0)
          res.json({"Error" : true, "Code" : 103}); // L'utilise n'existe pas
        else
          res.json({"Error" : false, "Code" : 1, "Users" : rows[0]}); // OK
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {delete} /users/:idUser Supprimer un utilisateur
  * @apiVersion 1.0.0
  * @apiName Suppression d'un utilisateur
  * @apiGroup Gestion Utilisateurs
  * @apiDescription Supprime un utilisateur donné.
  *
  * @apiParam {Number} idUser ID de l'utilisateur souhaité
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.delete("/users/:idUser", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Users", "idUser", req.params.idUser];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.affectedRows == 1)
          res.json({"Error" : false, "Code" : 1}); // OK
        else
          res.json({"Error" : false, "Code" : 103}); // L'utilisateur n'existe pas
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {put} /users/:idUser Modifier un utilisateur
  * @apiVersion 1.0.0
  * @apiName Modification des informations d'un utilisateur
  * @apiGroup Gestion Utilisateurs
  * @apiDescription Modifier les informations d'un utilisateur donné.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur
  * @apiParam {String} password Mot de passe de l'utilisateur
  * @apiParam {String} name Nom de l'utilisateur
  * @apiParam {String} firstname Prénom de l'utilisateur
  * @apiParam {Number} role Rôle de l'utilisateur
  * @apiParam {Number} idUser ID de l'utilisateur souhaité
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object} Users Informations de l'utilisateur
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Users" : {
  *           "idUser": 1,
  *           "email": "j.dujardin@gmail.com",
  *           "pseudo": "JeanJean",
  *           "password": "a94a8fe5ccb19ba61c4c0873d391e9879ffa353a",
  *           "lastName": "Dujardin",
  *           "firstName": "Jean",
  *           "role": 4,
  *           "registration": "2015-12-05T06:24:33.000Z"
  *       }
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
  router.put("/users/:idUser", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Users", "idUser", req.params.idUser];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows == 0)
          res.json({"Error" : true, "Code" : 103}); // L'utilisateur n'existe pas
        else
        {
          var query = "UPDATE Users SET `email`= ?,`pseudo`= ?, `password`= ?,`lastName`= ?,`firstName`= ?,`role`= ? WHERE `idUser` = ?";
          var table = [req.body.email, req.body.pseudo, sha1(req.body.password), req.body.lastName, req.body.firstName, req.body.role, req.params.idUser];

          query = mysql.format(query, table);
          connection.query(query, function(err, rows){
          if (!err)
          {
            res.json({"Error" : false, "Code" : 1, "Users" : rows[0]}); // OK
          }
          else
            res.json({"Error" : true, "Code" : 102}); // Erreur
          });
        }
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {post} /users/ Ajouter un utilisateur
  * @apiVersion 1.0.0
  * @apiName Ajout d'un utilisateur
  * @apiGroup Gestion Utilisateurs
  * @apiDescription Ajoute un utilisateur après avoir vérifier qu'il n'existait pas.
  *
  * @apiParam {String} email Adresse mail de l'utilisateur
  * @apiParam {string} pseudo Le pseudonyme de l'utilisateur
  * @apiParam {String} password Mot de passe de l'utilisateur
  * @apiParam {String} lastName Nom de l'utilisateur
  * @apiParam {String} firstName Prénom de l'utilisateur
  * @apiParam {String} role Rôle de l'utilisateur
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *     }
  *
  * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
  * @apiError (Erreur) {Number} Code Code d'erreur (101 = L'utilisateur existe déjà, 102 = Erreur lors de la requête)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 101
  *     }
  *
  */
  router.post("/users", function(req,res){

      var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
      var table = ["Users", "email", "pseudo", "password", "lastName", "firstName", "role",
      req.body.email, req.body.pseudo, sha1(req.body.password), req.body.lastName, req.body.firstName, req.body.role];

      query = mysql.format(query,table);

      connection.query(query,function(err,rows){
        if (!err)
          res.json({"Error" : false, "Code" : 1}); // OK
        else {
          if (err.code == "ER_DUP_ENTRY")
            res.json({"Error" : true, "Code" : 101}); // L'utilisateur existe déjà
          else
            res.json({"Error" : true, "Code" : 102}); // Erreur
      }
      });
  });

  /*
   _______  _______  _______  _       _________ _______  _______ __________________ _______  _        _______
  (  ___  )(  ____ )(  ____ )( \      \__   __/(  ____ \(  ___  )\__   __/\__   __/(  ___  )( (    /|(  ____ \
  | (   ) || (    )|| (    )|| (         ) (   | (    \/| (   ) |   ) (      ) (   | (   ) ||  \  ( || (    \/
  | (___) || (____)|| (____)|| |         | |   | |      | (___) |   | |      | |   | |   | ||   \ | || (_____
  |  ___  ||  _____)|  _____)| |         | |   | |      |  ___  |   | |      | |   | |   | || (\ \) |(_____  )
  | (   ) || (      | (      | |         | |   | |      | (   ) |   | |      | |   | |   | || | \   |      ) |
  | )   ( || )      | )      | (____/\___) (___| (____/\| )   ( |   | |   ___) (___| (___) || )  \  |/\____) |
  |/     \||/       |/       (_______/\_______/(_______/|/     \|   )_(   \_______/(_______)|/    )_)\_______)

  */

  /**
  * @api {get} /applications/ Liste des applications
  * @apiVersion 1.0.0
  * @apiName Liste des applications
  * @apiGroup Gestion Applications
  * @apiDescription Retourne la liste de toutes les applications.
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object[]} Applications Liste des applications
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Applications" : [
  *         {
  *           "name": "Application",
  *           "description": "Ceci est la description de l'application",
  *           "creationDate": "2016-01-31T15:00:00.000Z",
  *           "price": 29.99,
  *           "logo": "Url du logo",
  *           "url": "Lien vers l'application",
  *           "categoriesNames": "Mathématique, Astrologie",
  *           "devicesNames": "Leap Motion",
  *           "authorName": "Jean Dujardin"
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
  router.get("/applications", function(req, res){
    var query = "SELECT * FROM `AllApplicationsInfos`";

    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error": false, "Code" : 1, "Applications": rows}); // OK
      else
        res.json({"Error": true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {get} /applications/:idApplication Récupérer les informations d'une application
  * @apiVersion 1.0.0
  * @apiName Informations d'une application
  * @apiGroup Gestion Applications
  * @apiDescription Retourne les informations d'une application donnée.
  *
  * @apiParam {Number} idApplication ID de l'application
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object} Applications Informations de l'application
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Applications" : {
  *           "name": "Application",
  *           "description": "Ceci est la description de l'application",
  *           "creationDate": "2016-01-31T15:00:00.000Z",
  *           "price": 29.99,
  *           "logo": "Url du logo",
  *           "url": "Lien vers l'application",
  *           "categoriesNames": "Mathématique, Astrologie",
  *           "devicesNames": "Leap Motion",
  *           "authorName": "Jean Dujardin"
  *       }
  *     }
  *
  * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.get("/applications/:idApplication", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplication", req.params.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.length == 0)
          res.json({"Error" : true, "Code" : 103}); // N'existe pas
        else {
          res.json({"Error" : false, "Code" : 1, "Applications" : rows[0]}); // OK
        }
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {delete} /applications/:idApplication Supprimer une application
  * @apiVersion 1.0.0
  * @apiName Suppression d'une application
  * @apiGroup Gestion Applications
  * @apiDescription Supprimer une application.
  *
  * @apiParam {Number} idApplication ID de l'application
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.delete("/applications/:idApplication", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplication", req.params.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.affectedRows == 1)
          res.json({"Error" : false, "Code" : 1}); // OK
        else {
          res.json({"Error" : true, "Code" : 103}); // N'existe pas
        }
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {post} /applications/ Ajouter une application
  * @apiVersion 1.0.0
  * @apiName Ajout d'une application
  * @apiGroup Gestion Applications
  * @apiDescription Ajouter une application.
  *
  * @apiParam {String} name Nom de l'application
  * @apiParam {String} description Description de l'application
  * @apiParam {Date} creationdate Date de création de l'application
  * @apiParam {Number} price Prix de l'application
  * @apiParam {Number} creator ID de l'auteur de l'application
  * @apiParam {String} url Lien vers l'application
  * @apiParam {Number} state Statut de l'application
  * @apiParam {Number} logo ID du logo de l'application
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'application n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/applications", function(req,res){

      var query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      var table = ["Applications", "name", "description", "creationDate", "price", "creator", "url", "state", "logo",
      req.body.name, req.body.description, (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' '),
      req.body.price, req.body.creator, req.body.url, req.body.state, req.body.logo];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
          else
            res.json({"Error" : true, "Code" : 102}); // Erreur
      });
  });

  /**
  * @api {get} /progressions/:idApplication Récupérer la progression
  * @apiVersion 1.0.0
  * @apiName Récupérer la progression
  * @apiGroup Gestion Applications
  * @apiDescription Récupérer la progression d'un utilisateur sur une application.
  *
  * @apiParam {Number} idApplication ID de l'application
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1
  *       "Progression" : {
  *         "idApplication" : 1,
  *         "hashProgression" : "jDSNCbaKGyEMFORIarCe80lI3lzt9e9zizppM3WoGgP6uywBIp"
  *       }
  *     }
  *
  * @apiError (Erreur) {Boolean} Error Retourne "true" en cas d'erreur
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 201 = Aucune progression)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.get("/progressions/:idApplication", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Progressions", "application", req.params.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.length == 0)
          res.json({"Error" : true, "Code" : 201}); // Aucune progression
        else
          res.json({"Error" : false, "Code" : 1, "Progression" : rows}); // OK
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * @api {put} /progressions/:idApplication Mettre à jour la progression d'une application
  * @apiVersion 1.0.0
  * @apiName Mettre à jour la progression
  * @apiGroup Gestion Applications
  * @apiDescription Permet de mettre à jour la progression d'un utilisateur sur une application.
  *
  * @apiParam {String} hashProgression Progression de l'utilisateur
  * @apiParam {Number} idApplication ID de l'application
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object} Applications Informations de l'application
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
  router.put("/progressions/:idApplication", function(req, res){

    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["Progressions", "hashProgression" , req.body.hashProgression, "application", req.params.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error" : false, "Code" : 1}); // OK
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

    /**
  * @api {put} /validateApplicationSubmission/:idApp Valide une application soumise par un développeur
  * @apiVersion 1.0.0
  * @apiName Valide une application soumise par un développeur
  * @apiGroup Gestion Applications
  * @apiDescription Valide une application soumise par un développeur.
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
  router.put("/validateApplicationSubmission/:idApp",function(req,res){
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = ["Applications","state","1","idApplication",req.params.idApp];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });


  /**
  * @api {put} /updateApplicationInfos Modifier les informations d'une application
  * @apiVersion 1.0.0
  * @apiName Modifier les informations d'une application
  * @apiGroup Gestion Applications
  * @apiDescription Modifier les informations d'une application.
  *
  * @apiParam {String} name Nom de l'application
  * @apiParam {String} description Description de l'application
  * @apiParam {Number} price Prix de l'application
  * @apiParam {Number} headdevice ID du casque de réalité virtuelle
  * @apiParam {Number} handsdevice ID des gants de réalité virtuelle
  * @apiParam {Number} category Catégorie dans laquelle est classée l'application
  * @apiParam {Number} idApp ID de l'application
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
  router.put("/updateApplicationInfos",function(req,res){
      var query = "UPDATE ?? SET ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ?, ?? = ? WHERE ?? = ?";
      var table = ["applications","name",req.body.name,
                  "description",req.body.description,
                  "price",req.body.price,
                  "headdevice",req.body.headdevice,
                  "handsdevice",req.body.handsdevice,
                  "category",req.body.category,
                  "idApplication",req.body.idApp];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /**
  * @api {post} /submitApplication Soumettre une application
  * @apiVersion 1.0.0
  * @apiName Soumettre une application
  * @apiGroup Gestion Applications
  * @apiDescription Soumettre une application
  *
  * @apiParam {String} name Nom de l'application
  * @apiParam {String} description Description de l'application
  * @apiParam {Date} creationdate Date de création
  * @apiParam {Number} price Prix de l'application
  * @apiParam {Number} headdevice ID du casque de réalité virtuelle
  * @apiParam {Number} handsdevice ID des gants de réalité virtuelle
  * @apiParam {Number} authord ID de l'auteur de l'application
  * @apiParam {Number} category Catégorie dans laquelle est classée l'application
  * @apiParam {String} appUrl URL de l'application
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
  router.post("/submitApplication",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??,??,??,??,??,??,??) VALUES (?,?,?,?,?,?,?,?,?,?)";
      var table = ["applications","name","description","creationdate","price","headdevice","handsdevice","state","author","category","url",
                  req.body.name,req.body.description,req.body.creationdate,req.body.price,req.body.headdevice,req.body.handsdevice,"1",req.body.author,
                  req.body.category,req.body.appUrl];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /*
   ______   _______          _________ _______  _______  _______
  (  __  \ (  ____ \|\     /|\__   __/(  ____ \(  ____ \(  ____ \
  | (  \  )| (    \/| )   ( |   ) (   | (    \/| (    \/| (    \/
  | |   ) || (__    | |   | |   | |   | |      | (__    | (_____
  | |   | ||  __)   ( (   ) )   | |   | |      |  __)   (_____  )
  | |   ) || (       \ \_/ /    | |   | |      | (            ) |
  | (__/  )| (____/\  \   /  ___) (___| (____/\| (____/\/\____) |
  (______/ (_______/   \_/   \_______/(_______/(_______/\_______)

  */

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
  router.get("/devices", function(req, res){
    var query = "SELECT * FROM `Devices`";

    connection.query(query, function(err, rows){
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
  router.get("/devices/:idDevice", function(req, res){

    var query = "SELECT * FROM Devices WHERE ??=?";
    var table = ["idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
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
  router.post("/devices", function(req,res){

      var query = "INSERT INTO ?? (??, ??) VALUES (?,?)";
      var table = ["Devices", "name", "image", req.body.name, req.body.image];

      query = mysql.format(query,table);

      connection.query(query,function(err,rows){
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
  router.delete("/devices/:idDevice", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Devices", "idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
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
  router.put("/devices/:idDevice", function(req, res){

    var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
    var table = ["Devices", "name", req.body.name, "image", req.body.image, "idDevice", req.params.idDevice];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error" : false, "Code" : 1}); // OK
      else
        res.json({"Error" : true, "Code" : 102}); // Error
    });
  });

  /*

     _______  _______ _________ _______  _______  _______  _______ _________ _______  _______
  (  ____ \(  ___  )\__   __/(  ____ \(  ____ \(  ___  )(  ____ )\__   __/(  ____ \(  ____ \
  | (    \/| (   ) |   ) (   | (    \/| (    \/| (   ) || (    )|   ) (   | (    \/| (    \/
  | |      | (___) |   | |   | (__    | |      | |   | || (____)|   | |   | (__    | (_____
  | |      |  ___  |   | |   |  __)   | | ____ | |   | ||     __)   | |   |  __)   (_____  )
  | |      | (   ) |   | |   | (      | | \_  )| |   | || (\ (      | |   | (            ) |
  | (____/\| )   ( |   | |   | (____/\| (___) || (___) || ) \ \_____) (___| (____/\/\____) |
  (_______/|/     \|   )_(   (_______/(_______)(_______)|/   \__/\_______/(_______/\_______)


  */

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

    connection.query(query, function(err, rows){
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

      connection.query(query,function(err,rows){
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
  router.get("/categories", function(req, res){
    var query = "SELECT * FROM `Categories`";

    connection.query(query, function(err, rows){
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
  router.get("/categories/:idType", function(req, res){

    var query = "SELECT * FROM `Categories` WHERE ??=?";
    var table = ["type", req.params.idType];
    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
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

    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error": false, "Code" : 1, "CategoryTypesAndDevices": rows[0]}); // OK
      else
        res.json({"Error": true, "Code" : 102}); // Erreur
    });
  });

  /*

   _______  _______  _______  _______  _______  _       _________ _______
  (  ____ \(  ___  )(       )(       )(  ____ \( (    /|\__   __/(  ____ \
  | (    \/| (   ) || () () || () () || (    \/|  \  ( |   ) (   | (    \/
  | |      | |   | || || || || || || || (__    |   \ | |   | |   | (_____
  | |      | |   | || |(_)| || |(_)| ||  __)   | (\ \) |   | |   (_____  )
  | |      | |   | || |   | || |   | || (      | | \   |   | |         ) |
  | (____/\| (___) || )   ( || )   ( || (____/\| )  \  |   | |   /\____) |
  (_______/(_______)|/     \||/     \|(_______/|/    )_)   )_(   \_______)


  */

  /**
  * @api {post} /comments Publier un commentaire
  * @apiVersion 1.0.0
  * @apiName Publier un commentaire
  * @apiGroup Gestion Commentaires
  * @apiDescription Poste un commentaire sur une application.
  *
  * @apiParam {String} comment Commentaire de l'utilisateur
  * @apiParam {Number} rating Note donnée par l'utilisateur à l'application
  * @apiParam {Number} author ID de l'utilisateur
  * @apiParam {Number} application ID de l'application
  * @apiParam {Date} date Date du commentaire
  * @apiParam {String} title Titre du commentaire
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'adresse mail n'existe pas, 202 = Le mail de réinitialisation n'a pas pu être envoyé)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/comments",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??,??,??) VALUES (?,?,?,?,?,?)";
      var table = ["Comments","title", "comment","rating","author","application","date",
                  req.body.title, req.body.comment, req.body.rating, req.body.author, req.body.application,
                  (new Date ((new Date((new Date(new Date())).toISOString() )).getTime() - ((new Date()).getTimezoneOffset()*60000))).toISOString().slice(0, 19).replace('T', ' ')];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /**
  * @api {get} /comments/:idApp Liste des commentaires d'une application
  * @apiVersion 1.0.0
  * @apiName Liste des commentaires d'une application
  * @apiGroup Gestion Commentaires
  * @apiDescription Récupérer la liste des commentaires d'une application donnée.
  *
  * @apiParam {Number} idApp ID de l'application
  *
  * @apiSuccess (Succès) {Boolean} Error Retourne "false" en cas de réussite
  * @apiSuccess (Succès) {Number} Code Code d'erreur (1 = Aucune erreur détectée)
  * @apiSuccess (Succès) {Object[]} Comments Liste des commentaires
  *
  * @apiSuccessExample Succès - Réponse :
  *     {
  *       "Error": false,
  *       "Code" : 1,
  *       "Comments" : [
  *         {
  *           "idComment": 1,
  *           "comment": "Ceci est un commentaire",
  *           "rating": 5,
  *           "author": 1,
  *           "picture_profile": "Lien vers la photo de profil",
  *           "application": 1,
  *           "date": "2016-04-14T18:51:57.000Z",
  *           "title": "Titre"
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
  router.get("/comments/:idApp",function(req,res){
      var query = "SELECT * FROM ?? WHERE ??=? ORDER BY date DESC";
      var table = ["Comments","application",req.params.idApp];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1, "Comments" : rows});
          }
      });
  });

  /**
  * @api {post} /hasCommented Vérifier si un utilisateur a déjà commenté une application
  * @apiVersion 1.0.0
  * @apiName Vérifier si un utilisateur a déjà commenté une application
  * @apiGroup Gestion Commentaires
  * @apiDescription Permet de vérifier si un utilisateur a déjà commenté une application ou non.
  *
  * @apiParam {Number} idApplication ID de l'application
  * @apiParam {Number} idAuthor ID de l'auteur
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
  * @apiError (Erreur) {Number} Code Code d'erreur (102 = Erreur lors de la requête, 103 = L'utilisateur n'existe pas)
  *
  * @apiErrorExample Erreur - Réponse :
  *     {
  *       "Error" : true,
  *       "Code" : 102
  *     }
  *
  */
  router.post("/hasCommented", function(req,res){
      var query = "SELECT * FROM ?? WHERE ??=? AND ??=?";
      var table = ["Comments","application",req.body.idApplication,"author",req.body.idAuthor];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              if (rows.length == 0)
                res.json({"Error" : true, "Code" : 103}); // N'existe pas
              else
                res.json({"Error" : false, "Code" : 1, "Comments" : rows}); // OK
          }
      });
  });

  /**
  * @api {delete} /comment/:idComment Supprimer un commentaire
  * @apiVersion 1.0.0
  * @apiName Supprimer un commentaire
  * @apiGroup Gestion Commentaires
  * @apiDescription Supprimer un commentaire.
  *
  * @apiParam {Number} idComment ID du commentaire
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
  router.delete("/comment/:idComment",function(req,res){
      var query = "DELETE from ?? WHERE ??=?";
      var table = ["Comments","idComment",req.params.idComment];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /* ==================== FIN DU FICHIER ====================*/
}

module.exports = REST_ROUTER;
