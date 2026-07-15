// App state, localStorage persistence, event wiring, and init.

const state = {
    queue: [],              // array of song ids
    currentQueueIndex: -1,  // queue cursor (see queue.js)
    nowPlaying: null,       // null | { type: "queue" | "oneoff", songId }
    sortKey: "title",       // "title" | "artist"
    searchText: "",
};

/* ---------- Persistence ---------- */

const STORAGE_KEYS = {
    volume: "dotify.volume",
    queue: "dotify.queue",
    sortKey: "dotify.sortKey",
};

function saveQueue() {
    localStorage.setItem(STORAGE_KEYS.queue, JSON.stringify(state.queue));
}

function restoreState() {
    const savedSort = localStorage.getItem(STORAGE_KEYS.sortKey);
    if (savedSort === "title" || savedSort === "artist") {
        state.sortKey = savedSort;
    }

    try {
        const savedQueue = JSON.parse(localStorage.getItem(STORAGE_KEYS.queue) ?? "[]");
        if (Array.isArray(savedQueue)) {
            state.queue = savedQueue.filter((id) => getSongById(id));
        }
    } catch {
        // Corrupt storage; start with an empty queue.
    }

    const savedVolume = parseFloat(localStorage.getItem(STORAGE_KEYS.volume));
    if (Number.isFinite(savedVolume)) {
        player.volume = Math.min(1, Math.max(0, savedVolume));
    }
}

/* ---------- Event wiring ---------- */

// Song list: one delegated listener; no re-wiring after re-renders.
document.getElementById("songList").addEventListener("click", (event) => {
    const li = event.target.closest("li[data-id]");
    if (!li) return;

    if (event.target.closest(".add-to-queue-btn")) {
        addToQueue(li.dataset.id);
    } else {
        playOneOff(li.dataset.id);
    }
});

const queueListEl = document.getElementById("queueList");

queueListEl.addEventListener("click", (event) => {
    if (consumeQueueDragClick()) return;
    const li = event.target.closest("li[data-index]");
    if (!li) return;

    if (event.target.closest(".remove-from-queue-btn")) {
        removeFromQueue(Number(li.dataset.index));
    } else if (!event.target.closest(".queue-drag-handle")) {
        playFromQueue(Number(li.dataset.index));
    }
});

queueListEl.addEventListener("pointerdown", (event) => {
    const handle = event.target.closest(".queue-drag-handle");
    if (!handle) return;
    const li = handle.closest("li[data-index]");
    if (!li) return;
    startQueueDrag(Number(li.dataset.index), event, handle);
});

document.getElementById("playPauseIcon").addEventListener("click", togglePlayPause);
document.getElementById("prevBtn").addEventListener("click", playPrevious);
document.getElementById("nextBtn").addEventListener("click", playNext);
document.getElementById("clearBtn").addEventListener("click", clearQueue);

document.getElementById("searchInput").addEventListener("input", (event) => {
    state.searchText = event.target.value;
    renderSongList();
});

document.getElementById("toggleButton").addEventListener("click", () => {
    state.sortKey = state.sortKey === "title" ? "artist" : "title";
    localStorage.setItem(STORAGE_KEYS.sortKey, state.sortKey);
    renderSortToggle();
    renderSongList();
});

// Keyboard: space toggles play/pause, arrows change volume.
// Ignored while typing in the search box.
document.addEventListener("keydown", (event) => {
    if (event.target !== document.body) return;

    const volumeStep = 0.1;
    switch (event.code) {
        case "Space":
            event.preventDefault(); // don't scroll the page
            togglePlayPause();
            break;
        case "ArrowRight":
            setVolume(player.volume + volumeStep);
            break;
        case "ArrowLeft":
            setVolume(player.volume - volumeStep);
            break;
    }
});

volumeSlider.addEventListener("input", (event) => {
    player.volume = event.target.value;
});

player.addEventListener("volumechange", () => {
    localStorage.setItem(STORAGE_KEYS.volume, String(player.volume));
});

progressBar.addEventListener("mousedown", (event) => {
    event.preventDefault();
    startProgressDrag(event);
});

progressBar.addEventListener("touchstart", (event) => {
    startProgressDrag(event.touches[0]);
}, { passive: true });

document.addEventListener("mouseup", stopProgressDrag);
document.addEventListener("touchend", stopProgressDrag);

/* ---------- Init ---------- */

restoreState();
setupMediaSession();
volumeSlider.value = player.volume;
renderAll();
