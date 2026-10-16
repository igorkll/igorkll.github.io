import * as Uint8Encoder from './Uint8Encoder.js'

export function encodeWorld(decodedWorldObj) {
    const encodedWorldObj = {}

    encodedWorldObj.id = decodedWorldObj.id
    encodedWorldObj.name = decodedWorldObj.name

    if (decodedWorldObj?.data != null) {
        encodedWorldObj.data = Uint8Encoder.encodePart(decodedWorldObj.data)
    }

    return JSON.stringify(encodedWorldObj)
}

export function decodeWorld(encodedWorldStr) {
    const encodedWorldObj = JSON.parse(encodedWorldStr)
    const decodedWorldObj = {}

    decodedWorldObj.id = encodedWorldObj.id
    decodedWorldObj.name = encodedWorldObj.name

    if (encodedWorldObj?.data != null) {
        decodedWorldObj.data = Uint8Encoder.decodePart(encodedWorldObj.data)
    }

    return decodedWorldObj
}