const songs = [
    "Cameraman (140bpm).mp3",
    "Chainsaw Man Opening - Kick Back [8 Bit VRC6] (1).mp3",
    "h0kioirc.mp3",
    "Kitsune - Rock My Emotions.mp3",
    "ROBLOX Music - Crossroad Times.mp3",
    "song1.wav",
];

const player = document.getElementById("player")

function createSongList() {
    const list = document.createElement("ol");
    for (let i = 0; i < songs.length; i++) {
        const item = document.createElement("li");
        item.appendChild(document.createTextNode(songs[i]));
        list.appendChild(item);
    }
    return list;
}

const songList = document.getElementById("songList")
songList.appendChild(createSongList());

const links = document.querySelectorAll('li');
for (const link of links) {
    link.addEventListener('click', setSong)
}

document.querySelector('#currentSong').innerText = "Choose a Song!"

function setSong(e) {
    // console.log(e);
    document.querySelector("#headphones").classList.remove("pulse");
    const source = document.getElementById("source");
    source.src = "songs/" + e.target.innerText;

    document.querySelector('#currentSong').innerText = `Now Playing: ${e.target.innerText}`

    player.load();
    player.play();
    document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    document.querySelector("#headphones").classList.add("pulse");
}

function togglePlayPause() {
    if (!player.readyState) {
        console.log("Not ready state!");
        return; 
    }
    if (player.paused) {
        player.play();
        document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    } else {
        player.pause();
        document.getElementById("playPauseIcon").innerHTML = "&#9658;";
    }
}

// player.addEventListener('error', function(event) {
//     console.error('Error occurred:', event.target.error);
//     // Handle the error (e.g., display an error message to the user)
//     // You can also reset the player state or take other appropriate action here
// });

const slider = document.getElementById("volumeSlider");
slider.oninput = function(e) {
    // console.log(e);
    const volume = e.target.value;
    player.volume = volume;
}

function updateProgress() {
    if (player.currentTime > 0) { // will throw error otherwise, w/ NaN
        const progressBar = document.getElementById("progress");
        const currentTime = player.currentTime;
        const duration = player.duration;

        const formatTime = (currentTime) => {
            const mins = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            return `${mins}:${seconds < 10 ? '0' : ''}${seconds}`;
        };

        progressBar.value = (currentTime / duration) * 100;
        document.getElementById("timeDisplay").innerText = `${formatTime(currentTime)} / ${formatTime(duration)}`;
    }
    // console.log(player.currentTime);
    // console.log(player.duration);
}

player.addEventListener('ended', function() {
    document.querySelector('#currentSong').innerText = "Choose a Song!";
    document.getElementById("playPauseIcon").innerHTML = "&#9658;";
});

const progressBar = document.getElementById("progress");
let isDragging = false;
let wasPlayingBeforeDrag = false;

function moveProgressBar(event) {
    const rect = progressBar.getBoundingClientRect(); // gets size and element
    const totalWidth = rect.width; // gets width
    const offsetX = event.clientX - rect.left; // this gets the mouse's ("event's") horizontal position
    // relative to the left edge of the progress bar

    const progressPercentage = offsetX / totalWidth; // calculates progress based on event's position
    

    // update the playback based on progress percentage
    const newTime = player.duration * progressPercentage;
    player.currentTime = newTime;
}

progressBar.addEventListener('mousedown', function(event) { // mousedown = clicking
    isDragging = true;
    wasPlayingBeforeDrag = !player.paused;
    player.pause();
    moveProgressBar(event); // update when dragging starts
    document.addEventListener('mousemove', moveProgressBar); // update continuously while dragging
});

progressBar.addEventListener('touchstart', function(event) { // touchscreen devices
    isDragging = true;
    wasPlayingBeforeDrag = !player.paused;
    player.pause();
    moveProgressBar(event.touches[0]); // jump immediately upon touching
    document.addEventListener('touchmove', function(touchEvent) {
        moveProgressBar(touchEvent.touches[0]); // first touch (touches[0]) is argument
    });
});

function stopDragging() {
    if (wasPlayingBeforeDrag) {
        player.play();
    }
    isDragging = false;
    document.removeEventListener('mousemove', moveProgressBar);
    document.removeEventListener('touchmove', moveProgressBar);
}

// document.addEventListener('mouseup', stopDragging);
// document.addEventListener('touchend', stopDragging);

document.addEventListener('mouseup', function() {
    if (isDragging) {
        stopDragging();
    }
});

document.addEventListener('touchend', function() {
    if (isDragging) {
        stopDragging();
    }
}); // using the commented code above for mouseup and touchend cause the bug. I guess the
    // problem was that it didn't check for isDragging. isDragging must only be called when dragging
    // is in progress. Without this check, the stopDragging function would be called unconditionally 
    // whenever a mouseup or touchend event occurs, regardless of whether dragging was actually happening.
    // this means that stopDragging() will continuously play the player.

// document.addEventListener('mouseup', function() {
//     document.removeEventListener('mousemove', moveProgressBar);
// });


// document.addEventListener('touched', function() {
//     document.removeEventListener('mousemove', moveProgressBar);
// });

player.addEventListener('error', function(event) { // does this work?
    console.error('Error occurred:', event);
    // Handle the error here, e.g., display an error message to the user
    alert('An error occurred during playback. Please try again later.');
});



