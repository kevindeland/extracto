
// just for messing around with data structure flow and transformations

var structure = {

    'S': [ ['NP', 'VP'] ],
    'NP': [ ['NNP'], ['DT', 'NN'] ],
    'VP': [ ['VBZ', 'NP'] ],
    'NNP': [ ['John'] ],
    'VBZ': [ ['is'] ],
    'DT': [ ['a'] ],
    'NN': [ ['cat'] ]
}

/**
 * takes a part of speech and randomizes a new one based on the structure
 */
function substituteRandom(partOfSpeech) {
    
    var possibleSubs = structure[partOfSpeech];
    
    // if no possible substitutions, this is an atom, so return it 
    if(!possibleSubs) {
	return partOfSpeech;
    }
    
    // pick a random next choice from arrays
    var randomSub = pickRandomSubstitution(possibleSubs);
    console.log('replacing', partOfSpeech, 'with', randomSub);
    
    var newGuy= [];
    randomSub.forEach(function(part) {
	console.log('diving into', part);
	newGuy.push(substituteRandom(part));
    });
    return newGuy;
    
    
}

/**
 * choose a random substition... nonweighted
 */
function pickRandomSubstitution(choiceArray) {
    var randomNonweightedIndex = Math.floor((Math.random() * choiceArray.length));
    return choiceArray[randomNonweightedIndex];
}


//console.log(JSON.stringify(substituteRandom('S')));

/*
console.log(substituteRandom('NP'));
console.log(substituteRandom('NP'));
console.log(substituteRandom('NP'));
console.log(substituteRandom('NNP'));
*/
//console.log(substituteRandom('John'));


