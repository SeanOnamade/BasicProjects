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
    if (player.paused && player.readyState) {
        player.play();
        document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    } else {
        player.pause();
        document.getElementById("playPauseIcon").innerHTML = "&#9658;";
    }
}

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


