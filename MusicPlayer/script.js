const songs = [
    { title: "Cameraman", artist: "Kelton ft. Sean" },
    { title: "Chainsaw Man Opening - Kick Back [8 Bit VRC6]", artist: "MegaBaz" },
    { title: "Untitled1", artist: "Unknown Artist" },
    { title: "Rock My Emotions", artist: "Kitsune" },
    { title: "ROBLOX Music - Crossroad Times", artist: "ROBLOX" },
    { title: "Untitled2", artist: "Sean" },
    { title: "April 13", artist: "Sean" },
    { title: "April 14", artist: "Sean" },
    { title: "April 15", artist: "Sean" },
    { title: "Oleana Battle Music - Pokémon Sword & Shield", artist: "Gamefreak" },
    { title: "Giorno's Theme (Medieval Style)", artist: "Mystic Zaru" },
    { title: "Faerie's Aire and Death Waltz", artist: "superrainbowderp" },
    { title: "Eccentricity", artist: "Sean" },
    { title: "Team Fortress 2 -- Upgrade Station", artist: "Valve Studio Orchestra" },
    { title: "TOKYO DRIFT FREESTYLE", artist: "bbno$" },
    { title: "Sniper Remix Number One TF2", artist: "Mastgrr" },
    { title: "Team Fortress 2 -- Your Team Lost", artist: "Valve Studio Orchestra" },
    { title: "Flame On {Human Torch Song}", artist: "Hitman's Beatmaker and Oll Korrect" },
    { title: "Level 6 -- City", artist: "Rolling Sky" },
    { title: "Everywhere At The End Of DaBaby", artist: "ynk" },
    { title: "Playing with Christmas", artist: "Mastgrr" },
    { title: "Wii Theme but its September", artist: "Mr Rock" },
].sort((a, b) => a.title.localeCompare(b.title));

// https://www.textfixer.com/tools/alphabetical-order.php

const player = document.getElementById("player")
let sortByTitle = true;

function createSongList() {
    const sortedSongs = songs.sort(sortSongs);
    const list = document.createElement("ol");
    // for (let i = 0; i < songs.length; i++) {
    for (let i = 0; i < sortedSongs.length; i++) {
        const item = document.createElement("li");
        const title = document.createElement("span"); // song title
        title.textContent = songs[i].title;
        const artist = document.createElement("span");
        artist.textContent = ` - ${songs[i].artist}`;
        // item.appendChild(document.createTextNode(songs[i]));
        item.appendChild(title);
        item.appendChild(artist);
        list.appendChild(item);
    }
    return list;
}

const songList = document.getElementById("songList")
songList.appendChild(createSongList());

const links = document.querySelectorAll('li, li span:first-child');
for (const link of links) {
    link.addEventListener('click', setSong)
}

document.querySelector('#currentSong').innerText = "Choose a Song!"

function setSong(e) {
    // console.log(e);
    document.querySelector("#headphones").classList.remove("pulse");
    const source = document.getElementById("source");

    const targetLi = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target;
    const songTitle = targetLi.querySelector('span:first-child').textContent;
    // source.src = "songs/" + e.target.innerText;
    source.src = "songs/" + songTitle + ".mp3";

    document.querySelector('#currentSong').innerText = `Now Playing: ${e.target.innerText}`

    player.load();
    player.play();
    document.querySelector('#currentSong').classList.remove("paused");
    document.querySelector('#currentSong').style.fontStyle = 'italic';
    document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    document.querySelector("#headphones").classList.add("pulse");
}

function togglePlayPause() {
    if (!player.readyState) {
        console.log("Not ready state!");
        return; 
    }
    if (player.paused) {
        document.querySelector("#headphones").classList.remove("pulse"); // playing it will prep pulse
        player.play();
        document.querySelector('#currentSong').style.fontStyle = 'italic';
        document.querySelector('#currentSong').classList.remove("paused");
        document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    } else {
        player.pause();
        document.querySelector('#currentSong').style.fontStyle = 'normal';
        document.querySelector('#currentSong').classList.add("paused");
        document.getElementById("playPauseIcon").innerHTML = "&#9658;";
    }
    if (!player.paused) { // if playing, pulse
        document.querySelector("#headphones").classList.add("pulse"); // if we just played it, it will play
        // this is after playing has actually occurred. We can only add after play call is complete
    } else { // otherwise, don't
        document.querySelector("#headphones").classList.remove("pulse"); // remove pulse.           
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
}

player.addEventListener('ended', function() {
    var currentSong = document.querySelector('#currentSong');
    currentSong.innerText = "Choose a Song!";
    currentSong.style.fontStyle = 'normal';
    currentSong.classList.add("paused");
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

function toggleSort() {
    sortByTitle = !sortByTitle;
    const toggleButton = document.getElementById("toggleButton");
    if (sortByTitle) {
        toggleButton.textContent = "Sort by Artist";
    }
    else {
        toggleButton.textContent = "Sort by Title";
    }
    songList.innerHTML = ''; // recreates the list with new sorting
    songList.appendChild(createSongList());
    const links = document.querySelectorAll('li, li span:first-child');
    for (const link of links) {
        link.addEventListener('click', setSong)
    }
}

function sortSongs(a, b) {
    if (sortByTitle) {
        return a.title.localeCompare(b.title);
    }
    else {
        return a.artist.localeCompare(b.artist);
    }
}

document.getElementById("toggleButton").addEventListener('click', toggleSort);

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
    alert('An error occurred during playback. Please try again later.');
});



