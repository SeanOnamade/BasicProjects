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
    { title: "Oleana Battle Music - Pokemon Sword and Shield", artist: "Game Freak" },
    { title: "Giorno's Theme (Medieval Style)", artist: "Mystic Zaru" },
    { title: "Faerie's Aire and Death Waltz", artist: "superrainbowderp" },
    { title: "Eccentricity", artist: "Sean" },
    { title: "Team Fortress 2 - Upgrade Station", artist: "Valve Studio Orchestra" },
    { title: "TOKYO DRIFT FREESTYLE", artist: "bbno$" },
    { title: "Sniper Remix Number One TF2", artist: "Mastgrr" },
    { title: "Team Fortress 2 - Your Team Lost", artist: "Valve Studio Orchestra" },
    { title: "Flame On {Human Torch Song}", artist: "Hitman's Beatmaker and Oll Korrect" },
    { title: "Level 6 - City", artist: "Rolling Sky" },
    { title: "Everywhere At The End Of DaBaby", artist: "ynk" },
    { title: "Playing with Christmas", artist: "Mastgrr" },
    { title: "Wii Theme But It's September", artist: "Mr Rock" },
    { title: "Frontier Justice", artist: "Dapper Dog" },
    { title: "TRNDSTTR (Instrumental)", artist: "Black Coast" },
    { title: "Bubble D.Va", artist: "ThatPunchKid" },
    { title: "Feel Good Inc. (Acoustic Cover)", artist: "Luca Stricagnoli, Gorillaz" },
    { title: "PEN BEAT I BATTLE", artist: "Shane Bang" },
    { title: "Sicko Mode (feat. K.K. Slider)", artist: "GameChops" },
    { title: "BFDI-Chapp", artist: "jacknjellify, Jockson" },
    { title: "AVM Ep 16. Note Block - Green's Jam", artist: "AaronGrooves, NeedInBalance" },
    { title: "Kazotsky Makes You Lose Control", artist: "gentu, Missy Elliott" },
    { title: "Flower", artist: "Moby" },
    { title: "There is No Candy in Me", artist: "Baljeet, Jon Colton Barry" },
    { title: "Rock My BFDI", artist: "jacknjellify, Kitsune" },
    { title: "Something-Chapp", artist: "Jockson" },
    { title: "Taunting Makes You Lose Control", artist: "Laurennntiu, Missy Elliott" },
    { title: "A Hat in Time [Seal the Deal] - Death Wish", artist: "Pascal Michael Stiefel" },
    { title: "Demoknight TF2 VS Engineer Gaming", artist: "SilentManJoe, Sock.clip" },
    { title: "MissingNo", artist: "TheInnuendo" },
    { title: "Piano Woman", artist: "Pukklez" },
    { title: "One Steady Roll", artist: "Pisk" },
    { title: "Pokémon Sun and Moon - Guzma Encounter Music", artist: "Game Freak" },
    { title: "Pokémon XY Theme", artist: "Ben Dixon and The Sad Truth" },
    { title: "Tinkerer Island", artist: "JakeTheDrake" },
    { title: "Song That Might Play When You Fight Sans (Acapella)", artist: "Smooth McGroove, Toby Fox" },
    { title: "Flatzone - VS. Kapi", artist: "Paperkitty" },
    { title: "Overhead", artist: "Sock.clip" },
    { title: "Gimme a Grade", artist: "The Baljeatles" },
    { title: "i let my little brother use Fl Studio", artist: "Paerle" },
    { title: "Kindle Kingdom Prediction", artist: "MSM World of Elements, JakeTheDrake" },
    { title: "Not So Bad a Dad", artist: "Olivia Olson" },
    { title: "Embrace the Unexpected - Opera Rap", artist: "Twist of Fate Wines" },
    { title: "Kleptomanie", artist: "Caravan Palace" },
    { title: "Bowgart the Barbarian", artist: "Robert Smith" },
    { title: "Demoman - Beggin'", artist: "Seriamon3, Måneskin" },
    { title: "Floppy Disks - Five Nights at Freddy's 1 Song", artist: "vaser888, The Living Tombstone" },
    { title: "Floppy Drives - Clint Eastwood", artist: "vaser888, Gorillaz" },
    { title: "Floppy Drives - Lone Digger", artist: "vaser888, Caravan Palace" },
    { title: "Dangerous", artist: "Left Boy, Big Data, Joywave" },
    { title: "It's Pizza Time!", artist: "Mr. Sauceman" },
    { title: "Tinkerer Monsters on Magical Nexus", artist: "JakeTheDrake" },
    { title: "what is 1 trillion to the 10th power", artist: "kyuuwaii" },
    { title: "Where Have All The Staplers Gone (Piano Cover)", artist: "Piano Eagle, VeggieTales" },
    { title: "Milkshake", artist: "Caravan Palace" },
    { title: "Chocolate", artist: "Caravan Palace" },
    { title: "Upgrade Station [Bossa Nova _ Big Band Remix]", artist: "Vandoorea" },
    { title: "Ethereal Workshop But I Kidnapped 21 Monsters", artist: "Sean" },
    { title: "Everybody's Circulation", artist: "TMABird" }
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
        title.textContent = sortedSongs[i].title;
        const hyphen = document.createElement("span");
        hyphen.textContent = " ━ ";
        hyphen.classList.add("hyphen");
        const artist = document.createElement("span");
        artist.textContent = sortedSongs[i].artist;
        // item.appendChild(document.createTextNode(songs[i]));
        item.appendChild(title);
        item.appendChild(hyphen);
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

function filterSongs() {
    const searchText = document.getElementById("searchInput").value.toLowerCase();
    const listItems = document.querySelectorAll("#songList li");

    listItems.forEach(item => {
        const title = item.querySelector("span:first-child").textContent.toLowerCase();
        const artist = item.querySelector(".hyphen").nextSibling.textContent.toLowerCase();
        if (title.includes(searchText) || artist.includes(searchText)) {
            item.style.display = "block";
        }
        else {
            item.style.display = "none";
        }
    });
}

document.getElementById("searchInput").addEventListener("input", filterSongs);

document.querySelector('#currentSong').innerText = "Choose a Song!"

function setSong(e) {
    // console.log(e);
    document.querySelector("#headphones").classList.remove("pulse"); /* May be outdated now */
    const source = document.getElementById("source");

    const targetLi = e.target.tagName === 'SPAN' ? e.target.parentElement : e.target;
    const songTitle = targetLi.querySelector('span:first-child').textContent;
    const songArtist = targetLi.querySelector('span:last-child').textContent;

    // const maxTitleLength = 35;
    // const truncatedTitle = songTitle.length > maxTitleLength ? songTitle.substring(0, maxTitleLength) + "..." : songTitle;
    // source.src = "songs/" + e.target.innerText;
    source.src = "songs/" + songTitle + ".mp3";

    document.querySelector('#currentSong').innerText = `Now Playing: ${songTitle} ${songArtist}`;
    // no hypen needed because artist.textContent = ` - ${songs[i].artist}`;

    player.load();
    player.play();
    document.querySelector('#currentSong').classList.remove("paused");
    document.querySelector('#headphones').style.animationPlayState = "running";
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
        document.querySelector('#headphones').style.animationPlayState = "running";
        document.getElementById("playPauseIcon").innerHTML = "&#10074;&#10074;";
    } else {
        player.pause();
        document.querySelector('#currentSong').classList.add("paused");
        document.querySelector('#headphones').style.animationPlayState = "paused";
        document.getElementById("playPauseIcon").innerHTML = "&#9658;";
    }
    if (!player.paused) { // if playing, pulse
        document.querySelector("#headphones").classList.add("pulse"); // if we just played it, it will play
        // this is after playing has actually occurred. We can only add after play call is complete
    } else { // otherwise, don't
        document.querySelector("#headphones").classList.remove("pulse"); // remove pulse.           
    }
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space' && event.target === document.body) {
        // event.target === document.body to prevent from affecting theoretical other fields
        event.preventDefault(); // prevents default action of scrolling down
        togglePlayPause();
    }
});

document.addEventListener('keydown', function(event) { /* Volume changed with arrows */
    const volumeStep = 0.1;
    switch (event.key) {
        case 'ArrowRight':
            player.volume = Math.min(player.volume + volumeStep, 1);
            updateVolumeDisplay(player.volume);
            break;
        case 'ArrowLeft':
            player.volume = Math.max(player.volume - volumeStep, 0);
            updateVolumeDisplay(player.volume);
            break;
        default:
            break;
    }
})

/* Set to true volume; LIES and says 50% otherwise, how rude */
document.getElementById("volumeSlider").value = player.volume;

function updateVolumeDisplay(volume) {
    const volumeDisplay = document.getElementById("volumeSlider");
    volumeDisplay.value = volume;
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
    document.querySelector('#headphones').style.animationPlayState = "paused";
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



