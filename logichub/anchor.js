{

let anchor = location.hash.substring(1);

if (anchor) {
    let category = anchors[anchor];
    if (category != null) {
        selectCategory(category);
    }

    let element = document.getElementById(anchor);
    if (element != null) {
        element.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}

}