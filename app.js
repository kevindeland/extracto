// app.js
// This file contains the server side JavaScript code for your application.
// This sample application uses express as web application framework (http://expressjs.com/),
// and jade as template engine (http://jade-lang.com/).

var express = require('express');
var https = require('https');
var url = require('url');
var querystring = require('querystring');
var xmlescape = require('xml-escape');
var reParser = require('./lib/reParser');
var bodyParser = require('body-parser');
//var parseString = require('xml2js').parseString;
var fs = require('fs');

// setup middleware
var app = express();
//app.use(express.errorHandler());
app.use(bodyParser.urlencoded({extended: false}));// app.use(express.urlencoded()); // to support URL-encoded bodies
app.use(bodyParser.json());
//app.use(app.router);

app.use(express.static(__dirname + '/public')); //setup static public directory
app.set('view engine', 'jade');
app.set('views', __dirname + '/views'); //optional since express defaults to CWD/views

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// defaults for dev outside bluemix
var service_url = 'https://gateway.watsonplatform.net/laser/service/api/v1/sire/6b5a92a6-9fbd-4d8b-a60f-968076b36b3c';//'<service_url>';
var service_username = '97300eec-58ea-437a-89a3-14252b00095d';//'<service_username>';
var service_password = 'zcmIklvE4MJv';//'<service_password>';

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
if (process.env.VCAP_SERVICES) {
  console.log('Parsing VCAP_SERVICES');
  var services = JSON.parse(process.env.VCAP_SERVICES);
  //service name, check the VCAP_SERVICES in bluemix to get the name of the services you have
  var service_name = 'relationship_extraction';
  
  if (services[service_name]) {
    var svc = services[service_name][0].credentials;
    service_url = svc.url;
    service_username = svc.username;
    service_password = svc.password;
  } else {
    console.log('The service '+service_name+' is not in the VCAP_SERVICES, did you forget to bind it?');
  }

} else {
  console.log('No VCAP_SERVICES found in ENV, using defaults for local development');
}

console.log('service_url = ' + service_url);
console.log('service_username = ' + service_username);
console.log('service_password = ' + new Array(service_password.length).join("X"));

var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

// render index page
app.get('/', function(req, res){
    res.render('index');
});


var caller = require('./lib/caller');
var treeToMap = require('./lib/treeToMap').treeToMap;
var randomizer = require('./lib/randomizer');

app.post('/wtf', function(req, res) {
    console.log('querying for', req.body.txt);
    
    caller.wtf(req.body.txt, function(err, tree) {
	if(err)  {
	    res.send(err);
	    return;
	}
	
	treeToMap(tree[0], function(err, map) {
	    if(err) {
		res.send(err);
		return;
	    }
	    
	    var newSong = randomizer.substituteRandom(map, 'root');

	    res.send(newSong);
	});
    });
});

// Handle the form POST containing the text to identify with Watson and reply with the language
app.post('/', function(req, res){
    console.log(req.body);

    var parts = url.parse(service_url);

    // create the request options from our form to POST to Watson
    var options = { 
	host: parts.hostname,
	port: parts.port,
	path: parts.pathname,
	method: 'POST',
	headers: {
	    'Content-Type'  :'application/x-www-form-urlencoded',
	    'X-synctimeout' : '30',
	    'Authorization' :  auth }
    };
    console.log(options);

    // Create a request to POST to Watson
    var watson_req = https.request(options, function(result) {
	result.setEncoding('utf-8');
	var resp_string = '';

	result.on("data", function(chunk) {
	    resp_string += chunk;
	});

	result.on('end', function() {
	    console.log(resp_string);
	    reParser.parseIntoTree(resp_string, function(err, result) {
		console.log(result);
		var count = 0;
		result.forEach(function(tree) {
//		    reParser.classify(tree);
		    count++;
		    if(count == result.length) {
			
			
			return res.render('index',{'xml':JSON.stringify(result), 'text':req.body.txt})
		    }
		});
	    });
	    

	});

    });

    watson_req.on('error', function(e) {
	return res.render('index', {'error':e.message})
    });

    var sendMe = querystring.stringify(req.body) ;
    console.log(sendMe);
    // Whire the form data to the service
    watson_req.write(sendMe);
    watson_req.end();
});

fs.readdirSync('./routes').forEach(function(file) {
    if(file.substr(-3) == '.js') {
	var router = express.Router();
	var prefix = file.substring(0, file.length-3);
	app.use('/' + prefix, require('./routes/' + prefix).controller(router));
    }
});


// The IP address of the Cloud Foundry DEA (Droplet Execution Agent) that hosts this application:
var host = (process.env.VCAP_APP_HOST || 'localhost');
// The port on the DEA for communication with the application:
var port = (process.env.VCAP_APP_PORT || 3000);
// Start server
app.listen(port, host);
console.log('listening on port', port);
