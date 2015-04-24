var url = require('url')
  , https = require('https')
  , querystring= require('querystring')
  , xmlescape = require('xml-escape')
  , reParser = require('./reParser');
;

var service_url = 'https://gateway.watsonplatform.net/laser/service/api/v1/sire/6b5a92a6-9fbd-4d8b-a60f-968076b36b3c';//'<service_url>';
var service_username = '97300eec-58ea-437a-89a3-14252b00095d';//'<service_username>';
var service_password = 'zcmIklvE4MJv';//'<service_password>';
var auth = 'Basic ' + new Buffer(service_username + ':' + service_password).toString('base64');

function Caller(config) {
    this.url = config.url;
    this.username = config.username;
    this.pw = config;
}

Caller.prototype.callService = function(text, callback) {

    var auth = 'Basic ' + new Buffer(this.username + ':' + this.pw).toString('base64');
//    var parts = url.parse(this.url);
    var parts = url.parse(service_url);

    var options = { 
	host: parts.hostname,
	port: parts.port,
	path: parts.pathname,
	method: 'POST',
	headers: {
	    'Content-Type'  :'application/x-www-form-urlencoded',
//	    'Content-Type'  :'application/json',
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
	    callback(null, resp_string);
	});
    });

    watson_req.on('error', function(e) {
	console.log('error');
	callback(e);
    });
    

    var body = {txt: text, sid: 'ie-en-news', rt: 'xml'};

    var sendMe = querystring.stringify(body);
    console.log(sendMe);
    
    watson_req.write(sendMe);
    watson_req.end();
}

Caller.prototype.wtf = function(text, callback){

    console.log('testing', text);
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
	    console.log('this is the end');
	    console.log(resp_string);
	    //	    callback(null, resp_string);
	    reParser.parseIntoTree(resp_string, function(err, result) {
		if(err) {
		    callback(err);
		    return;
		}
		console.log(result);
		var count = 0;
		result.forEach(function(tree) {
		    reParser.classify(tree);
		    count++;
		    if(count == result.length) {
			callback(null, result);
			//return res.render('index',{'xml':JSON.stringify(result), 'text':req.body.txt})	    
	//		return res.render('index',{'xml':xmlescape(resp_string), 'text':req.body.txt})	 	
		    }
		});
	    });
	    

	})

    });

    watson_req.on('error', function(e) {
	callback(e);
    });
    var sendBody = {txt: text, sid: 'ie-en-news', rt: 'xml'};
    var sendMe = querystring.stringify(sendBody) ;
    console.log(sendMe);
    // Whire the form data to the service
    watson_req.write(sendMe);
    watson_req.end();
}

module.exports = {
    Caller:  Caller,
    wtf: Caller.prototype.wtf
    
}
