
/**
 * Module dependencies.
 */

var express = require('express');
var cluster = require('cluster');
var app = module.exports = express.createServer();

var instagram = require('./instagram.js');

var port = 3000;

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.register(".html", require('jqtpl').express);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.listen(port);
});

app.configure('production', function(){
  app.use(express.errorHandler()); 

  cluster(app)
    .set('workers', 4)
    .use(cluster.pidfiles())
    .use(cluster.cli())
    .use(cluster.debug())
    .listen(port);
});

// Routes

app.get('/', function(req, res){
  instagram.popular(req, res);
});

app.get('/refresh', function(req, res) {
  instagram.refresh();
  res.redirect('/');
});

console.log("Express server listening on port %d in %s mode", port, app.settings.env);
