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
  router.get("/", function(req, res){

    res.json({
      "Message" : "Bienvenue sur l'API BeaVR."
    });
  });

  /**
  * Permet l'inscription
  * Met l'utilisateur au rang le plus pas il n'est pas possible de s'inscrire comme développeur
  **/
  router.post("/registration", function(req,res){

      var query = "INSERT INTO ?? (`email`, `password`, `lastname`, `firstname`, `role`) VALUES (?, ?, '', '', 4)";
      var table = ["Users", req.body.email, sha1(req.body.password)];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
          else
          {
            if (err.code == "ER_DUP_ENTRY")
              res.json({"Error" : true, "Code" : 101}); // L'utilisateur existe déjà
            else
              res.json({"Error" : true, "Code" : 100}); // Un des champs est mal renseigné
          }
      });
  });

  /**
  * Permet la connection d'un utilisateur
  **/
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

  /* ==================== PARTIE POUR LES UTILISATEURS ====================*/

  /**
  * Liste toute les utilisateurs
  * @TODO mettre une limite ?
  **/
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
  * Récupère les infos d'un utilisateurs quelconque
  **/
  router.get("/users/:idUsers", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Users", "idUsers", req.params.idUsers];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.length == 0)
          res.json({"Error" : true, "Code" : 103}); // L'utilise n'existe pas
        else
          res.json({"Error" : false, "Code" : 1, "Users" : rows}); // OK
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * Supprimer un utilisateur quelconque
  **/
  router.delete("/users/:idUsers", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Users", "idUsers", req.params.idUsers];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows.affectedRows == 1)
          res.json({"Error" : true, "Code" : 1}); // OK
        else
          res.json({"Error" : false, "Code" : 103}); // L'utilisateur n'existe pas
      }
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /**
  * Modifie un utilisateur
  **/
  //UPDATE `Users` SET `email`=[value-2],`password`=[value-3],`lastname`=[value-4],`firstname`=[value-5],`role`=[value-6], WHERE 1
  router.put("/users/:idUsers", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Users", "idUsers", req.params.idUsers];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
      {
        if (rows == 0)
          res.json({"Error" : true, "Code" : 103}); // L'utilisateur n'existe pas
        else
        {
          var query = "UPDATE Users SET `email`= ?,`password`= ?,`lastname`= ?,`firstname`= ?,`role`= ? WHERE `idUsers` = ?";
          var table = [req.body.email, sha1(req.body.password), req.body.lastname, req.body.firstname, req.body.role, req.params.idUsers];

          query = mysql.format(query, table);
          connection.query(query, function(err, rows){
          if (!err)
          {
            res.json({"Error" : false, "Code" : 1, "Users" : rows}); // OK
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
  * Ajoute un utilisateur et vérifie si il n'existe pas avant.
  **/
  router.post("/users", function(req,res){

      var query = "INSERT INTO ??(??,??) VALUES (?,?)";
      var table = ["Users","email","password", req.body.email, sha1(req.body.password)];

      query = mysql.format(query,table);

      connection.query(query,function(err,rows){
        if (!err)
          res.json({"Error" : false, "Code" : 1}); // OK
        else {
          if (err.code == "ER_DUP_ENTRY")
            res.json({"Error" : true, "Code" : 101}); // L'utilise existe déjà
          else
            res.json({"Error" : true, "Code" : 102}); // Erreur
      }
      });
  });

  /* ==================== PARTIE POUR LES APPLICATIONS  ====================*/

  /**
  * Liste toute les applications
  * @TODO mettre une limite ?
  **/
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
  * Récupère les infos d'une application
  **/
  router.get("/applications/:idApplication", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplications", req.params.idApplication];

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
  * Supprimer une application
  **/
  router.delete("/applications/:idApplication", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplications", req.params.idApplication];

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
  * Permet la création d'une application
  **/
  router.post("/applications", function(req,res){

      var query = "INSERT INTO ??(??, ??, ??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      var table = ["Applications", "name", "description", "price", "headDevice", "handDevice", "category", "author", "url",
      req.body.name, req.body.description, req.body.price, req.body.headDevice, req.body.handDevice, req.body.category, req.body.author, req.body.url];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if (!err)
            res.json({"Error" : false, "Code" : 1}); // OK
          else
            res.json({"Error" : true, "Code" : 102}); // Erreur
      });
  });

  /* ==================== PROGRESSION IN GAME  ====================*/

  /**
  * Récupère les différentes progression d'une applications
  **/
  router.get("/progression/:idApplication", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Progression", "idApplication", req.params.idApplication];

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
  * Update une progression d'une application
  **/
  router.put("/progression/:idApplication", function(req, res){

    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["Progression", "hashProgression" , req.body.hashProgression, "idApplication", req.param.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error" : false, "Code" : 1, "Progression" : rows}); // OK
      else
        res.json({"Error" : true, "Code" : 102}); // Erreur
    });
  });

  /* ==================== GESTION DES DEVICES  ====================*/

  /**
  * Récupère la liste des devices compatibles
  **/
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
  * Récupère les infos d'un device quelconque
  **/
  router.get("/devices/:idDevices", function(req, res){

    var query = "SELECT * FROM Devices WHERE ??=?";
    var table = ["idDevices", req.params.idDevices];

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
  * Ajoute un device.
  **/
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
  * Supprime un device.
  **/
  router.delete("/devices/:idDevices", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Devices", "idDevices", req.params.idDevices];

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
  * Update un device
  **/
  router.put("/devices/:idDevice", function(req, res){

    var query = "UPDATE ?? SET ?? = ?, ?? = ? WHERE ?? = ?";
    var table = ["Devices", "name", req.body.name, "image", req.body.image, "idDevices", req.params.idDevice];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error" : false, "Code" : 1}); // OK
      else
        res.json({"Error" : true, "Code" : 102}); // Error
    });
  });
  /* ==================== GESTION DES TYPES DE CATEGORIES (Sciences / Sports) ====================*/

  /**
  * Récupère tout les catégories
  **/
  router.get("/categoryTypes", function(req, res){
    var query = "SELECT * FROM `CategoryTypes`";

    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error": false, "Code" : 1, "Categories": rows}); // OK
      else
        res.json({"Error": true, "Code" : 102}); // Error
    });
  });

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

  /* ==================== GESTION DES CATEGORIES  ====================*/

  /**
  * Récupère tout les catégories
  **/
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
  * Récupère les types de catégories pour une catégorie spécifique
  **/
  router.get("/categories/:type", function(req, res){

    var query = "SELECT * FROM `Categories` WHERE ??=?";
    var table = ["type", req.params.type];
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
  * Récupère les categorytypes et les devices
  **/
  router.get("/categorytypesanddevices", function(req, res){
    var query = "SELECT * FROM `AllCategoryTypesAndDevices`";

    connection.query(query, function(err, rows){
      if (!err)
        res.json({"Error": false, "Code" : 1, "CategoryTypesAndDevices": rows[0]}); // OK
      else
        res.json({"Error": true, "Code" : 102}); // Erreur
    });
  });

  /* ==================== VERIF EXISTENCE EMAIL =============*/

  /**
  * Vérifie l'existence d'une adresse mail
  **/
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
  * Vérifie l'existence d'une adresse mail et modifie son mot de passe si cette derniere existe
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

  /* COMMENTS */

  router.post("/publishComment",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??,??) VALUES (?,?,?,?,?)";
      var table = ["Comments","comment","rating","author","application","date",
                  req.body.comment,req.body.rating,req.body.idUser, req.body.idApp, 
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

  router.get("/getComments/:idApp",function(req,res){
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

  router.delete("/removeComment/:idComment",function(req,res){
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

  /* FEEDBACK */

  router.post("/sendFeedback",function(req,res){
      var query = "INSERT INTO ??(??,??,??,??) VALUES (?,?,?,?)";
      var table = ["Feedbacks","user","object","description","recontact",req.body.idUser,req.body.object,req.body.description,req.body.recontact];

      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
            console.log(err);
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

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

  /* APPLICATION VALIDATION (modify the status if not correct) */

  router.put("/validateApplicationSubmission",function(req,res){
      var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      var table = ["applications","state","1","idApplication",req.body.idApp];
      query = mysql.format(query,table);
      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Code" : 102});
          } else {
              res.json({"Error" : false, "Code" : 1});
          }
      });
  });

  /* APPLICATION INFORMATIONS */

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

  /* APPLICATION SUBMISSION (change le state lors de l'insertion à "non validé") */

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


  /* ==================== FIN DU FICHIER ====================*/
}

module.exports = REST_ROUTER;
