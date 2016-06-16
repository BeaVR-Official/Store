var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
var md5 = require('MD5');
var sha1 = require('sha1');
var rest = require("./REST.js");
var app  = express();


app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
});

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool      =    mysql.createPool({
        connectionLimit : 100000,
        host     : '5.196.88.52', //localhost
        //host : 'localhost',
        // user     : 'connect', //root
        user     : 'pictar', //root
        password : 'pictartheboss', //root
        //password : '', //root
        //port     : '3306', //8889
        port : 3306,
        //database : 'beavr_dev', //restful_api_demo
        database : 'beavr_new', //restful_api_demo
        debug    :  false
    });

    pool.getConnection(function(err,connection){
        if(err) {
          //self.stop(err);
          console.log(err);
          //self.connectMysql(); //my modif
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      //app.use(bodyParser.urlencoded({ extended: true }));
      //app.use(bodyParser.json());

      var router = express.Router();
      app.use('/api', router);

			var rest_router = new rest(router, connection, sha1);

      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3000,function(){
          console.log("All right ! I'm using port 3000.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL \n" + err);
    //process.exit(1);
    self.connectMysql();//my modifes
}

new REST();
