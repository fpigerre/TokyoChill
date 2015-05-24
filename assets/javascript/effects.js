var currentTrack;
var trackArray = [];
var trackNumber = 0;

$(document).ready(function () {
    $('#background').hide();

    $('.subtitle').textillate({
        loop: true,
        in: {effect: 'tada'},
        out: {effect: 'tada'}
    });

    // Code to execute after loading
    window.setTimeout(function () {
        $('.welcome').fadeOut('slow');
        $('.hint').fadeOut('slow');

        $('#background').show();

        // Make it rain!!
        var engine = new RainyDay({
            image: document.getElementById('background'),
            parentElement: document.getElementById('canvas-parent'),
            blur: 10,
            opacity: 1
        });
        engine.rain([
            [1, 0, 20],         // add 20 drops of size 1...
            [3, 3, 1]           // ... and 1 drop of size from 3 - 6 ...
        ], 100);                   // ... every 100ms

        // Change the background image every three minutes
        setInterval(function () {
            // Random number is added to trick the number into thinking a new image is being added
            $('#background').src = 'assets/images/' + Math.floor((Math.random() * 5) + 1) + '.jpg?rand=' + Math.random();
        }, 180000);

        // Play some relaxing music
        SC.initialize({
            client_id: "YOUR_CLIENT_ID",
            redirect_uri: "http://example.com/callback.html"
        });

        // 27748789
        SC.get('/playlists/21614704', function (playlist) {
            for (var i = 0; i < playlist.tracks.length; i++) {
                trackArray.push(playlist.tracks[i]);
            }
            // Function must be called from the SC.get() method
            play(trackNumber);
        });

        // Bind menu activation to a key
        var menu = $('nav');
        var exposed = false;

        // Setup menu last in order to avoid update errors
        $(document).keydown(function (key) {
            // Check if home key was pressed
            if (key.keyCode == 36) {
                // Activate menu
                if (exposed) {
                    menu.transition({x: '-20.125rem'});
                    exposed = false;
                } else {
                    menu.transition({x: '20.125rem'});
                    exposed = true;
                }
            }
        });
    }, 5000);
});

function play(trackNumber) {
    if (trackNumber < trackArray.length) {
        SC.stream(trackArray[trackNumber].uri, {
            onfinish: function () {
                trackNumber++;
                play(trackNumber);
            }
        }, function (sound) {
            var playButton = $('.play');
            var pauseButton = $('.pause');

            currentTrack = sound;
            sound.play();
            playButton.hide();
            pauseButton.show();
            updateSoundInformation(currentTrack);

            playButton.click(function () {
                sound.play();
                playButton.hide();
                pauseButton.show();
            });

            pauseButton.click(function () {
                sound.pause();
                pauseButton.hide();
                playButton.show();
            });

            $('.previous').click(function () {
                sound.stop();
                trackNumber--;
                play(trackNumber);
                pauseButton.show();
                updateSoundInformation();
            });

            $('.next').click(function () {
                sound.stop();
                trackNumber++;
                play(trackNumber);
                pauseButton.show();
                updateSoundInformation();
            });
        });
    }
}

function updateSoundInformation(currentTrack) {
    // TODO: Update when track changes
    document.getElementById('track-name').innerHTML = trackArray[trackNumber].user.username;
    document.getElementById('artist').innerHTML = trackArray[trackNumber].title;
}