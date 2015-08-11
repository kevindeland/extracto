var parseString = require('xml2js').parseString;

var parse = function(xml, callback) {
    parseString(xml, function(err, result) {
	if(err) {
	    callback(err);
	    return;
	}
	callback(null, result);
    });
};

var getDoc = function(xml, callback) {
    parse(xml, function(err, result) {
	if(err) {
	    callback(err);
	    return;
	}
	var doc = result.rep.doc[0];
	for(var key in doc) {
//	    console.log(key, doc[key]);
	}
	callback(null, doc);
    });
};

var getSents = function(xml, callback) {
    getDoc(xml, function(err, result) {
	if(err) {
	    callback(err);
	    return;
	}
	var justText= [];
	var sentArray = result.sents[0].sent;
	sentArray.forEach(function(sent) {
	    justText.push(sent.text[0]);
	});
	callback(null, sentArray);
    });
}

var parseIntoTree = function(xml, callback) {
    getSents(xml, function(err, sentArray) {
	if(err) {
	    callback(err);
	    return;
	}
	
	var justParses = [];
	var justTrees = [];
	sentArray.forEach(function(sent) {
	    var parse = sent.parse[0]['_'];
	    justParses.push(parse);
	    startIt(parse, function(err, tree) {
		
		justTrees.push(tree);
//		console.log('', justTrees.length, '/', sentArray.length);
		if(justTrees.length == sentArray.length) {
		    callback(null, justTrees);		  
		}  
	    });
	});		    

    });

}


function startIt(string, callback) {
    var root = {
	type: 'root',
//	text: string,
	children: []
    }
    var tokens = string.split(' ');
    
    recurse(root, tokens, function(err, tree, tokensLeft) {
	if(err) {
	    callback(err);
	    return;
	}
	callback(null, tree);
    });
}

function recurse(tree, tokens, callback) {
    if(!tokens || tokens.length == 0)  {
//	console.log('base case, see ya');
	callback(null, tree, null);
	return;
    }

    // separate head and tail
    var nextToken = tokens[0];
    tokens = tokens.slice(1);
    
    // begin a new tree
    if(nextToken.charAt(0) === '[') {
	var type = nextToken.substring(1);
//	console.log('pushing down into', type);
	var newTree = {
	    type: type,
//	    text: nextToken,
	    children: []
	}
	// push down into new tree
	recurse(newTree, tokens, function(err, finishedTree, tokensLeft) {
	    // add finished tree to this tree
//	    tree.text += ' ' + finishedTree.text;
	    tree.children.push(finishedTree);
	    
	    // continue w/ current tree, remaining tokens from last, and the callback
	    recurse(tree, tokensLeft, callback);
	});
    } 
    
    // finish a tree
    else if (nextToken.charAt(nextToken.length - 1) === ']') {
//	tree.text += ' ' + nextToken;
	var type = nextToken.substring(0, nextToken.length - 1);
//	console.log('popping out of', type);
	// go back up
	callback(null, tree, tokens);
    }
    
    // intermediate text 
    else {
////	console.log('continuing');
	// continue recursing with this tree
//	tree.text += ' ' + nextToken;
	var split = nextToken.split('_');	
	var leaf = {
	    type: split[1],
	    text: split[0]
	}
	tree.children.push(leaf);

	// keep same tree, same tokens, same callback
	recurse(tree, tokens, callback);
    }
}

var phrases = {

};

var atoms = {

};

function classify(tree) {

    var saveMe = {
	type: tree.type,
	sub: ''
    }
//    console.log(tree);
    
    // has sub-parts
    if(tree.children) {
	var count = 0;
	tree.children.forEach(function(child) {
	    saveMe.sub += child.type + ' ';
	    count++;
//	    console.log('', count, '/', tree.children.length);
	    if(count == tree.children.length) {
//		console.log('saving phrase', saveMe.sub, '->', saveMe.type);

		if(!phrases[saveMe.type]) {
		    // type not classified
		    phrases[saveMe.type] = {};
		    phrases[saveMe.type][saveMe.sub] = 1;
		} else if (!phrases[saveMe.type][saveMe.sub]) {
		    // type classified, but phrase not saved
		    phrases[saveMe.type][saveMe.sub] = 1
		} else {
		    // phrase saved, increment
		    phrases[saveMe.type][saveMe.sub]++;
		}
	    }
	    // recurse over tree
	    classify(child);
	});
    } else {
//	console.log('saving atom', tree.text, '->', tree.type);
	if(!atoms[tree.type]) {
	    // type not classified
	    atoms[tree.type] = {};
	    atoms[tree.type][tree.text] = 1;
	} else if(!atoms[tree.type][tree.text]) {
	    // type classified, but phrase not saved
	    atoms[tree.type][tree.text] = 1;
	} else {
	    atoms[tree.type][tree.text]++;
	}
    }

//    console.log(phrases);

}

module.exports = {
    parse: parse,
    getDoc: getDoc,
    getSents: getSents,
    parseIntoTree: parseIntoTree,
    parseMe: startIt,
    classify: classify,
    phrases: phrases
}
