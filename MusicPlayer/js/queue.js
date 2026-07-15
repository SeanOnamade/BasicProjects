// Queue state transitions, one-off playback semantics, and drag-to-reorder.
//
// state.currentQueueIndex is the queue "cursor": the item currently playing
// (when nowPlaying.type === "queue") or the resume position a one-off will
// continue from when it ends.

function addToQueue(songId) {
    state.queue.push(songId);
    renderQueue();
    saveQueue();
}

function removeFromQueue(index) {
    if (index < 0 || index >= state.queue.length) return;
    const removedId = state.queue[index];
    const isCurrent = state.nowPlaying?.type === "queue" && index === state.currentQueueIndex;

    state.queue.splice(index, 1);

    if (isCurrent) {
        // Keep the audio playing but detach it from the queue as a one-off;
        // when it ends, the cursor resumes at the item that shifted into this slot.
        state.nowPlaying = { type: "oneoff", songId: removedId };
        state.currentQueueIndex = index - 1;
    } else if (index <= state.currentQueueIndex) {
        state.currentQueueIndex--;
    }

    renderQueue();
    saveQueue();
}

function moveQueueItem(fromIndex, toIndex) {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= state.queue.length) return;
    toIndex = Math.max(0, Math.min(toIndex, state.queue.length - 1));

    const [item] = state.queue.splice(fromIndex, 1);
    state.queue.splice(toIndex, 0, item);

    if (state.currentQueueIndex === fromIndex) {
        state.currentQueueIndex = toIndex;
    } else if (fromIndex < state.currentQueueIndex && toIndex >= state.currentQueueIndex) {
        state.currentQueueIndex--;
    } else if (fromIndex > state.currentQueueIndex && toIndex <= state.currentQueueIndex) {
        state.currentQueueIndex++;
    }

    renderQueue();
    saveQueue();
}

function clearQueue() {
    if (state.nowPlaying?.type === "queue") {
        // Whatever is playing keeps playing, but no longer belongs to a queue.
        state.nowPlaying = { type: "oneoff", songId: state.nowPlaying.songId };
    }
    state.queue = [];
    state.currentQueueIndex = -1;
    renderQueue();
    saveQueue();
}

function playFromQueue(index) {
    if (index < 0 || index >= state.queue.length) return;
    const song = getSongById(state.queue[index]);
    if (!song) return;

    state.currentQueueIndex = index;
    state.nowPlaying = { type: "queue", songId: song.id };
    loadAndPlay(song);
    renderQueue();
    renderNowPlaying();
}

// Clicking a song in My Songs: plays immediately without touching the queue.
function playOneOff(songId) {
    const song = getSongById(songId);
    if (!song) return;

    state.nowPlaying = { type: "oneoff", songId };
    loadAndPlay(song);
    renderQueue(); // drop the queue highlight
    renderNowPlaying();
}

function playNext() {
    if (state.currentQueueIndex < state.queue.length - 1) {
        playFromQueue(state.currentQueueIndex + 1);
    }
}

function playPrevious() {
    // If more than 3 seconds in, restart the current song.
    if (player.currentTime > 3) {
        player.currentTime = 0;
        return;
    }
    if (state.nowPlaying?.type === "oneoff") {
        // "Back" from a one-off returns to the queue cursor.
        if (state.currentQueueIndex >= 0 && state.currentQueueIndex < state.queue.length) {
            playFromQueue(state.currentQueueIndex);
        } else {
            player.currentTime = 0;
        }
    } else if (state.currentQueueIndex > 0) {
        playFromQueue(state.currentQueueIndex - 1);
    }
}

function handleSongEnded() {
    if (state.currentQueueIndex < state.queue.length - 1) {
        playNext();
    } else {
        state.nowPlaying = null;
        renderQueue();
        renderNowPlaying();
        syncPlaybackUI();
    }
}

player.addEventListener("ended", handleSongEnded);

/* ---------- Drag-to-reorder ---------- */

let queueDragState = null;
let suppressNextQueueClick = false;

function consumeQueueDragClick() {
    const suppress = suppressNextQueueClick;
    suppressNextQueueClick = false;
    return suppress;
}

function getPlaceholderQueueIndex() {
    const ol = document.querySelector("#queueList ol");
    if (!ol || !queueDragState?.placeholder) return queueDragState?.fromIndex ?? 0;

    let index = 0;
    for (const child of ol.children) {
        if (child === queueDragState.placeholder) {
            return index;
        }
        if (child.classList.contains("queue-drag-source-hidden")) {
            continue;
        }
        index++;
    }
    return index;
}

function updateQueuePlaceholder(clientY) {
    const ol = document.querySelector("#queueList ol");
    if (!ol || !queueDragState?.placeholder) return;

    const items = [...ol.querySelectorAll("li:not(.queue-drag-source-hidden)")];
    let insertBefore = null;

    for (const item of items) {
        if (item === queueDragState.placeholder) continue;
        const rect = item.getBoundingClientRect();
        const mid = rect.top + rect.height / 2;
        if (clientY < mid) {
            insertBefore = item;
            break;
        }
    }

    if (insertBefore) {
        ol.insertBefore(queueDragState.placeholder, insertBefore);
    } else {
        ol.appendChild(queueDragState.placeholder);
    }
}

function positionQueueDragGhost(clientX, clientY) {
    if (!queueDragState?.ghost) return;
    queueDragState.ghost.style.left = `${clientX - queueDragState.offsetX}px`;
    queueDragState.ghost.style.top = `${clientY - queueDragState.offsetY}px`;
}

function onQueueDragMove(event) {
    if (!queueDragState) return;
    queueDragState.didMove = true;
    positionQueueDragGhost(event.clientX, event.clientY);
    updateQueuePlaceholder(event.clientY);
}

function cleanupQueueDragElements() {
    if (!queueDragState) return;

    queueDragState.ghost?.remove();
    queueDragState.placeholder?.remove();

    if (queueDragState.li) {
        queueDragState.li.style.display = "";
        queueDragState.li.classList.remove("queue-drag-source-hidden");
    }
}

function endQueueDrag() {
    if (!queueDragState) return;

    const { fromIndex, handleEl, pointerId, didMove } = queueDragState;
    if (handleEl.hasPointerCapture(pointerId)) {
        handleEl.releasePointerCapture(pointerId);
    }

    document.removeEventListener("pointermove", onQueueDragMove);
    document.removeEventListener("pointerup", endQueueDrag);
    document.removeEventListener("pointercancel", endQueueDrag);
    document.getElementById("queueList").classList.remove("queue-dragging");

    const finalIndex = getPlaceholderQueueIndex();
    cleanupQueueDragElements();

    if (didMove && finalIndex !== fromIndex) {
        moveQueueItem(fromIndex, finalIndex);
    } else {
        renderQueue();
    }

    if (didMove) {
        // The browser may still dispatch a click for this pointer sequence;
        // swallow it so the drop doesn't also trigger "play from queue".
        // Cleared on the next pointerdown in case no click ever fires.
        suppressNextQueueClick = true;
        document.addEventListener("pointerdown", () => {
            suppressNextQueueClick = false;
        }, { once: true, capture: true });
    }

    queueDragState = null;
}

function startQueueDrag(index, event, handleEl) {
    event.preventDefault();

    const li = handleEl.closest("li");
    const rect = li.getBoundingClientRect();
    const ol = li.parentNode;

    const ghost = li.cloneNode(true);
    ghost.classList.add("queue-drag-ghost");
    ghost.classList.remove("now-playing");
    ghost.style.width = `${rect.width}px`;
    document.body.appendChild(ghost);

    const placeholder = document.createElement("li");
    placeholder.classList.add("queue-drag-placeholder");
    placeholder.style.height = `${rect.height}px`;
    ol.insertBefore(placeholder, li);

    li.classList.add("queue-drag-source-hidden");
    li.style.display = "none";

    queueDragState = {
        fromIndex: index,
        handleEl,
        pointerId: event.pointerId,
        didMove: false,
        ghost,
        placeholder,
        li,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
    };

    positionQueueDragGhost(event.clientX, event.clientY);
    handleEl.setPointerCapture(event.pointerId);
    document.getElementById("queueList").classList.add("queue-dragging");

    document.addEventListener("pointermove", onQueueDragMove);
    document.addEventListener("pointerup", endQueueDrag);
    document.addEventListener("pointercancel", endQueueDrag);
}
