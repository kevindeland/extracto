

function Randomizer(structure) {
    this.structure = structure;
}


/**
 * takes a part of speech and randomizes a new one based on the structure
 */
var substituteRandom = function(structure, partOfSpeech) {
    
    var possibleSubs = structure[partOfSpeech];
    
    
    // if no possible substitutions, this is an atom, so return it 
    if(!possibleSubs) {
	return partOfSpeech;
    }
    
    // pick a random next choice from arrays
    var randomSub = pickRandomSubstitution(possibleSubs);
    console.log('replacing', partOfSpeech, 'with', randomSub);
    
    // dammit periods
    if(partOfSpeech == '.' && randomSub.length == 1 && randomSub[0] == '.')
	return '.';

    if(partOfSpeech == ',' && randomSub.length == 1 && randomSub[0] == ',')
	return ',';
    
    var newGuy= [];
    var self = this;
    randomSub.forEach(function(part) {
	console.log('diving into', part);
	// newGuy.push(self.substituteRandom(part));
	newGuy.push(substituteRandom(structure, part));
    });
    return newGuy;
    
}

var formatSentence = function(arrays) {
    var sentence = '';
    
    var first = true;
    
    arrays.forEach(function(subArray) {
	
	subArray.forEach(function(subsub) {
	    if(typeof subsub == 'object')
		subsub.forEach(function(subsubsub) {
		    sentence += (first ? '' : ' ') + subsubsub;
		    first = false;
		});
	    else {
		sentence += (first ? '' : ' ') + subsub;
		first = false;
	    }

	});
    });
    sentence += '.';

    return sentence;
}


/**
 * choose a random substition... nonweighted
 */
function pickRandomSubstitution (choiceArray) {
    var randomNonweightedIndex = Math.floor((Math.random() * choiceArray.length));
    return choiceArray[randomNonweightedIndex];
}


module.exports = {
    Randomizer: Randomizer,
    substituteRandom: substituteRandom,
    formatSentence: formatSentence
}
