let enabled = false;
let lastInteractionType = null;

const pointers = new Map();

function removeClassFromAllElements(className) {
    document.querySelectorAll(`.${className}`).forEach(element => {
        element.classList.remove(className);
    });
}

function getElementsAt(x, y, all=false) {
    const elements = document.elementsFromPoint(x, y);
    return all ? elements : elements.slice(0, 1);
}

function update() {
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");

    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");

    const ts_active_list = [];
    const ts_active_bubble_list = [];
    
    for (const [pointerId, pointer] of pointers) {
        if (pointer.pointerType === "mouse" || pointer.isPressed) {
            getElementsAt(pointer.clientX, pointer.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover"));
            getElementsAt(pointer.clientX, pointer.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_hover-bubble"));
        }

        if (pointer.pointerType === "mouse") {
            getElementsAt(pointer.clientX, pointer.clientY, false).forEach(element => {
                element.classList.add("touch_hybrid_safe_hover-ts_active");
                ts_active_list.push(element);
            });
            
            getElementsAt(pointer.clientX, pointer.clientY, true).forEach(element => {
                element.classList.add("touch_hybrid_safe_hover-ts_active-bubble");
                ts_active_bubble_list.push(element);
            });
        } else if (pointer.isPressed) {
            getElementsAt(pointer.clientX, pointer.clientY, false).forEach(element => ts_active_list.push(element));
            getElementsAt(pointer.clientX, pointer.clientY, true).forEach(element => ts_active_bubble_list.push(element));
        }

        if (pointer.pointerType === "mouse") {
            getElementsAt(pointer.clientX, pointer.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none"));
            getElementsAt(pointer.clientX, pointer.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_none-bubble"));
        }
    }

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

function handle_pointerdown(e) {
    lastInteractionType = e.pointerType;

    pointers.set(e.pointerId, {
        pointerType: e.pointerType,
        clientX: e.clientX,
        clientY: e.clientY,
        isPressed: e.buttons !== 0
    });

    getElementsAt(e.clientX, e.clientY, false).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active"));
    getElementsAt(e.clientX, e.clientY, true).forEach(element => element.classList.add("touch_hybrid_safe_hover-ts_active-bubble"));

    update();
}

function handle_pointermove(e) {
    lastInteractionType = e.pointerType;

    pointers.set(e.pointerId, {
        pointerType: e.pointerType,
        clientX: e.clientX,
        clientY: e.clientY,
        isPressed: e.buttons !== 0
    });

    update();
}

function handle_pointerup_pointercancel(e) {
    pointers.set(e.pointerId, {
        pointerType: e.pointerType,
        clientX: e.clientX,
        clientY: e.clientY,
        isPressed: e.buttons !== 0
    });

    if (e.pointerType !== "mouse") {
        update();
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
    
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_hover-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_active-bubble");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none");
    removeClassFromAllElements("touch_hybrid_safe_hover-ts_none-bubble");

    pointers.clear();

    enabled = false;
}

export function isEnabled() {
    return enabled;
}

export function getLastInteractionType() {
    return lastInteractionType;
}
