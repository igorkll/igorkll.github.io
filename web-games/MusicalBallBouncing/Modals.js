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