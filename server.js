// server.js

	// set up ========================
	var express  = require('express');
	var app      = express(); 								        // create our app w/ express
	var mongoose = require('mongoose'); 					    // mongoose for mongodb
	var morgan = require('morgan'); 			            // log requests to the console (express4)
	var bodyParser = require('body-parser'); 	        // pull information from HTML POST (express4)
	var methodOverride = require('method-override');  // simulate DELETE and PUT (express4)

	// configuration =================

  var connectUrl = 'mongodb://chartr:chartr@' + process.env.IP + ':27017/chartr';
	mongoose.connect(connectUrl); 	// connect to mongoDB database on modulus.io

  mongoose.connection.on('error', function(err) {
    console.error('MongoDB error: %s', err);
  });
  
	app.use(express.static(__dirname + '/public')); 				        // set the static files location /public/img will be /img for users
	app.use(morgan('dev')); 										                    // log every request to the console
	app.use(bodyParser.urlencoded({'extended':'true'})); 			      // parse application/x-www-form-urlencoded
	app.use(bodyParser.json()); 									                  // parse application/json
	app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
	app.use(methodOverride());

	// listen (start app with node server.js) ======================================
	app.listen(process.env.PORT);
	console.log("App listening on port " + process.env.PORT);

  // Define model
  var Chart = mongoose.model('Chart', {
      
      // User information
      email : String,
      privateKey : { type: [String], index: true },
      publicKey : { type: [String], index: true },
      
      // Information about the chart
      title : String,
      description : String,
      visible : Boolean,
      tags : String,
      
      // Data Stream information
      streamType : String,
      streamUrl : String,
      xAxisField : String,
      yAxisFields : String
  });
  
  // Routes
  
  app.get('/api/chart/:publicKey', function(req, res) {
  
    var queryModel = {
      publicKey : req.params.publicKey
    };
    
    res.contentType('application/json');
    Chart.findOne(queryModel, function( err, chart ) {
      if ( err ) 
        return res.send(err);
        
      if ( chart != null ) {
        //res.writeHead(200, { 'Content-Type': 'application/json' });
        res.json(chart);
        res.status(200).end();
      } else {
        console.log(req.params.publicKey + " not found!");
        res.status(404).end('Not found');
      }
      res.end();
    });
  });
  
  app.post('/api/chart', function(req, res) {

    res.contentType('application/json');
    var chart = req.body;
    Chart.create(chart, function(err, chart) {
      if ( err ) 
        return res.status(500).end(err);
      res.json(chart);
      
      res.status(200).end();
    });
  });
  
  // application -------------------------------------------------------------
	app.get('*', function(req, res) {
		res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});