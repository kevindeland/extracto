var Watson = require('../lib/watson').Watson;

module.exports.controller = function(router) {

//    var words = [{'the'
    
    // ROUTES
    router.get('/nouns', function(req, res) {
	Watson.wtf('The quick brown fox jumps over the lazy dog', function(err, xml) {
	    console.log(xml);
	    res.send(xml);
	});

    });
    return router;
};

