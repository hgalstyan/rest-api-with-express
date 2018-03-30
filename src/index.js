'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const seeder = require('mongoose-seeder');
const jsonParser = require("body-parser").json;
const data = require('./data/data.json');

const app = express();

//mongoose connection
mongoose.connect('mongodb://localhost:27017/courses')
        .then(function(){
          console.log('Dropping database & adding seed data');
      		seeder.seed(data)
      			.then(() => {
      				console.log('Successfully seeded database');
      			})
      			.catch(error => {
      				console.error('Error seeded database');
      				console.error(error);
      			});
        });
const db = mongoose.connection;
db.on("error", function(err){
	console.error("connection error:", err);
});

db.once("open", function(){
	console.log("db connection successful");
});

app.use(jsonParser())
// morgan gives us http request logging
app.use(morgan('dev'));

app.use('/api', routes);

// set our port
app.set('port', process.env.PORT || 5000);


// setup our static route to serve files from the "public" folder
//app.use('/', express.static('public'));

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error:{
      message: err.message
    }
  });
});


// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
