var genius = require('rapgenius-js');

/*
genius.searchArtist("Red Hot Chili Peppers", "rock", function(err, artist) {
    
    console.log('Rock artist found [name=%s, link=%s, popular-songs=%d]', artist.name, artist.link, artist.popularSongs.length);
    
});

genius.searchSong('Californication', 'rock', function(err, songs) {
    console.log("Songs that matched the search query were found" +
                "[songs-found=%d, first-song-name=%s", songs.length, songs[0].name);

    console.log(songs[0]);

    
});*/

var lyricsSearchCb = function(err, lyricsAndExplanations) {
    if(err){
	console.log("Error: " + err);
    }else{
	//Printing lyrics with section names
	var lyrics = lyricsAndExplanations.lyrics;
	var explanations = lyricsAndExplanations.explanations;
	console.log("Found lyrics for song [title=%s, main-artist=%s, featuring-artists=%s, producing-artists=%s]",
		    lyrics.songTitle, lyrics.mainArtist, lyrics.featuringArtists, lyrics.producingArtists);
//	console.log("**** LYRICS *****\n%s", lyrics.getFullLyrics(true));

//	console.log('****** LYRICS *******\n%s', JSON.stringify(lyrics) );
	//Now we can embed the explanations within the verses
	lyrics.addExplanations(explanations);
	var firstVerses = lyrics.sections[0].verses[0];
	//	console.log("\nVerses:\n %s \n\n *** This means ***\n%s", firstVerses.content, firstVerses.explanation);

	sentenceLyrics(lyrics);
    }
}

// separate lyrics into sentences
var sentenceLyrics = function(lyrics) {
    

    var fullText = '';
    lyrics.sections.forEach(function(section) {

	var verseLines = section.verses;
	verseLines.forEach(function(line) {
//	    console.log(parseLineIntoSentence(line.content));
	    fullText += parseLineIntoSentence(line.content);
	    
	});
    });
}
// parse lines into sentences
var parseLineIntoSentence = function(line) {
    var split = line.split('\n');
    var fullSentence = '';
    
    var first = true;
    split.forEach(function(s) {
	if(!first) {
	    fullSentence += ' ' + s;
	}
	else {
	    fullSentence += s;
	    first = false;
	}
    });
    
    fullSentence = fullSentence.substring(0, fullSentence.length - 1) + '.';
    
    return fullSentence;
}

var searchCallback = function(err, songs){
  if(err){
    console.log("Error: " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      genius.searchLyricsAndExplanations(songs[0].link, "rock", lyricsSearchCb);
    }
  }
};

//genius.searchSong("Lose Yourself", "rap", searchCallback);

genius.searchSong("Desolation Row", "rock", searchCallback);

