var mysql = require("mysql");
function REST_ROUTER(router, connection, sha1){
  var self = this;
  self.handleRoutes(router, connection, sha1);
}

REST_ROUTER.prototype.handleRoutes = function(router, connection, sha1){
  router.get("/", function(req, res){

    res.json({
      "Message" : "Bienvenu sur notre API"
    });
  });

  /**
  * Permet l'inscription
  * Met l'utilisateur au rang le plus pas il n'est pas possible de s'inscrire comme développeur
  **/
  router.post("/inscription", function(req,res){

      var query = "INSERT INTO ?? (`email`, `password`, `lastname`, `firstname`, `role`) VALUES (?, ?, '', '', 4)";
      var table = ["Users", req.body.email, sha1(req.body.password)];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if(err) {
            if (err.code = "ER_DUP_ENTRY")
              res.json({"Error" : true, "Message" : "L'addresse mail existe déjà"});
            else{
              console.log(err);
              res.json({"Error" : true, "Message" : "Insertion impossible nous avons rencontré un problème"});
            }
          } else {
              res.json({"Error" : false, "Message" : "User Added !"});
          }
      });
  });

  /**
  * Permet la connection d'un utilisateur
  **/
  router.post("/connection", function(req,res){

      var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
      var table = ["Users","email", req.body.email, "password", sha1(req.body.password)];

      query = mysql.format(query,table);

      connection.query(query,function(err,rows){
          if(err) {
              res.json({"Error" : true, "Message" : "La connection à rencontré une erreur"});
          } else {
              if (rows.length == 0)
                res.json({"Error" : true, "Message" : "Le compte n'existe pas"});
              else
                res.json({"Error" : false, "Message" : "Le compte existe", "Data" : rows});
          }
      });
  });

  /* ==================== PARTIE POUR LES UTILISATEURS ====================*/

  /**
  * Liste toute les utilisateurs
  * @TODO mettre une limite ?
  **/
  router.get("/users", function(req, res){
    var query = "SELECT * FROM `Users`";

    connection.query(query, function(err, rows){
      if (err){
        res.json({"Error": true, "Message": "Error lors de la requête"});
      } else {
        res.json({"Error": false, "Message": rows});
      }
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
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        if (rows.length == 0)
          res.json({"Error" : true, "Message" : "Le compte n'existe pas"});
        else {
          res.json({"Error" : false, "Message" : "Sucess", "Users" : rows});
        }
      }
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
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        if (rows.affectedRows == 1)
          res.json({"Error" : true, "Message" : "L'utilisateur a bien été supprimé"});
        else {
          res.json({"Error" : false, "Message" : "L'utilisateur n'a pas pu être supprimer"});
        }
      }
    });
  });

  /**
  * Ajoute un utilisateur et vérifie si il n'existe pas avant.
  **/
  router.post("/users", function(req,res){

      var query = "INSERT INTO ??(??,??) VALUES (?,?)";
      var table = ["user_login","user_email","user_password", req.body.email, sha1(req.body.password)];

      query = mysql.format(query,table);

      console.log("Query : " + query);
      connection.query(query,function(err,rows){
          if(err) {
            console.log(err);
              res.json({"Error" : true, "Message" : "Error executing MySQL query"});
          } else {
              res.json({"Error" : false, "Message" : "User Added !"});
          }
      });
  });

  /* ==================== PARTIE POUR LES APPLICATIONS  ====================*/

  /**
  * Liste toute les applications
  * @TODO mettre une limite ?
  **/
  router.get("/applications", function(req, res){
    var query = "SELECT * FROM `Applications`";

    connection.query(query, function(err, rows){
      if (err){
        res.json({"Error": true, "Message": "Error lors de la requête"});
      } else {
        res.json({"Error": false, "Message": rows});
      }
    });
  });

  /**
  * Récupère les infos d'un application
  **/
  router.get("/applications/:idApplications", function(req, res){

    var query = "SELECT * FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplications", req.params.idApplications];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        if (rows.length == 0)
          res.json({"Error" : true, "Message" : "L'application n'existe pas"});
        else {
          res.json({"Error" : false, "Message" : "Sucess", "Applications" : rows});
        }
      }
    });
  });

  /**
  * Supprimer un utilisateur quelconque
  **/
  router.delete("/applications/:idApplications", function(req, res){

    var query = "DELETE FROM ?? WHERE ??=?";
    var table = ["Applications", "idApplications", req.params.idApplications];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        if (rows.affectedRows == 1)
          res.json({"Error" : false, "Message" : "L'application a bien été supprimée"});
        else {
          res.json({"Error" : true, "Message" : "L'application n'a pas pu être supprimée"});
        }
      }
    });
  });

  /**
  * Permet la création d'une application
  * @TODO fixe le problème de data dans la db
  **/
  router.post("/applications", function(req,res){

      var query = "INSERT INTO ?? (`name`, `description`, `price`, `headDevice`, `handDevice`, `category`, `author`, `url`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      var table = ["Applications", req.body.name, req.body.description, req.body.price, req.body.headDevice, req.body.handDevice, req.body.category, req.body.author, req.body.url];

      query = mysql.format(query,table);

      connection.query(query, function(err,rows){
          if(err) {
              console.log(err);
              res.json({"Error" : true, "Message" : "Insertion impossible nous avons rencontré un problème"});
          } else {
              res.json({"Error" : false, "Message" : "Application added !", "Data": rows});
          }
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
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        if (rows.length == 0)
          res.json({"Error" : true, "Message" : "Aucune progression n'a ete répertorié"});
        else {
          res.json({"Error" : false, "Message" : "Sucess", "Progression" : rows});
        }
      }
    });
  });

  /**
  * Update une progression d'une application
  **/
  router.put("/progression", function(req, res){

    var query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    var table = ["Progression", "hashProgression" , req.body.hashProgression, "idApplication", req.body.idApplication];

    query = mysql.format(query, table);
    connection.query(query, function(err, rows){
      if (err){
        res.json({"Error" : true, "Message" : "Error executing MYSQL Query"});
      } else {
        res.json({"Error" : false, "Message" : "Sucess", "Progression" : rows});
      }
    });
  });

  /* ==================== FIN DU FICHIER ====================*/
}

module.exports = REST_ROUTER;
