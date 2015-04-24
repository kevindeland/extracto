var Caller = require('../lib/caller').Caller;
var expect = require('chai').expect;

var service_url = 'https://gateway.watsonplatform.net/laser/service/api/v1/sire/6b5a92a6-9fbd-4d8b-a60f-968076b36b3c';//'<service_url>';
var service_username = '97300eec-58ea-437a-89a3-14252b00095d';//'<service_username>';
var service_password = 'zcmIklvE4MJv';//'<service_password>';

var C = new Caller({
    url: service_url, 
    username: service_username, 
    pw: service_password
});

var fox = 'The quick brown fox jumped over the lazy dog.';
var destruction = 'Destruction leads to a very rough road but it also breathes creation.';
var dylan = 'How many roads must a man walk down before you call him a man?';

describe('Caller', function() {

    describe('anything', function() {
	this.timeout(4000);

	it('should do something', function(done) {
	    
	    C.callService(destruction, function(err, result) {
		if(err){
		    console.log(err);
		    return;
		}
		console.log('this is the result');
		console.log(result);
		done();
	    });
	});
    });

    describe('wtf', function(){
	this.timeout(4000);
	
	it('should wtf', function(done){
	    C.wtf({body:  {txt: destruction, sid: 'ie-en-news', rt: 'xml'}} , function(err, res) {
		if(err) {
		    console.log('err wtf');
		} else {
		    console.log('this is the result');
		    console.log(JSON.stringify(res))
		}
		done();
	    });
	});
    });
});


var treeToMap = require('../lib/treeToMap').treeToMap;
var randomizer = require('../lib/randomizer');

var californication = 'Psychic spies from China try to steal your mind\'s elation.';
var edge = 'It\'s the edge of the world and all of Western Civilization';

var rolling = "Once upon a time you dressed so fine Threw the bums a dime in your prime, didn't you?"

describe('TreeToMap', function() {
    
    describe('ttm', function() {
	
	it('should do somehthing', function(done) {
	    this.timeout(6000);
	    
	    C.wtf(californication, function(err, result) {
		if(err){
		    console.log(err);
		    return;
		}
		console.log('this is the result');
		console.log(result);
		
		treeToMap(result[0], function(err, map) {
		    console.log('this it the map');
		    console.log(map);

		    
		    var newSong = randomizer.substituteRandom(map, 'NN');
		    
		    console.log(randomizer.formatSentence(newSong));
		    
		    done();
		});
		
	    });
	});
    });
});



