import * as Three from "three"
import * as Utils from "../Utils.js";

export class GameBasic {
    constructor(renderer, scene) {
        this.chunkSize = new Three.Vector3(32, 32, 32)
        this.chunkBlockCount = this.chunkSize.x * this.chunkSize.y * this.chunkSize.z

        this.renderer = renderer
        this.scene = scene

        this.atlasTexture = new Three.TextureLoader().load("textures/atlas.png")
        this.atlasTexture.magFilter = Three.NearestFilter
        this.atlasTexture.minFilter = Three.NearestMipmapNearestFilter
        this.atlasTexture.generateMipmaps = true
        this.atlasTexture.colorSpace = Three.SRGBColorSpace

        this.blockMaterial = new Three.MeshLambertMaterial({ map: this.atlasTexture })
    }
}
