import * as Modals from './Modals.js';
import * as Utils from './Utils.js';
import * as Game from './Game.js';
import * as MusicList from './music/MusicList.js';
import * as MusicManager from './MusicManager.js';

const gui_base = document.getElementById("gui_base")
const gui_music_list = document.getElementById("gui_music_list")

let _audio;

function stopGame() {
    if (_audio) {
        Utils.stopAudio(_audio);
        _audio = null;
    }

    Game.stop();

    gui_base.classList.remove("gui_base_hide");
}

function startGame(musicItem) {
    stopGame();

    let audio;
    if (musicItem.url) {
        console.log(musicItem.url, new URL(musicItem.url, import.meta.url).href)
        audio = Utils.audioFromUrl(musicItem.url);
    } else if (musicItem.mp3data) {
        audio = Utils.createAudioFromBuffer(musicItem.mp3data);
    }

    audio.loop = true;
    audio.play();

    Game.setRhythm(musicItem.rhythm);
    Game.start();

    _audio = audio;

    gui_base.classList.add("gui_base_hide");
}

export function gameover() {
    stopGame();
    Utils.playAudio(Utils.audioFromUrl("./sounds/gameover.mp3"));
}

document.addEventListener('visibilitychange', () => {
    if (_audio) {
        if (document.hidden) {
            _audio.pause();
        } else {
            _audio.play();
        }
    }
});

function editMusic(musicItem) {
}

function deleteMusic(musicItem) {
    Modals.modalYesno("delete music?", musicItem.title).then(accept => {
        if (accept) {
            MusicManager.deleteMusic(musicItem.id);
            refreshMusicList();
        }
    })
}

function addMusicToList(musicItem, editable=false) {
    const item = document.createElement("div")
    item.classList.add("gui_music_item")
    item.textContent = musicItem.title;
    item.addEventListener("click", () => startGame(musicItem));

    const flexItem = document.createElement("div");
    flexItem.classList.add("flex");
    item.appendChild(flexItem);

    if (editable) {
        let itemButton = document.createElement("div");
        itemButton.classList.add("gui_music_item_button");
        itemButton.innerHTML = "<img class=\"button-img\" src=\"textures/rename.png\"></img>";
        itemButton.addEventListener("click", (e) => {
            e.stopPropagation();
            editMusic(musicItem);
        });
        item.appendChild(itemButton);

        itemButton = document.createElement("div");
        itemButton.classList.add("gui_music_item_button");
        itemButton.innerHTML = "<img class=\"button-img\" src=\"textures/delete.png\"></img>";
        itemButton.addEventListener("click", (e) => {
            e.stopPropagation();
            deleteMusic(musicItem);
        });
        item.appendChild(itemButton);
    }

    gui_music_list.appendChild(item);
}

function refreshMusicList() {
    gui_music_list.innerHTML = "";

    MusicList.list.forEach(musicItem => addMusicToList(musicItem));
    MusicManager.musicList().then((musicItems) => {
        musicItems.forEach(musicItem => {
            addMusicToList(musicItem, true);
        })
    })
}

export function init() {
    document.getElementById("import").addEventListener("click", () => {
        Modals.windowSelectFile("mp3", true).then(mp3data => {
            let importTbl = {
                mp3data,
                rhythm: 1.5,
                title: "unknown"
            };
            MusicManager.saveMusic(importTbl, true).then(refreshMusicList);
        });
    })

    refreshMusicList()
}

export function setupCanvas(canvas) {
    const callback = (event) => {
        Game.setPos((event.offsetX / canvas.clientWidth) - 0.5);
    };

    canvas.addEventListener('pointermove', callback);
    canvas.addEventListener('pointerdown', callback);
}
