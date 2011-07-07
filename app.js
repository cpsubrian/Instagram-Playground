
/**
 * Module dependencies.
 */

var express = require('express');
var cluster = require('cluster');
var live = require('cluster-live');
var app = module.exports = express.createServer();
var io = require('socket.io').listen(app);

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
  cluster(app)
   .set('workers', 1)
   .use(cluster.pidfiles())
   .use(cluster.cli())
   .listen(port);
});

app.configure('production', function(){
  app.use(express.errorHandler()); 

  cluster(app)
    .set('workers', 4)
    .use(cluster.pidfiles())
    .use(cluster.cli())
    .use(cluster.stats({ connections: true, lightRequests: true }))
    .use(live({user: 'admin', pass: 'admin'}))
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

// Sockets
io.sockets.on('connection', function(socket) {
  socket.on('photo hover', function(data) {
    var photo = instagram.getPhoto(parseInt(data.index));
    socket.emit('photo details', photo);
  });
});

console.log("Express server listening on port %d in %s mode", port, app.settings.env);
