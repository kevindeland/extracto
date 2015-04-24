var Randomizer = require('../lib/randomizer').Randomizer;
var randomizer = require('../lib/randomizer');
var expect = require('chai').expect;

// just for messing around with data structure flow and transformations
var simple = {

    'S': [ ['NP', 'VP'] ],
    'NP': [ ['NNP'], ['DT', 'NN'] ],
    'VP': [ ['VBZ', 'NP'] ],
    'NNP': [ ['John'] ],
    'VBZ': [ ['is'] ],
    'DT': [ ['a'] ],
    'NN': [ ['cat'] ]
}

var rhcp = {
    'root': [['S']],
    'NP': [ ['NN'], ['DT', 'ADJP', 'NN'], ['PRP'] ],
    'S': [ ['NP', 'VP'], ['NP', 'ADVP', 'VP'], ['S', 'CC', 'S'] ],
    'VP': [ ['VBZ', 'PP'], ['VBZ', 'NP'] ],
    'PP' : [ ['TO', 'NP'] ],
    'ADJP': [['RB', 'JJ'] ],
    'ADVP': [ ['RB'] ],
    'NN': [ ['Destruction'], ['road'], ['creation'] ],
    'VBZ': [ ['leads'], ['breathes'] ],
    'TO' : [ ['to'] ],
    'DT': [ ['a'] ],
    'RB': [ ['very'], ['also'] ],
    'JJ': [ ['rough'] ],
    'CC': [ ['but'] ],
    'PRP': [ ['it'] ]
}

//var R = new Randomizer(rhcp);


describe('Randomizer', function() {

    describe('endpoint', function() {
	it('should return itself', function() {
	    
	    var word = randomizer.substituteRandom(simple, 'John');
	    
	    expect(word).to.equal('John');
	});
    });

    describe('single option', function() {
	it('should get John', function() {
	    
	    var NNP = randomizer.substituteRandom(simple, 'NNP');
	    expect(NNP[0]).to.equal('John');
	});
    });
    
    describe('randomSentence', function() {
	it('should generate a random sentence', function() {
	    
	    var randomSentence = randomizer.substituteRandom(rhcp, 'S');
	    console.log(randomSentence);

	    var formatted = randomizer.formatSentence(randomSentence);
	    console.log(formatted);
	});
    });
});


//console.log(JSON.stringify(substituteRandom('S')));

/*
console.log(substituteRandom('NP'));
console.log(substituteRandom('NP'));
console.log(substituteRandom('NP'));
console.log(substituteRandom('NNP'));
*/
//console.log(substituteRandom('John'));


