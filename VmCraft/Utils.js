import * as Three from "three"
import * as Consts from "./Consts.js";

export function detectDoubleKey(keyCode, callback, delay = 300) {
    let lastTime = 0
    let pressed = false

    const keydown = (e) => {
        if (e.code === keyCode) {
            if (pressed) return
            pressed = true

            const now = performance.now();
            if (now - lastTime <= delay) {
                callback(e);
            }
            lastTime = now;
        }
    }

    const keyup = (e) => {
        if (e.code === keyCode) pressed = false
    }

    return [keydown, keyup]
}

async function loadPart(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Load error ${url}: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}

export async function loadAndCombineImages(urls) {
    const parts = await Promise.all(urls.map(loadPart));
    const totalSize = parts.reduce((sum, buf) => sum + buf.byteLength, 0);
    const combinedBuffer = new Uint8Array(totalSize);

    let offset = 0;
    for (const part of parts) {
        combinedBuffer.set(new Uint8Array(part), offset);
        offset += part.byteLength;
    }

    return combinedBuffer.buffer;
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomHexNum() {
    const randomInt = Math.floor(Math.random() * 16);
    return randomInt.toString(16).toUpperCase()
}

export function getRandomSuffix() {
    let suffix = ""
    for (let i = 0; i < 4; i++) {
        suffix += getRandomHexNum()
    }
    return suffix
}

export function getVecFromArr(arr) {
    return new Three.Vector3(arr[0], arr[1], arr[2])
}

export function getVecFromArrCheck(arrOrVec) {
    if (arrOrVec?.isVector3) return arrOrVec
    return new Three.Vector3(arrOrVec[0], arrOrVec[1], arrOrVec[2])
}

export function getArrFromVec(vec) {
    return [vec.x, vec.y, vec.z]
}

export function getVecFromObj(obj) {
    return new Three.Vector3(obj.x, obj.y, obj.z)
}

export function compareVectorAndArray(vec, arr) {
    return vec.x === arr[0] && vec.y === arr[1] && vec.z === arr[2]
}

const TILE_SIZE = 1 / Consts.atlas_tiles

export function tileUV(tileIndex) {
    const tx = tileIndex % Consts.atlas_tiles
    const ty = Math.floor(tileIndex / Consts.atlas_tiles)
    // переворачиваем Y, потому что в three.js UV идут снизу вверх, а текстуры обычно сверху вниз
    const u0 = tx * TILE_SIZE
    const v0 = 1 - (ty + 1) * TILE_SIZE
    return { u0, v0, u1: u0 + TILE_SIZE, v1: v0 + TILE_SIZE }
}

export function u8ToBase64(u8) {
    let s = ""
    const chunkSize = 8192

    for (let i = 0; i < u8.length; i += chunkSize) {
        s += String.fromCharCode.apply(
            null,
            u8.subarray(i, i + chunkSize)
        )
    }

    return btoa(s)
}

export function base64ToU8(b64) {
    const s = atob(b64)
    const u8 = new Uint8Array(s.length)
    for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i)
    return u8
}
