{

let body = document.querySelector("body");

function closeFullscreenImage(fullscreenImage) {
    fullscreenImage.classList.remove("fullscreen-image-open");
    setTimeout(() => {
        fullscreenImage.remove();
    }, 150);
}

function openFullscreenImage(element) {
    let src = element.querySelector("img").src;
    
    let fullscreenImage = document.createElement("div");
    fullscreenImage.classList.add("fullscreen-image");

    let fullscreenImageImg = document.createElement("img");
    fullscreenImageImg.src = src;

    fullscreenImage.appendChild(fullscreenImageImg);
    fullscreenImage.addEventListener("click", _ => {
        closeFullscreenImage(fullscreenImage);
    });
    body.appendChild(fullscreenImage);
    requestAnimationFrame(() => {
        fullscreenImage.classList.add("fullscreen-image-open");
    });
}

document.querySelectorAll(".gallery-item").forEach(element => {
    element.addEventListener("click", _ => {
        openFullscreenImage(element);
    });
});

}