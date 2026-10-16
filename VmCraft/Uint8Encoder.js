import * as Utils from './Utils.js'

const MARKER = "__u8"

export function encodePart(value) {
    // Uint8Array → { __u8: "base64..." }
    if (value instanceof Uint8Array) {
        return { [MARKER]: Utils.u8ToBase64(value) }
    }

    // ArrayBuffer → тоже как бинарник
    if (value instanceof ArrayBuffer) {
        return { [MARKER]: Utils.u8ToBase64(new Uint8Array(value)) }
    }

    // Массив → рекурсивно каждый элемент
    if (Array.isArray(value)) {
        const out = new Array(value.length)
        for (let i = 0; i < value.length; i++) {
            out[i] = encodePart(value[i])
        }
        return out
    }

    // Обычный объект (не null) → рекурсивно по ключам
    if (value !== null && typeof value === "object") {
        const out = {}
        for (const key of Object.keys(value)) {
            out[key] = encodePart(value[key])
        }
        return out
    }

    // Примитив: строка, число, boolean, null, undefined
    return value
}

export function decodePart(value) {
    // { __u8: "base64..." } → Uint8Array
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
        if (typeof value[MARKER] === "string") {
            return Utils.base64ToU8(value[MARKER])
        }

        const out = {}
        for (const key of Object.keys(value)) {
            out[key] = decodePart(value[key])
        }
        return out
    }

    // Массив → рекурсивно
    if (Array.isArray(value)) {
        const out = new Array(value.length)
        for (let i = 0; i < value.length; i++) {
            out[i] = decodePart(value[i])
        }
        return out
    }

    // Примитив
    return value
}