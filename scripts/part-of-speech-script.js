var Caller = require('../lib/caller').Caller;

var service_url = 'https://gateway.watsonplatform.net/laser/service/api/v1/sire/6b5a92a6-9fbd-4d8b-a60f-968076b36b3c';//'<service_url>';
var service_username = '97300eec-58ea-437a-89a3-14252b00095d';//'<service_username>';
var service_password = 'zcmIklvE4MJv';//'<service_password>';

var C = new Caller({
    url: service_url, 
    username: service_username, 
    pw: service_password
});

var parser = require('../lib/reParser');


var sentences = [

    'Snape kills Dumbledore.',
    'Snape killed Dumbledore.',
    'Snape is killing Dumbledore.',
    'Snape will kill Dumbledore.',
    'Snape is going to kill Dumbledore.',
    'Snape has killed Dumbledore.',
    'Dumbledore was killed by Snape.'
]

var hey = [
    'For reasons not immediately revealed, the spell with which Voldemort tried to kill Harry rebounded.',
    'Bills on ports and immigration were submitted by Senator Brownback, Republican of Kansas.'
]

sentences.forEach(function(sentence) {


    C.simpleRequest(sentence, function(err, response) {
	
	parser.parseIntoTree(response, function(err, tree) {
	    lookForNPVP(tree);
//	    console.log(JSON.stringify(tree));
	});
	
	parser.getDoc(response, function(err, doc) {
	    var sent = doc.sents[0].sent[0];

//	    console.log(JSON.stringify(doc.relations));
	    var dp = sent.dependency_parse[0];
//	    console.log(dp);
	    var stanford = sent.usd_dependency_parse[0]

//	    console.log(tokenizeStanford(stanford));
	});
	
    });

});


function lookForNPVP (tree) {
//    console.log(tree);
    var last = {
        type: null
    };
    
//    console.log(tree.length);
    tree.forEach(function(pos) {

        if(last.type == 'NP' && pos.type == 'VP') {

            processNPVP({
                NP: last,
                VP: pos
            });
        }

        if(pos.children)
            lookForNPVP(pos.children);
        
        last = pos;
    });
}

function processNPVP (npvp) {
    console.log('found a NP VP!', JSON.stringify(npvp.NP), JSON.stringify(npvp.VP));
    
}

/**
 * breaks down the USD dependency parse tree into individual components
 */
function tokenizeStanford (sentence) {
    
    var tokens = sentence.split(' ');
    var bigTokens = [];
    var currentToken;

    for(var i = 0; i < tokens.length; i++) {
	switch (i % 4) {
	case 0: 
	    currentToken = {text: tokens[i]}
	    break;
	case 1: 
	    currentToken.POS = tokens[i];
	    break;
	case 2:
	    currentToken.num = tokens[i];
	    break;
	case 3:
	    currentToken.POS2 = tokens[i];
	    bigTokens.push(currentToken);
	    break;
	}
    }

    return bigTokens;
}
