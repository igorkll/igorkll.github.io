import * as Utils from './Utils.js'

export function encodePart(part) {
    return Utils.u8ToBase64(window.BSON.serialize(part))
}

export function decodePart(encodedPart) {
    return window.BSON.deserialize(Utils.base64ToU8(encodedPart))
}

export function encodeParts(parts) {
    const encodedParts = []

    for (let i = 0; i < parts.length; i++) {
        encodedParts[i] = encodePart(parts[i])
    }

    return encodedParts
}

export function decodeParts(encodedParts) {
    const parts = []

    for (let i = 0; i < encodedParts.length; i++) {
        parts[i] = decodePart(encodedParts[i])
    }

    return parts
}

export function encodeWorld(decodedWorldObj) {
    const encodedWorldObj = {}

    encodedWorldObj.id = decodedWorldObj.id
    encodedWorldObj.name = decodedWorldObj.name

    if (decodedWorldObj?.data != null) {
        encodedWorldObj.data = {
            playerData: encodePart(decodedWorldObj.data.playerData),
            allChunksData: encodeParts(decodedWorldObj.data.allChunksData)
        }
    }

    return JSON.stringify(encodedWorldObj)
}

export function decodeWorld(encodedWorldStr) {
    const encodedWorldObj = JSON.parse(encodedWorldStr)
    const decodedWorldObj = {}

    decodedWorldObj.id = encodedWorldObj.id
    decodedWorldObj.name = encodedWorldObj.name

    if (encodedWorldObj?.data != null) {
        decodedWorldObj.data = {
            playerData: decodePart(encodedWorldObj.data.playerData),
            allChunksData: decodeParts(encodedWorldObj.data.allChunksData)
        }
    }

    return decodedWorldObj
}