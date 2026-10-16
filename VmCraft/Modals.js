import * as Gui from './Gui.js'
import * as Menu from './Menu.js'

function createBaseModal(title) {
    const modal = document.createElement("div")
    modal.classList.add("modal-window")
    modal.classList.add("modal-menu")

    const titleObj = document.createElement("div")
    titleObj.classList.add("menu-title")
    titleObj.textContent = title
    modal.appendChild(titleObj)

    return modal
}

function addModalDescription(modal, description) {
    const descriptionObj = document.createElement("div")
    descriptionObj.classList.add("menu-description")
    descriptionObj.textContent = description
    modal.appendChild(descriptionObj)
}

function addModalInput(modal, defaultInput) {
    const inputObj = document.createElement("input")
    inputObj.classList.add("menu-input-text")
    inputObj.type = 'text'
    inputObj.value = defaultInput

    modal.appendChild(inputObj)
    return inputObj
}

export async function modalInput(title, description=null, defaultInput="") {
    const modal = createBaseModal(title)
    if (description) addModalDescription(modal, description)

    const inputObj = addModalInput(modal, defaultInput)

    const enterButton = Menu.addButton(modal, "Enter")
    const cancelButton = Menu.addButton(modal, "Cancel", null, null, [enterButton])

    return new Promise((resolve) => {
        let result = null
        let current = defaultInput

        cancelButton.addEventListener("click", () => {
            Gui.closeModalWindow()
        })

        enterButton.addEventListener("click", () => {
            result = current
            Gui.closeModalWindow()
        })

        inputObj.addEventListener("input", (e) => {
            current = e.target.value
        })

        inputObj.addEventListener("keydown", (e) => {
            if (e.key == "Enter") {
                result = current
                Gui.closeModalWindow()
            }
        })

        Gui.openModalWindow(modal, () => {
            resolve(result)
        })
    });
}

export function modalYesno(title, description=null) {
    const modal = createBaseModal(title)
    if (description) addModalDescription(modal, description)

    const yesButton = Menu.addButton(modal, "Yes")
    const noButton = Menu.addButton(modal, "No", null, null, [yesButton])

    return new Promise((resolve) => {
        let result = null

        noButton.addEventListener("click", () => {
            result = false
            Gui.closeModalWindow()
        })

        yesButton.addEventListener("click", () => {
            result = true
            Gui.closeModalWindow()
        })

        Gui.openModalWindow(modal, () => {
            resolve(result)
        })
    });
}

export function modalShow(title, description=null) {
    const modal = createBaseModal(title)
    if (description) addModalDescription(modal, description)

    const okayButton = Menu.addButton(modal, "Okay")

    return new Promise((resolve) => {
        okayButton.addEventListener("click", () => {
            Gui.closeModalWindow()
        })

        Gui.openModalWindow(modal, () => {
            resolve()
        })
    });
}

export function windowSelectFile(ext=null, binary=false) {
    return new Promise((resolve, reject) => {
        const input = document.createElement("input")
        input.type = "file"
        if (ext != null) input.accept = `.${ext}`

        input.onchange = async (event) => {
            const file = event.target.files[0]
            if (!file) return resolve(null)

            try {
                if (binary) {
                    const buffer = await file.arrayBuffer()
                    const bytes = new Uint8Array(buffer)
                    resolve(bytes)
                } else {
                    const text = await file.text()
                    resolve(text)
                }
            } catch (err) {
                console.error('Select failed:', err)
                void modalShow("FAILED TO SELECT FILE", err.message ?? String(err))

                reject(err)
            }
        }

        input.click()
    })
}

export async function windowExportFile(data, suggestedName='export', ext=null) {
    try {
        const exportSettings = {
            suggestedName: ext != null ? (suggestedName + "." + ext) : suggestedName
        }

        if (ext != null) {
            exportSettings.types = [{
                description: `${ext}`,
                accept: {[`application/octet-stream`]: [`.${ext}`] }
            }]
        }

        const handle = await window.showSaveFilePicker(exportSettings)
        const writable = await handle.createWritable()
        await writable.write(data)
        await writable.close()
        console.log('File saved')

        return true
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Save failed:', err)
            void modalShow("FAILED TO SAVE FILE", err.message ?? String(err))
        }
    }

    return false
}
