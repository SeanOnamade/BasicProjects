// Audio element control: loading songs, play/pause UI sync, progress bar,
// volume, and Media Session integration.

const player = document.getElementById("player");
const audioSource = document.getElementById("source");
const volumeSlider = document.getElementById("volumeSlider");
const progressBar = document.getElementById("progress");

function loadAndPlay(song) {
    audioSource.src = `Songs/${encodeURIComponent(song.file)}`;
    player.load();
    player.play();

    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: song.title,
            artist: song.artist,
            album: "Dot-Ify V2",
        });
    }
}

function togglePlayPause() {
    if (!player.readyState) return;
    if (player.paused) {
        player.play();
    } else {
        player.pause();
    }
}

function pulseHeadphones() {
    const headphones = document.getElementById("headphones");
    headphones.classList.remove("pulse");
    void headphones.offsetWidth; // force reflow so the animation restarts
    headphones.classList.add("pulse");
}

// Single source of truth for playback UI, driven by the audio element's
// own events so the icon/animations can never desync from actual playback.
function syncPlaybackUI() {
    const playing = !player.paused;
    document.getElementById("currentSong").classList.toggle("paused", !playing);
    document.getElementById("headphones").classList.toggle("playing", playing);
    document.getElementById("playPauseIcon").innerHTML = playing ? "&#10074;&#10074;" : "&#9658;";
}

player.addEventListener("play", () => {
    syncPlaybackUI();
    pulseHeadphones();
});

player.addEventListener("pause", () => {
    syncPlaybackUI();
    document.getElementById("headphones").classList.remove("pulse");
});

player.addEventListener("error", (event) => {
    console.error("Playback error:", event);
    alert("An error occurred during playback. Please try again later.");
});

/* ---------- Progress bar ---------- */

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

function updateProgress() {
    if (!Number.isFinite(player.duration) || player.duration === 0) return;
    progressBar.value = (player.currentTime / player.duration) * 100;
    document.getElementById("timeDisplay").innerText =
        `${formatTime(player.currentTime)} / ${formatTime(player.duration)}`;
}

player.addEventListener("timeupdate", updateProgress);

let isDraggingProgress = false;
let wasPlayingBeforeDrag = false;

function moveProgressBar(event) {
    if (!isDraggingProgress || !player.duration) return;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
    player.currentTime = player.duration * (offsetX / rect.width);
}

function onProgressDragMove(event) {
    moveProgressBar(event);
}

function onProgressTouchMove(event) {
    if (!isDraggingProgress) return;
    event.preventDefault();
    moveProgressBar(event.touches[0]);
}

function startProgressDrag(event) {
    isDraggingProgress = true;
    wasPlayingBeforeDrag = !player.paused;
    player.pause();
    moveProgressBar(event);
    document.addEventListener("mousemove", onProgressDragMove);
    document.addEventListener("touchmove", onProgressTouchMove, { passive: false });
}

function stopProgressDrag() {
    if (!isDraggingProgress) return;
    if (wasPlayingBeforeDrag) {
        player.play();
    }
    isDraggingProgress = false;
    document.removeEventListener("mousemove", onProgressDragMove);
    document.removeEventListener("touchmove", onProgressTouchMove);
}

/* ---------- Volume ---------- */

function setVolume(volume) {
    player.volume = Math.min(1, Math.max(0, volume));
    volumeSlider.value = player.volume;
}

/* ---------- Media Session (OS media keys / system overlay) ---------- */

function setupMediaSession() {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.setActionHandler("play", () => player.play());
    navigator.mediaSession.setActionHandler("pause", () => player.pause());
    navigator.mediaSession.setActionHandler("previoustrack", () => playPrevious());
    navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
}
