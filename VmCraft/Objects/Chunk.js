import * as Three from "three"
import * as Utils from "../Utils.js"
import * as Blocks from "../Blocks.js"
import * as Gui from "../Gui.js"

export class Chunk {
    constructor(gameBasic, world) {
        this.gameBasic = gameBasic
        this.world = world

        this.data = {
            pos: new Three.Vector3(0, 0, 0)
        }

        this.needUpdateMesh = true
        this.blocks = new Uint8Array(this.gameBasic.chunkBlockCount)

        this.loadChunk()
    }

    getSaveData() {
        return Object.assign({}, this.data, {
            pos: Utils.getArrFromVec(this.data.pos),
            //blocks: Array.from(this.blocks)
            blocks: this.blocks
        })
    }

    setSaveData(data) {
        this.data = {
            pos: Utils.getVecFromArrCheck(data.pos)
        }

        //this.blocks = new Uint8Array(data.blocks)
        this.blocks = data.blocks
        this.needUpdateMesh = true
    }

    updateMesh() {
        if (this.object != null) {
            this.gameBasic.scene.remove(this.object);
            this.object.geometry.dispose();
            this.object = null;
        }

        const positions = [];
        const normals = [];
        const indices = [];
        const uvs = [];
    
        function addFace(x, y, z, dx, dy, dz, nx, ny, nz, uvRect) {
            const half = 0.5;
            let v1, v2, v3, v4;

            if (nx === 1) { // +X
                v1 = [x+half, y-half, z-half];
                v2 = [x+half, y+half, z-half];
                v3 = [x+half, y+half, z+half];
                v4 = [x+half, y-half, z+half];
            } else if (nx === -1) { // -X
                v1 = [x-half, y-half, z+half];
                v2 = [x-half, y+half, z+half];
                v3 = [x-half, y+half, z-half];
                v4 = [x-half, y-half, z-half];
            } else if (ny === 1) { // +Y
                v1 = [x - half, y + half, z - half];
                v2 = [x - half, y + half, z + half];
                v3 = [x + half, y + half, z + half];
                v4 = [x + half, y + half, z - half];
            } else if (ny === -1) { // -Y
                v1 = [x - half, y - half, z + half];
                v2 = [x - half, y - half, z - half];
                v3 = [x + half, y - half, z - half];
                v4 = [x + half, y - half, z + half];
            } else if (nz === 1) { // +Z
                v1 = [x+half, y-half, z+half];
                v2 = [x+half, y+half, z+half];
                v3 = [x-half, y+half, z+half];
                v4 = [x-half, y-half, z+half];
            } else if (nz === -1) { // -Z
                v1 = [x-half, y-half, z-half];
                v2 = [x-half, y+half, z-half];
                v3 = [x+half, y+half, z-half];
                v4 = [x+half, y-half, z-half];
            }
    
            // Добавляем вершины (4 штуки)
            const baseIndex = positions.length / 3;
            positions.push(v1[0], v1[1], v1[2]);
            positions.push(v2[0], v2[1], v2[2]);
            positions.push(v3[0], v3[1], v3[2]);
            positions.push(v4[0], v4[1], v4[2]);
    
            // Нормали одинаковы для всех вершин грани
            for (let i = 0; i < 4; i++) {
                normals.push(nx, ny, nz);
            }

            const { u0, v0, u1, v1: v1u } = uvRect
            uvs.push(
                u0, v0,   // v1
                u0, v1u,  // v2
                u1, v1u,  // v3
                u1, v0,   // v4
            )
    
            // Индексы для двух треугольников (v1-v2-v3 и v1-v3-v4)
            indices.push(
                baseIndex, baseIndex+1, baseIndex+2,
                baseIndex, baseIndex+2, baseIndex+3
            );
        }
    
        const chunkSize = this.gameBasic.chunkSize
        const chunkBlockCount = this.gameBasic.chunkBlockCount
        for (let i = 0; i < chunkBlockCount; i++) {
            const blockType = this.blocks[i]
            if (blockType === 0) continue

            const pos = this.getLocalPositionFromArrayIndex(i)
            const x = pos.x
            const y = pos.y
            const z = pos.z

            //console.log(x, y, z, blockType)

            const neighbors = [
                { dx: 0, dy: 1, dz: 0, nx: 0, ny: 1, nz: 0 },
                { dx: 0, dy: -1, dz: 0, nx: 0, ny: -1, nz: 0 },
                
                { dx: 1, dy: 0, dz: 0, nx: 1, ny: 0, nz: 0 },
                { dx: -1, dy: 0, dz: 0, nx: -1, ny: 0, nz: 0 },
                { dx: 0, dy: 0, dz: 1, nx: 0, ny: 0, nz: 1 },
                { dx: 0, dy: 0, dz: -1, nx: 0, ny: 0, nz: -1 }
            ];

            let neighbors_index = 0
            const blockInfo = Blocks.blocksInfo[blockType] 
            for (const n of neighbors) {
                const nx = x + n.dx;
                const ny = y + n.dy;
                const nz = z + n.dz;
                // Проверяем, находится ли сосед в пределах чанка
                let isVisible = false;
                if (nx < 0 || nx >= chunkSize.x || ny < 0 || ny >= chunkSize.y || nz < 0 || nz >= chunkSize.z) {
                    // Сосед за пределами чанка – грань видима (если не используется соседний чанк)
                    isVisible = true;
                } else {
                    const neighborBlock = this.blocks[this.getBlockArrayIndexRaw(nx, ny, nz)]
                    if (neighborBlock === 0) { // сосед – воздух
                        isVisible = true;
                    }
                    // Если блок непрозрачный – не добавляем грань
                }

                if (isVisible) {
                    const textures = blockInfo?.textures ?? []
                    addFace(x + 0.5, y + 0.5, z + 0.5, n.dx, n.dy, n.dz, n.nx, n.ny, n.nz, Utils.tileUV(textures[neighbors_index] ?? 0));
                }

                neighbors_index++
            }
        }
    
        if (positions.length === 0) {
            this.needUpdateMesh = false;
            return;
        }
    
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new Three.Float32BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new Three.Float32BufferAttribute(uvs, 2))
        geometry.setIndex(indices);
        geometry.computeBoundingSphere();
    
        this.object = new Three.Mesh(geometry, this.gameBasic.blockMaterial)
        this.object.position.copy(this.getGlobalPosition())
        this.gameBasic.scene.add(this.object)
        this.needUpdateMesh = false;
    }

    loadChunk() {
        this.destroy()
    }

    _createDebugMesh() {
        const size = this.gameBasic.chunkSize
    
        const geometry = new Three.BoxGeometry(
            size.x, size.y, size.z,
            size.x, size.y, size.z      // сегменты по осям = размер чанка → сетка 1×1×1
        )
    
        const color = new Three.Color().setHSL(Math.random(), 1.0, 0.5)
    
        const material = new Three.MeshBasicMaterial({
            color,
            wireframe: true,
            transparent: true,
            opacity: 0.35,
            depthWrite: false
        })
    
        this.debugMesh = new Three.Mesh(geometry, material)
    
        const g = this.getGlobalPosition()
        this.debugMesh.position.set(
            g.x + size.x / 2,
            g.y + size.y / 2,
            g.z + size.z / 2
        )
    
        this.gameBasic.scene.add(this.debugMesh)
    }

    _disposeDebugMesh() {
        if (!this.debugMesh) return
        this.gameBasic.scene.remove(this.debugMesh)
        this.debugMesh.geometry.dispose()
        this.debugMesh.material.dispose()
        this.debugMesh = null
    }

    update(delta) {
        if (this.needUpdateMesh) this.updateMesh()

        if (Gui.debugOverlayState) {
            if (!this.debugMesh) {
                this._createDebugMesh()
            }
        } else if (this.debugMesh) {
            this._disposeDebugMesh()
        }

    }
    
    destroy() {
        if (this.object != null) {
            this.gameBasic.scene.remove(this.object)
            this.object = null
        }

        if (this.debugMesh != null) {
            this.gameBasic.scene.remove(this.debugMesh)
            this.debugMesh = null
        }
    }

    getGlobalPosition() {
        return this.data.pos.clone().multiply(this.gameBasic.chunkSize)
        //const pos = this.data.pos
        //const chunkSize = this.gameBasic.chunkSize
        //return Utils.getObj(pos.x * chunkSize.x, pos.y * chunkSize.y, pos.z * chunkSize.z)
    }

    getGlobalPositionFromLocalPosition(pos) {
        return this.getGlobalPosition().clone().add(pos)
        //const globalPos = this.getGlobalPosition()
        //return Utils.getObj(globalPos.x + pos.x, globalPos.y + pos.y, globalPos.z + pos.z)
    }

    getLocalPositionFromGlobalPosition(pos) {
        return pos.clone().sub(this.getGlobalPosition())
        //const gpos = this.getGlobalPosition()
        //return Utils.getObj(pos.x - gpos.x, pos.y - gpos.y, pos.z - gpos.z)
    }

    getBlockArrayIndex(localPosition) {
        return localPosition.x + (localPosition.y * this.gameBasic.chunkSize.x) + (localPosition.z * this.gameBasic.chunkSize.x * this.gameBasic.chunkSize.y)
    }

    getBlockArrayIndexRaw(ix, iy, iz) {
        return ix + (iy * this.gameBasic.chunkSize.x) + (iz * this.gameBasic.chunkSize.x * this.gameBasic.chunkSize.y)
    }

    getLocalPositionFromArrayIndex(index) {
        return new Three.Vector3(
            index % this.gameBasic.chunkSize.x,
            Math.floor(index / this.gameBasic.chunkSize.x) % this.gameBasic.chunkSize.y,
            Math.floor(index / this.gameBasic.chunkSize.x / this.gameBasic.chunkSize.y) % this.gameBasic.chunkSize.z
        )
        //return {
        //    x: index % this.gameBasic.chunkSize.x,
        //    y: Math.floor(index / this.gameBasic.chunkSize.x) % this.gameBasic.chunkSize.y,
        //    z: Math.floor(index / this.gameBasic.chunkSize.x / this.gameBasic.chunkSize.y) % this.gameBasic.chunkSize.z
        //}
    }

    setBlock(localPosition, blockId) {
        this.blocks[this.getBlockArrayIndex(localPosition)] = blockId
        this.needUpdateMesh = true
    }

    getBlock(localPosition) {
        return this.blocks[this.getBlockArrayIndex(localPosition)]
    }
}
