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
		console.log('', justTrees.length, '/', sentArray.length);
		if(justTrees.length == sentArray.length) {
		    callback(null, justTrees);		  
		}  
	    });
	    
	});		    

    });

}

var parseMe = function(parsable, callback) {
    
    var root = {
	type: 'root', 
//	text: '',
	children: []
    };

    

    var thisTree = root;
    var parentTree = null;

    var tokens = parsable.split(' ');

    tokens.forEach(function(token) {
	
	if(token.charAt(0) === '[') {
	    var type = token.substring(1);
	    console.log('pushing down into', type);
	    parentTree = thisTree;
	    thisTree = {
		type: type,
		text: token,
		children: []
	    };
	    thisTree.text += ' ' + token;
	} else if (token.charAt(token.length - 1) === ']') {
	    var type = token.substring(0, token.length - 1);
	    console.log('popping up out of', type);
	    thisTree.text += ' ' + token;
	    
	    parentTree.children.push(thisTree);
	    parentTree.text += ' ' + thisTree.text;
	    thisTree = parentTree;
	    

	} else {
	    var splitMe = token.split('_');
	    console.log('this is a leaf', splitMe[0], splitMe[1]);
	    var thisLeaf = {
		type: splitMe[1],
		text: splitMe[0]
	    };
	    thisTree.text += ' ' + token;
	    thisTree.children.push(thisLeaf);
	}
	
    });

    callback(null, parentTree);
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
	console.log('base case, see ya');
	callback(null, tree, null);
	return;
    }

    // separate head and tail
    var nextToken = tokens[0];
    tokens = tokens.slice(1);
    
    // begin a new tree
    if(nextToken.charAt(0) === '[') {
	var type = nextToken.substring(1);
	console.log('pushing down into', type);
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
	console.log('popping out of', type);
	// go back up
	callback(null, tree, tokens);
    }
    
    // intermediate text 
    else {
	console.log('continuing');
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

function pushDown() {

}

function popUp() {

}

function keepGoing() {

}

function treeRecurse(thisTree, tokens, callback) {

    
/*    var token = tokens[0];
    tailTokens = tokens.slice(1);
  */  
    tokens.forEach(function(token) {
	
	if(token.charAt(0) === '[') {
	    var type = token.substring(1);
	    console.log('pushing down into', type);
	    var newTree = {
		type: type, 
		text: token, 
		children: []};
	    treeRecurse(newTree, tailTokens, function(finishedChild, tokensLeft) {
		
		thisTree.children.push(finishedChild);
		tokens = tokensLeft;
	    });
	    
	} else if (token.charAt(token.length - 1) === ']') {
	    var type = token.substring(0, token.length - 1);
	    if(thisTree.type !== type) {
		console.err('ERROR TYPE DIFFERENCE', thisTree.type, type);
		return;
	    }
	    
	    thisTree.text += token;
	    
	    // we're done here
	    callback(thisTree, tokens);
	    
	} else {
	    var splitMe = token.split('_');
	    console.log('this is a leaf', splitMe[0], splitMe[1]);
	    var thisLeaf = {
		type: splitMe[1],
		text: splitMe[0]
	    };
	    thisTree.text += ' ' + token;
	    thisTree.children.push(thisLeaf);
	}
    });
}

module.exports = {
    parse: parse,
    getDoc: getDoc,
    getSents: getSents,
    parseIntoTree: parseIntoTree,
    parseMe: startIt
}
