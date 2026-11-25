let enabled = false;
let lastInteractionType = null;

function removeClassFromAllElements(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.classList.remove(className);
    });
}

function getElementsAt(x, y, all=false) {
    const elements = document.elementsFromPoint(x, y);
    return all ? elements : elements.slice(0, 1);
}

function handle_pointerdown(e) {
    lastInteractionType = e.pointerType;

    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    
    getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
    getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
    getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));
    getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));

    if (e.pointerType === "mouse") {
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_none");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");

        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none-bubble"));
    }
}

function handle_pointermove(e) {
    lastInteractionType = e.pointerType;

    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");

    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");
    
    if (e.pointerType === "mouse") {
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
        removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");

        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none-bubble"));
    } else {
        getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));

        let ts_active_list = [];
        let ts_active_bubble_list = [];
        getElementsAt(e.clientX, e.clientY, false).forEach(element => ts_active_list.push(element));
        getElementsAt(e.clientX, e.clientY, true).forEach(element => ts_active_bubble_list.push(element));

        document.querySelectorAll(".touch_hybrid_safe_hover-ts_active").forEach(element => {
            if (!ts_active_list.includes(element)) {
                element.classList.remove("touch_hybrid_safe_hover-ts_active");
            }
        });

        document.querySelectorAll(".touch_hybrid_safe_hover-ts_active-bubble").forEach(element => {
            if (!ts_active_bubble_list.includes(element)) {
                element.classList.remove("touch_hybrid_safe_hover-ts_active-bubble");
            }
        });
    }
}

function removeAllClasses() {
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");
}

function handle_pointerup_pointercancel(e) {
    if (e.pointerType !== "mouse") {
        removeAllClasses();
    }
}

export function enable() {
    if (enabled) return;
    document.addEventListener("pointerdown", handle_pointerdown);
    document.addEventListener("pointermove", handle_pointermove);
    document.addEventListener("pointerup", handle_pointerup_pointercancel);
    document.addEventListener("pointercancel", handle_pointerup_pointercancel);
    enabled = true;
}

export function disable() {
    if (!enabled) return;
    document.removeEventListener("pointerdown", handle_pointerdown);
    document.removeEventListener("pointermove", handle_pointermove);
    document.removeEventListener("pointerup", handle_pointerup_pointercancel);
    document.removeEventListener("pointercancel", handle_pointerup_pointercancel);
    removeAllClasses();
    enabled = false;
}

export function isEnabled() {
    return enabled;
}

export function getLastInteractionType() {
    return lastInteractionType;
}
