const objectAssotiation = {}
const objectAssotiationReverse = new Map()

export function registerType(name, cls) {
    objectAssotiation[name] = cls
    objectAssotiationReverse.set(cls, name)
}

export function getName(obj) {
    const cls = typeof obj === "function" ? obj : obj.constructor
    return objectAssotiationReverse.get(cls)
}

export function getClass(name) {
    return objectAssotiation[name]
}
