import * as Gui from './Gui.js'

export async function modalInput(title, defaultInput="") {
    return defaultInput
}

export async function modalYesno(title, description=null) {
    return true
}

export async function modalShow(title, description=null) {

}

export async function windowSelectJsonFile() {
    return new Promise((resolve, reject) => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json, application/json'
        input.onchange = (event) => {
            const file = event.target.files[0]
            if (!file) {
                reject(new Error('File not select'))
                return
            }
            const reader = new FileReader()
            reader.onload = (e) => {
                try {
                    resolve(JSON.parse(e.target.result))
                } catch (err) {
                    reject(new Error('incorent json JSON'))
                }
            }
            reader.onerror = () => reject(new Error('Error reading file'))
            reader.readAsText(file)
        }
        input.click()
    })
}

export async function windowExportFileAdvanced(data, suggestedName='export', ext="json") {
    try {
        const acceptKey = `application/${ext}`
        const handle = await window.showSaveFilePicker({
            suggestedName: suggestedName + "." + ext,
            types: [{
                description: `${ext}-file`,
                accept: {[acceptKey]: [`.${ext}`] }
            }]
        })
        const writable = await handle.createWritable()
        const json = JSON.stringify(data, null, 2)
        await writable.write(json)
        await writable.close()
        console.log('File saved')
    } catch (err) {
        if (err.name !== 'AbortError') {
            console.error('Save failed:', err)
            modalShow("FAILED TO SAVE FILE", err)
        }
    }
}
