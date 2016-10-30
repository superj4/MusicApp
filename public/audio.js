var audioObject = null;
var playingCssClass = 'playing';

function preview(e){
    var target = e.target;
    if (target !== null && target.classList.contains("cover")) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('id'), function(data) {            
                audioObject = new Audio(data.tracks[0].preview_url);
                audioObject.play();
                target.src="resources/pause.png";
                target.classList.add(playingCssClass);
                audioObject.addEventListener('ended', function() {
                    target.classList.remove(playingCssClass);
                    target.src="resources/play.png";
                });
                audioObject.addEventListener('pause', function() {
                    target.classList.remove(playingCssClass);
                    target.src="resources/play.png";
               });
            });
        }
    }
}

var fetchTracks = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
        success: function (response) {
            callback(response);
        }
    });
};