import * as Three from "three"
import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'
import { Chunk } from './Chunk.js'
import * as Consts from '../Consts.js'
import * as ObjectAssotiation from "../ObjectAssotiation.js"
import * as WorldManager from '../WorldManager.js';

export class World {
    constructor(gameBasic, worldData) {
        this.gameBasic = gameBasic
        this.worldId = worldData.id
        this.worldName = worldData.name

        this.chunkLoadingTimerValue = Consts.chunk_loading_update_interval

        this.loadWorld(worldData)
    }

    _defWorld() {
        console.log("loading world: default")

        this.player = this.createCharacter({
            pos: new Three.Vector3(0, 10, 0)
        }, Player)
        
        this.createInteractive({
            pos: new Three.Vector3(10, 10, 0)
        }, Robot)

        for (let ix = -15; ix <= 15; ix++) {
            for (let iz = -15; iz <= 15; iz++) {
                this.setBlock(new Three.Vector3(ix, 0, iz), 1)
            }
        }
    }

    _loadWorld(worldData) {
        console.log("loading world: ", worldData)
        
        this.allChunksData = worldData.data.allChunksData || []
        this.player = this.createCharacter(worldData.data.playerData, Player)
    }

    loadWorld(worldData) {
        this.destroy()

        if (worldData?.data != null) {
            this._loadWorld(worldData)
        } else {
            this._defWorld()
        }
    }

    updateLoadedChunks(chunkLoaders) {
        const needed = new Set()
        const size = this.gameBasic.chunkSize
    
        for (const loader of chunkLoaders) {
            const dist_h = loader.dist
            const dist_v = loader.dist * Consts.chunk_loading_ver_distance_mul
    
            const cx = Math.floor(loader.pos.x / size.x) //center
            const cy = Math.floor(loader.pos.y / size.y)
            const cz = Math.floor(loader.pos.z / size.z)
    
            const rx = Math.ceil(dist_h / size.x) //radius
            const ry = Math.ceil(dist_v / size.y)
            const rz = Math.ceil(dist_h / size.z)
    
            for (let ix = cx - rx; ix <= cx + rx; ix++)
                for (let iy = cy - ry; iy <= cy + ry; iy++)
                    for (let iz = cz - rz; iz <= cz + rz; iz++)
                        needed.add(this.getChunk(new Three.Vector3(ix, iy, iz)))
        }
    
        for (let i = this.loadedChunks.length - 1; i >= 0; i--) {
            const chunk = this.loadedChunks[i]
            if (!needed.has(chunk)) this.unloadChunk(chunk)
        }
    }

    timerHandle() {
        const chunkLoadersPositions = [{
            pos: this.player.data.pos,
            dist: Consts.chunk_loading_distance
        }]
        this.updateLoadedChunks(chunkLoadersPositions)
    }

    update(delta) {
        this.updateInteractive(this.player)
        this.player.update(delta)

        for (let i = 0; i < this.loadedChunks.length; i++) {
            const chunk = this.loadedChunks[i]
            chunk.update(delta)
        }

        for (let i = 0; i < this.interactives.length; i++) {
            const interactive = this.interactives[i]
            this.updateInteractive(interactive)
            interactive.update(delta)
        }

        this.chunkLoadingTimerValue += delta
        if (this.chunkLoadingTimerValue >= Consts.chunk_loading_update_interval) {
            this.chunkLoadingTimerValue = 0
            this.timerHandle()
        }
    }

    updateInteractivePrepair(interactive) {
        interactive.world = this
    }

    updateInteractive(interactive) {
        this.updateInteractivePrepair(interactive)
        interactive.chunk = this.getChunk(this.getChunkPositionFromGlobalPosition(interactive.data.pos))
    }

    _genChunk(chunk) {
        
    }

    _newChunk(chunkPosition) {
        const chunk = new Chunk(this.gameBasic, this)
        chunk.data.pos = chunkPosition
        this.loadedChunks.push(chunk)
        this.updateChunkData(chunk)
        this._genChunk(chunk)
        return chunk
    }

    _loadChunk(chunkData) {
        const chunk = new Chunk(this.gameBasic, this)
        chunk.setSaveData(chunkData)
        this.loadedChunks.push(chunk)

        if (chunkData.interactivesData != null) {
            chunkData.interactivesData.forEach(element => {
                this.createInteractive(element[1], ObjectAssotiation.getClass(element[0]))
            })
        }

        return chunk
    }

    loadChunk(chunkPosition) {
        const chunkData = this.getChunkData(chunkPosition)
        if (chunkData == null) {
            return this._newChunk(chunkPosition)
        } else {
            return this._loadChunk(chunkData)
        }
    }

    unloadChunk(chunk) {
        this.loadedChunks = this.loadedChunks.filter(checkChunk => {
            if (chunk == checkChunk) {
                this.updateChunkData(chunk)

                for (let i = this.interactives.length - 1; i >= 0; i--) {
                    const obj = this.interactives[i]
                    if (obj.chunk == chunk) {
                        obj.destroy()
                        this.interactives.splice(i, 1)
                    }
                }

                chunk.destroy()
                return false
            }
            return true
        })
    }

    setBlock(globalPosition, blockId) {
        const chunkPosition = this.getChunkPositionFromGlobalPosition(globalPosition)
        const chunk = this.getChunk(chunkPosition)
        if (chunk != null) {
            const localPosition = chunk.getLocalPositionFromGlobalPosition(globalPosition)
            chunk.setBlock(localPosition, blockId)
            return true
        }
        return false
    }

    getBlock(globalPosition) {
        const chunkPosition = this.getChunkPositionFromGlobalPosition(globalPosition)
        const chunk = this.getChunk(chunkPosition)
        if (chunk != null) {
            const localPosition = chunk.getLocalPositionFromGlobalPosition(globalPosition)
            return chunk.getBlock(localPosition)
        }
        return null
    }

    createInteractive(data, constructor, ...args) {
        const interactive = new constructor(this.gameBasic, ...args)
        interactive.setSaveData(Object.assign(interactive.getSaveData(), data))
        this.updateInteractivePrepair(interactive)
        interactive.init()
        this.updateInteractive(interactive)
        this.interactives.push(interactive)
        return interactive
    }

    createCharacter(data, constructor, ...args) {
        const character = new constructor(this.gameBasic, ...args)
        character.setSaveData(Object.assign(character.getSaveData(), data))
        this.updateInteractivePrepair(character)
        character.init()
        this.updateInteractive(character)

        return character
    }

    getChunkPositionFromGlobalPosition(pos) {
        const chunkSize = this.gameBasic.chunkSize
        return new Three.Vector3(
            Math.floor(pos.x / chunkSize.x),
            Math.floor(pos.y / chunkSize.y),
            Math.floor(pos.z / chunkSize.z)
        )
    }

    getChunk(chunkPosition, forceLoad=true) {
        let chunk = this.loadedChunks.find(obj => obj.data.pos.equals(chunkPosition))
        if (forceLoad && chunk == null) {
            chunk = this.loadChunk(chunkPosition)
        }
        return chunk
    }
    
    destroy() {
        this.allChunksData = []

        if (this.player != null) {
            this.player.destroy()
            this.player = null
        }
    
        if (this.loadedChunks != null) {
            for (let i = 0; i < this.loadedChunks.length; i++) {
                this.loadedChunks[i].destroy()
            }
        }
        this.loadedChunks = []

        if (this.interactives != null) {
            for (let i = 0; i < this.interactives.length; i++) {
                this.interactives[i].destroy()
            }
        }
        this.interactives = []
    }

    getChunkData(chunkPosition) {
        const chunkData = this.allChunksData.find(obj => Utils.compareVectorAndArray(chunkPosition, obj.pos))
        if (chunkData == null) return null
        return chunkData
    }

    getChunkSaveData(chunk) {
        const saveData = chunk.getSaveData()

        const additionalChunkData = {
            interactivesData: []
        }

        for (let i = 0; i < this.interactives.length; i++) {
            const obj = this.interactives[i]
            if (obj.chunk == chunk) {
                additionalChunkData.interactivesData.push([
                    ObjectAssotiation.getName(obj),
                    obj.getSaveData()
                ])
            }
        }

        Object.assign(saveData, additionalChunkData)
        return saveData
    }

    updateChunkData(chunk) {
        const chunkData = this.allChunksData.find(obj => Utils.compareVectorAndArray(chunk.data.pos, obj.pos))
        const saveData = this.getChunkSaveData(chunk)
        if (chunkData == null) {
            this.allChunksData.push(saveData)
        } else {
            Object.assign(chunkData, saveData)
        }
    }

    serializeData() {
        for (let i = 0; i < this.loadedChunks.length; i++) {
            this.updateChunkData(this.loadedChunks[i])
        }

        const worldData = {
            playerData: this.player.getSaveData(),
            allChunksData: this.allChunksData
        }

        return worldData
    }

    serialize() {
        const world = {}
        world.id = this.worldId
        world.name = this.worldName
        world.data = this.serializeData()

        return world
    }

    save() {
        return WorldManager.saveWorld(this.serialize())
    }

    raycastBlock(origin, direction, maxDistance) {
        let x = Math.floor(origin.x)
        let y = Math.floor(origin.y)
        let z = Math.floor(origin.z)

        const stepX = Math.sign(direction.x)
        const stepY = Math.sign(direction.y)
        const stepZ = Math.sign(direction.z)

        // расстояние, которое надо пройти по каждой оси, чтобы пересечь следующую границу
        const tDeltaX = stepX !== 0 ? Math.abs(1 / direction.x) : Infinity
        const tDeltaY = stepY !== 0 ? Math.abs(1 / direction.y) : Infinity
        const tDeltaZ = stepZ !== 0 ? Math.abs(1 / direction.z) : Infinity

        // расстояние до первой границы по каждой оси
        let tMaxX = stepX > 0
            ? (Math.floor(origin.x) + 1 - origin.x) / direction.x
            : (stepX < 0 ? (Math.floor(origin.x) - origin.x) / direction.x : Infinity)
        let tMaxY = stepY > 0
            ? (Math.floor(origin.y) + 1 - origin.y) / direction.y
            : (stepY < 0 ? (Math.floor(origin.y) - origin.y) / direction.y : Infinity)
        let tMaxZ = stepZ > 0
            ? (Math.floor(origin.z) + 1 - origin.z) / direction.z
            : (stepZ < 0 ? (Math.floor(origin.z) - origin.z) / direction.z : Infinity)

        // нормаль грани, через которую вошли в текущий блок
        let normal = { x: 0, y: 0, z: 0 }

        for (let i = 0; i < 256; i++) {
            const block = this.getBlock(new Three.Vector3(x, y, z))
            if (block != null && block !== 0) {
                return {
                    block: Utils.getVecFromObj({ x, y, z }),
                    normal: Utils.getVecFromObj(normal)       // ← откуда прилетел луч: тут ставить новый блок
                }
            }

            // шагаем в ту ось, где ближайшая граница
            if (tMaxX < tMaxY && tMaxX < tMaxZ) {
                if (tMaxX > maxDistance) return null
                x += stepX
                tMaxX += tDeltaX
                normal = { x: -stepX, y: 0, z: 0 }
            } else if (tMaxY < tMaxZ) {
                if (tMaxY > maxDistance) return null
                y += stepY
                tMaxY += tDeltaY
                normal = { x: 0, y: -stepY, z: 0 }
            } else {
                if (tMaxZ > maxDistance) return null
                z += stepZ
                tMaxZ += tDeltaZ
                normal = { x: 0, y: 0, z: -stepZ }
            }
        }

        return null
    }
}
