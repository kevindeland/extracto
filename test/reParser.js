var reParser = require('../lib/reParser');

var expect = require('chai').expect;


var testString = '[S [NP John_NNP NP] [VP smiled_VBD VP] ._. S]';

var expectedTree = {
    type: 'root',
    text: '[S [NP John_NNP NP] [VP smiled_VBD VP] ._. S]',
    children: [{
	type: 'S',
	text: '[NP John_NNP NP] [VP smiled_VBD VP] ._.',
	children: [{
	    type: 'NP',
	    text: 'John_NNP',
	    children: [{
		type: 'NNP',
		text: 'John'
	    }]
	}, {
	    type: 'VP',
	    text: 'smiled_VBD',
	    children: [{
		    type: 'VBD',
		    text: 'smiled'
	    }]
	}, {
	    type: '.',
	    text: '.'
	}]
    }]
}

describe('reParser', function() {
    
    describe('#parseMe', function() {
	it('should be a function', function() {
	    expect(reParser.parseMe).to.be.a('function');
	});

	it('should parse into a tree', function() {
	    reParser.parseMe(testString, function(err, tree) {
		console.log(JSON.stringify(tree));
		expect(tree).to.be.an('object');
		
		expect(tree.type).to.equal(expectedTree.type);

		expect(tree.children.length).to.equal(expectedTree.children.length);
//		expect(tree.children[0]).to.equal(expectedTree.children[0]);
	    });
	});
    });

    
});
