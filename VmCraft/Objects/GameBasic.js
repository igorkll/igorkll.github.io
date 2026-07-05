import * as Three from "three"

export class GameBasic {
    constructor(renderer, scene) {
        this.chunkSize = new Three.Vector3(32, 32, 32)
        this.chunkBlockCount = this.chunkSize.x * this.chunkSize.y * this.chunkSize.z

        this.renderer = renderer
        this.scene = scene
    }
}
