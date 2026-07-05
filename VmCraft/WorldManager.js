import { Dexie } from './dexie.mjs'

// ----------------------------------------- init database

const db = new Dexie("Worlds")

db.version(1).stores({
    worlds: '++id, name'
})

// -----------------------------------------

export async function getWorldCount() {
    try {
        return await db.worlds.count()
    } catch (error) {
        console.error('Failed to get world count:', error)
        return null
    }
}

export async function worldList() {
    try {
        return await db.worlds.toArray()
    } catch (error) {
        console.error('Failed to get worlds:', error)
        return null
    }
}

export async function getWorldFromName(name) {
    try {
        const world = await db.worlds.where('name').equals(name).first()
        return world || null
    } catch (error) {
        console.error('Failed to find world:', error)
        return null
    }
}

export async function saveWorld(world, forceNew=false) {
    try {
        let existing
        if (forceNew) {
            existing = false
        } else {
            existing = await db.worlds.where('id').equals(world.id).first()
        }

        if (existing) {
            await db.worlds.put(world)
            console.log(`World "${world.name}" saved`)
            return world
        } else {
            const id = await db.worlds.add(world)
            world.id = id
            console.log(`World "${world.name}" created`)
            return world
        }
    } catch (error) {
        console.error('Failed saving world:', error)
    }
}

export async function renameWorld(id, newName) {
    try {
        const world = await db.worlds.get(id);
        if (!world) {
            throw new Error(`World with ID ${id} not found`);
        }

        await db.worlds.update(id, { name: newName });
    } catch (error) {
        console.error('Rename failed:', error);
    }
}

export async function deleteWorld(id) {
    try {
        await db.worlds.delete(id);
        console.log(`World with ID ${id} deleted`);
    } catch (error) {
        console.error('Delete failed:', error);
        throw error;
    }
}
