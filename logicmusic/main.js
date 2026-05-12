{

const playlistArray = [
    ["Дэн на жопо-вентиляторной тяге", "logiкусь", "playlist/1.mp3", "playlist/1.png"],
    ["Парень по имени Дэн", "logiкусь", "playlist/2.mp3", "playlist/2.png"]
]

const playlist = document.getElementById("playlist")
const audio = document.getElementById("audio")
const playerBox = document.getElementById("player-box")
const currentTrackPreview = document.getElementById("current-track-preview")
const progress = document.getElementById("progress")
const currentTimeSpan = document.getElementById("currentTimeSpan")
const durationSpan = document.getElementById("durationSpan")

function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}

function getTrackDuration(url) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        
        audio.addEventListener('loadedmetadata', () => {
            const duration = audio.duration;
            audio.src = '';
            URL.revokeObjectURL(url);
            resolve(duration);
        });
        
        audio.addEventListener('error', (e) => {
            reject(new Error(`Ошибка загрузки: ${audio.error ? audio.error.code : 'неизвестная'}`));
        });
        
        audio.src = url;
        audio.load();
    });
}

async function addTrack(metadata) {
    const trackBox = document.createElement("div")
    trackBox.classList.add("track-box")
    
    const trackPreviewBox = document.createElement("div")
    trackPreviewBox.classList.add("track-preview-box")
    trackPreviewBox.metadata = metadata

    const trackPreview = document.createElement("div")
    trackPreview.classList.add("track-preview")

    const trackPreviewImg = document.createElement("img")
    trackPreviewImg.src = metadata[3]
    trackPreview.append(trackPreviewImg)

    trackPreviewBox.append(trackPreview)
    
    const trackInfo = document.createElement("div")
    trackInfo.classList.add("track-info")

    const trackName = document.createElement("div")
    trackName.classList.add("track-name")
    trackName.textContent = metadata[0]
    trackInfo.append(trackName)

    const trackDescrition = document.createElement("div")
    trackDescrition.classList.add("track-descrition")
    trackDescrition.textContent = metadata[1]
    trackInfo.append(trackDescrition)

    const trackTime = document.createElement("div")
    trackTime.classList.add("track-time")
    trackTime.textContent = formatTime(await getTrackDuration(metadata[2]))
    trackInfo.append(trackTime)

    trackBox.append(trackPreviewBox)
    trackBox.append(trackInfo)
    playlist.append(trackBox)

    trackPreviewBox.addEventListener("click", _ => {
        startTrack(metadata)
    })
}

let currentTrackMetadata

function startTrack(metadata) {
    if (!audio.paused && currentTrackMetadata == metadata) {
        audio.pause()
    } else {
        if (currentTrackMetadata != metadata) {
            currentTrackMetadata = metadata
            audio.src = metadata[2]
        }
        audio.play()
    }

    playerBox.style.display = 'flex'
    currentTrackPreview.src = metadata[3]
}

function playPause() {
    if (audio.paused) {
        audio.play()
    } else {
        audio.pause()
    }
}

audio.addEventListener('timeupdate', () => {
    currentTimeSpan.textContent = formatTime(audio.currentTime)
    updateSlider(progress, audio.currentTime / audio.duration)
})

let currentVolume = 1

audio.addEventListener('loadedmetadata', () => {
    durationSpan.textContent = formatTime(audio.duration)
    audio.volume = currentVolume
})

function getCurrentPlayingIndex() {
    for (let i = 0; i < playlistArray.length; i++) {
        if (playlistArray[i] == currentTrackMetadata) {
            return i
        }
    }
    return null
}

audio.addEventListener('ended', () => {
    startTrack(playlistArray[(getCurrentPlayingIndex() + 1) % playlistArray.length])
});

for (let i = 0; i < playlistArray.length; i++) {
    addTrack(playlistArray[i])
}

document.getElementById("play-pause").addEventListener("click", _ => {
    playPause()
})

function updateSlider(element, value, verticle=false) {
    if (verticle) {
        element.style.height = `${value * 100}%`
    } else {
        element.style.width = `${value * 100}%`
    }
}

function sliderHandler(slider, handler, verticle=false) {
    let progressProcessEnabled = false
    function progressProcess(event) {
        if (!progressProcessEnabled) return

        const rect = slider.getBoundingClientRect();
        
        let clickPosition
        if (verticle) {
            clickPosition = 1 - ((event.clientY - rect.top) / rect.height)
        } else {
            clickPosition = (event.clientX - rect.left) / rect.width
        }
        clickPosition = Math.min(1, Math.max(0, clickPosition));
        
        handler(clickPosition)
    }

    slider.addEventListener("pointerdown", event => {
        progressProcessEnabled = true
        progressProcess(event)
    })
    document.addEventListener("pointermove", progressProcess)
    document.addEventListener("pointerup", event => {
        progressProcessEnabled = false
    })
}

const processSlider = document.getElementById("process-slider")
const volumeVisualization = document.getElementById("volume")
const volumeSlider = document.getElementById("volume-slider")

sliderHandler(processSlider, value => {
    audio.currentTime = value * audio.duration
})

sliderHandler(volumeSlider, value => {
    currentVolume = value
    audio.volume = currentVolume;
    updateSlider(volumeVisualization, currentVolume, true)
}, true)

}