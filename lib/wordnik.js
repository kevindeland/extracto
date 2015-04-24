var Wordnik = require('wordnik');

var wn = new Wordnik({
    api_key: '908537566215479fda4613d1ffd0e7c0b830a4485fe0cfe03'
});

/*
wn.word('minimalism', {
    useCanonical: true
    , includeSuggestions: true
}, function(e, word) {
    console.log(e, word);

    word.related({
	limit: 1
    }, console.log);
});
*/

wn.definitions('pernicious', function(e, defs) {
    console.log(e, defs);
});


