import * as Three from "three"
import * as Utils from "../Utils.js"
import { Player } from './Player.js'
import { Robot } from './Robot.js'
import { Chunk } from './Chunk.js'

export class World {
    constructor(gameBasic, worldData) {
        this.gameBasic = gameBasic
        this.worldId = worldData.id

        this.loadWorld(worldData)
    }

    loadWorld(worldData) {
        this.destroy()

        this.createPlayer(new Three.Vector3(0, 10, 0))
        this.createInteractive(new Three.Vector3(50, 0, 0), Robot)
        //this.createInteractive(new Three.Vector3(50, 0, 50), Robot)
        //this.createInteractive(new Three.Vector3(50, 0, 100), Robot)
    }

    update(delta) {
        this.updateInteractive(this.player)
        this.player.update(delta)

        for (let i = 0; i < this.chunks.length; i++) {
            const chunk = this.chunks[i]
            chunk.update(delta)
        }

        for (let i = 0; i < this.interactives.length; i++) {
            const interactive = this.interactives[i]
            this.updateInteractive(interactive)
            interactive.update(delta)
        }
    }

    updateInteractivePrepair(interactive) {
        interactive.world = this
    }

    updateInteractive(interactive) {
        this.updateInteractivePrepair(interactive)
        interactive.chunk = this.getChunk(this.getChunkPositionFromGlobalPosition(interactive.data.pos))
    }

    loadChunk(chunkPosition) {
        const chunk = new Chunk(this.gameBasic, this, chunkPosition)
        this.chunks.push(chunk)
        return chunk
    }

    unloadChunk(chunkPosition) {
        this.chunks = this.chunks.filter(obj => {
            if (obj.pos.equals(chunkPosition)) {
                obj.destroy()
                removed.push(obj)
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

    createInteractive(globalPosition, constructor, ...args) {
        const interactive = new constructor(this.gameBasic, globalPosition, ...args)
        this.updateInteractivePrepair(interactive)
        interactive.init()
        this.updateInteractive(interactive)
        this.interactives.push(interactive)
        return interactive
    }

    createPlayer(playerPosition) {
        this.getChunk(this.getChunkPositionFromGlobalPosition(playerPosition))
        const player = new Player(this.gameBasic, playerPosition)
        this.updateInteractivePrepair(player)
        player.init()
        this.updateInteractive(player)
        this.player = player
        return player
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
        let chunk = this.chunks.find(obj => obj.data.pos.equals(chunkPosition))
        if (forceLoad && chunk == null) {
            chunk = this.loadChunk(chunkPosition)
        }
        return chunk
    }
    
    destroy() {
        if (this.player != null) {
            this.player.destroy()
            this.player = null
        }
    
        if (this.chunks != null) {
            for (let i = 0; i < this.chunks.length; i++) {
                this.chunks[i].destroy()
            }
        }
        this.chunks = []

        if (this.interactives != null) {
            for (let i = 0; i < this.interactives.length; i++) {
                this.interactives[i].destroy()
            }
        }
        this.interactives = []
    }
}
