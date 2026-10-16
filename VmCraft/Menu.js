import * as Gui from './Gui.js';
import * as WorldManager from './WorldManager.js';
import * as WorldEncoder from './WorldEncoder.js';
import * as Game from './Game.js';
import * as Modals from './Modals.js';
import * as Kastili from './Kastili.js';
import * as Utils from './Utils.js';
import * as Consts from './Consts.js';

// -------------------------------- create menu

const submenuList = {}

function addSubMenu(name) {
    const submenu = document.createElement("div")
    submenu.classList.add("modal-window")
    submenu.classList.add("game-menu")
    submenu.id = "menu-" + name
    submenuList[name] = submenu
}

function getMenu(name) {
    if (typeof name === 'string') {
        return submenuList[name]
    }
    return name
}

function openSubMenu(name) {
    Gui.openModalWindow(getMenu(name))
}

export function addButton(menu, name, callback=null, height=null, additionalButtons=[]) {
    const btn = document.createElement("button")
    btn.style.flex = '1'
    btn.innerHTML = name
    btn.classList.add("menu-button")
    if (height) btn.style.height = height
    if (callback) btn.addEventListener("pointerup", callback)

    if (additionalButtons != true) {
        const btnhost = document.createElement("div")
        btnhost.classList.add("game-menu-hor")
        
        btnhost.appendChild(btn)
        additionalButtons.forEach(additionalBtn => {
            btnhost.appendChild(additionalBtn)
        })

        getMenu(menu).appendChild(btnhost)
    }

    return btn
}

function addTitle(menu, name) {
    const title = document.createElement("div")
    title.textContent = name
    title.classList.add("menu-title")

    getMenu(menu).appendChild(title)
    return title
}

function addScrollBox(menu) {
    const scrollbox = document.createElement("div")
    scrollbox.classList.add("scroll-box")
    Kastili.attachScrollboxPadding(scrollbox)

    getMenu(menu).appendChild(scrollbox)
    return scrollbox
}

function cleanMenu(menu) {
    getMenu(menu).innerHTML = ''
}

addSubMenu("main")
addSubMenu("worlds")

// -------------------------------- worlds menu

function isSelectedWorld(world) {
    //return world.id === Game.world.worldId
    return world.id === WorldManager.getCurrentWorldId()
}

function smallSecondButton(btn) {
    btn.style.flex = ''
    btn.style.width = '60px'
}

function highlightButton(btn) {
    btn.classList.add("menu-button-highlight")
}

function renameWorldModal(world) {
    Modals.modalInput("NEW WORLD", null, world.name).then(name => {
        if (name) {
            name = name.trim()
            if (name != world.name) {
                WorldManager.renameWorld(world.id, name).then(refreshWorldsList)
            }
        }
    })
}

const deleteWorldDescription = `Do you really want to delete your world 😥?
maybe it's better to preserve it for future generations?...
Spare your labor...`

function deleteWorldModal(world) {
    if (isSelectedWorld(world)) {
        Modals.modalShow("DELETE FAILED", "the active world cannot be deleted")
    } else {
        Modals.modalYesno("DELETE WORLD? (" + world.name + ")", deleteWorldDescription).then(accept => {
            if (accept) {
                WorldManager.deleteWorld(world.id)
                refreshWorldsList()
            }
        })
    }
}

function newWorldModal() {
    Modals.modalInput("NEW WORLD", null, "world " + Utils.getRandomSuffix()).then(name => {
        if (name) {
            name = name.trim()
            WorldManager.saveWorld({name}, true).then(refreshWorldsList)
        }
    })
}

function importWorldModal() {
    Modals.windowSelectFile(Consts.world_export_extension, false).then(world => {
        world = WorldEncoder.decodeWorld(world)
        world.id = undefined
        WorldManager.saveWorld(world, true)
        refreshWorldsList()
        Modals.modalShow("WORLD IS IMPORTED", `name: ${world.name}`)
    }).catch(err => {
        Modals.modalShow("IMPORT ERROR", err)
        console.error(`Failed to import: ${err}`)
    })
}

function addWorldToList(menu, world) {
    const highlight = isSelectedWorld(world)

    const btn_export = addButton(menu, '<img class="button-img" src="textures/export.png"></img>', () => {
        Modals.windowExportFile(WorldEncoder.encodeWorld(world), world.name, Consts.world_export_extension)
    }, null, true)

    const btn_rename = addButton(menu, '<img class="button-img" src="textures/rename.png"></img>', () => {
        renameWorldModal(world)
    }, null, true)

    const btn_delete = addButton(menu, '<img class="button-img" src="textures/delete.png"></img>', () => {
        deleteWorldModal(world)
    }, null, true)

    smallSecondButton(btn_export)
    smallSecondButton(btn_rename)
    smallSecondButton(btn_delete)

    const btn_loadWorld = addButton(menu, world.name, () => {
        WorldManager.getWorldFromId(world.id).then(actual_world => {
            Game.loadWorld(actual_world)
        })
        refreshWorldsList()
    }, null, [btn_export, btn_rename, btn_delete])
    btn_loadWorld.style.padding = "0px 8px 0px 8px";

    if (highlight) {
        highlightButton(btn_loadWorld)
        highlightButton(btn_export)
        highlightButton(btn_rename)
        highlightButton(btn_delete)
    }
}

function refreshWorldsList() {
    cleanMenu("worlds")
    addTitle("worlds", "WORLDS")

    const scrollbox = addScrollBox("worlds")

    WorldManager.worldList().then(worlds => {
        worlds.forEach(world => {
            addWorldToList(scrollbox, world)
        })
    })

    const serviceHeight = '40px'
    addButton("worlds", "< BACK", () => {
        Gui.closeModalWindow()
    }, serviceHeight, [
        addButton("worlds", "NEW WORLD", () => {
            newWorldModal()
        }, serviceHeight, true),

        addButton("worlds", "IMPORT", () => {
            importWorldModal()
        }, serviceHeight, true)
    ])
}

// -------------------------------- main menu

addTitle("main", "VmCraft")

addButton("main", "RESUME", () => {
    Gui.closeModalWindow()
})

addButton("main", "WORLDS", () => {
    refreshWorldsList()
    openSubMenu("worlds")
})

addButton("main", "SAVE", () => {
    Game.world.save()
})

addButton("main", "EXIT", () => {
    
})

export function openModal() {
    openSubMenu("main")
}
