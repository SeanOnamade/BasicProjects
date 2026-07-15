// All rendering. Every function reads from `state` and rebuilds its section;
// list items carry data-id / data-index so click handlers never parse text.

function renderNowPlaying() {
    const currentSong = document.getElementById("currentSong");
    if (state.nowPlaying) {
        const song = getSongById(state.nowPlaying.songId);
        currentSong.innerText = `Now Playing: ${song.title} - ${song.artist}`;
        currentSong.classList.add("active");
    } else {
        currentSong.innerText = "Choose a Song!";
        currentSong.classList.remove("active");
    }
}

function getVisibleSongs() {
    const search = state.searchText.trim().toLowerCase();
    return SONGS
        .filter((song) =>
            song.title.toLowerCase().includes(search) ||
            song.artist.toLowerCase().includes(search))
        .sort((a, b) => a[state.sortKey].localeCompare(b[state.sortKey]));
}

function renderSongList() {
    const songList = document.getElementById("songList");
    songList.innerHTML = "";

    const list = document.createElement("ol");
    for (const song of getVisibleSongs()) {
        const item = document.createElement("li");
        item.dataset.id = song.id;

        const title = document.createElement("span");
        title.textContent = song.title;

        const hyphen = document.createElement("span");
        hyphen.textContent = " ━ ";
        hyphen.classList.add("hyphen");

        const artist = document.createElement("span");
        artist.textContent = song.artist;

        const addBtn = document.createElement("button");
        addBtn.textContent = "+";
        addBtn.classList.add("add-to-queue-btn");
        addBtn.title = "Add to Queue";

        item.append(title, hyphen, artist, addBtn);
        list.appendChild(item);
    }
    songList.appendChild(list);
}

function renderQueue() {
    const queueList = document.getElementById("queueList");
    queueList.innerHTML = "";

    if (state.queue.length === 0) {
        queueList.innerHTML = '<hr class="queue-divider">';
        return;
    }

    const ol = document.createElement("ol");
    state.queue.forEach((songId, index) => {
        const song = getSongById(songId);
        const li = document.createElement("li");
        li.dataset.index = index;

        const dragHandle = document.createElement("span");
        dragHandle.classList.add("queue-drag-handle");
        dragHandle.textContent = "⠿";
        dragHandle.title = "Drag to reorder";

        const label = document.createElement("span");
        label.classList.add("queue-item-label");
        label.textContent = `${song.title} - ${song.artist}`;

        if (state.nowPlaying?.type === "queue" && index === state.currentQueueIndex) {
            li.classList.add("now-playing");
        }

        const removeBtn = document.createElement("button");
        removeBtn.textContent = "✕";
        removeBtn.classList.add("remove-from-queue-btn");
        removeBtn.title = "Remove from Queue";

        li.append(dragHandle, label, removeBtn);
        ol.appendChild(li);
    });
    queueList.appendChild(ol);

    const divider = document.createElement("hr");
    divider.classList.add("queue-divider");
    queueList.appendChild(divider);
}

function renderSortToggle() {
    // The button shows what clicking it will switch to.
    document.getElementById("toggleButton").textContent =
        state.sortKey === "title" ? "Sort by Artist" : "Sort by Title";
}

function renderAll() {
    renderSongList();
    renderQueue();
    renderNowPlaying();
    renderSortToggle();
}
