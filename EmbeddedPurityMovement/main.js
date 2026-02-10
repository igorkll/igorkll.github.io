document.body.addEventListener("click", () => {
    const a = document.getElementById("soundtrack");
    a.muted = false;
    a.play();
}, { once: true });


const smallswitch = document.getElementById("smallswitch");
const largeswitch = document.getElementById("largeswitch");

smallswitch.volume = 0.4;

document.querySelectorAll("details").forEach(detail => {
    detail.addEventListener("toggle", () => {
        smallswitch.currentTime = 0;
        smallswitch.play();
    });
});
