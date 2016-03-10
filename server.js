var express = require('express');
var app = express();
var db = require('./data-model');
var bodyParser = require('body-parser');

app.use(bodyParser.json({ extended: false }));

// Serve anything under the src directory as a static file
app.use(express.static(__dirname + '/src'));

// A getter for all the paths. They will be listed in reverse order of createdAt for convenience
app.get('/paths', function(request, response) {
  db.Path.findAll({
    order: [['createdAt', 'DESC']]
  })
  .then(
    function(paths) {
      response.json(paths);
    },
    function(error) {
      response.error(error.message);
    }
  )
});

// A getter for a single path by its ID. This will include the Points of the path
app.get('/paths/:id', function(request, response) {
  var id = Number(request.params.id);
console.log(id);  
  db.Path.findOne({
    where: {id: id},
    include: [db.Point]
  })
  .then(
    function(path) {
      response.json(path);
    },
    function(error) {
      response.error(error.message);
    }
  );
});

// Catch-all route: if nothing else matches, respond with index.html
app.get('/*', function(request, response) {
  response.sendFile(__dirname + '/src/index.html');
});

app.post('/create', function(request, response) {
   db.Path.create({
     title: request.body.title,
     points: request.body.points.map( point => ({latitude: point.position.lat, longitude: point.position.lng}) )
   }, {
     include: db.Point
   }).then(
     function(path) {
       response.json(path);
     }
  );
})

// This line starts the web server
app.listen(process.env.PORT || 8080, function() {
  console.log('server started');
});
