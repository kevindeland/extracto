
module.exports.treeToMap = function(tree, callback) {

    var map = {}
    parseRoot(tree, map);
    
    callback(null, map);
}


function parseRoot(root, existingMap) {
    
    // it's a leaf
    if(!root.children) {
	if(!existingMap[root.type])
	    existingMap[root.type] = [];
	
	var mapTo = [root.text]
	existingMap[root.type].push(mapTo);
	
	// base case... no more parsing to do
	return;
    }

    var myChildren = [];
    root.children.forEach(function(child) {
	var childType = child.type;
	myChildren.push(childType);
	
	if(myChildren.length == root.children.length) {
	    // if type not defined, give it an array
	    if (!existingMap[root.type])
		existingMap[root.type] = [];
	    
	    // otherwise add children to it
	    existingMap[root.type].push(myChildren);
	}

	parseRoot(child, existingMap);
    });
    
}
