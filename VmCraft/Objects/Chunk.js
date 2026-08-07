import * as Three from "three"
import * as Utils from "../Utils.js"
import * as Blocks from "../Blocks.js"

export class Chunk {
    constructor(gameBasic, world, pos) {
        this.gameBasic = gameBasic
        this.world = world

        this.data = {
            pos: pos
        }

        this.needUpdateMesh = true
        this.chunkBlockCount = this.gameBasic.chunkSize.x * this.gameBasic.chunkSize.y * this.gameBasic.chunkSize.z
        this.blocks = new Uint8Array(this.chunkBlockCount)

        this.loadChunk()
    }

    updateMesh() {
        if (this.object != null) {
            this.gameBasic.scene.remove(this.object);
            this.object.geometry.dispose();
            this.object.material.dispose();
            this.object = null;
        }

        const positions = [];
        const normals = [];
        const indices = [];
    
        function addFace(x, y, z, dx, dy, dz, nx, ny, nz) {
            const half = 0.5;
            let v1, v2, v3, v4;
            // Для простоты используем заранее заданные смещения для каждой оси
            // В реальном проекте лучше вычислять универсально, но здесь распишем вручную для наглядности
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
    
            // Индексы для двух треугольников (v1-v2-v3 и v1-v3-v4)
            indices.push(
                baseIndex, baseIndex+1, baseIndex+2,
                baseIndex, baseIndex+2, baseIndex+3
            );
        }
    
        const chunkSize = this.chunkBlockCount
        for (let i = 0; i < chunkSize; i++) {
            const blockType = this.blocks[i]
            if (blockType === 0) continue

            const pos = this.getLocalPositionFromArrayIndex(i)
            const x = pos.x
            const y = pos.y
            const z = pos.z

            //console.log(x, y, z, blockType)

            const neighbors = [
                { dx: 1, dy: 0, dz: 0, nx: 1, ny: 0, nz: 0 },
                { dx: -1, dy: 0, dz: 0, nx: -1, ny: 0, nz: 0 },
                { dx: 0, dy: 1, dz: 0, nx: 0, ny: 1, nz: 0 },
                { dx: 0, dy: -1, dz: 0, nx: 0, ny: -1, nz: 0 },
                { dx: 0, dy: 0, dz: 1, nx: 0, ny: 0, nz: 1 },
                { dx: 0, dy: 0, dz: -1, nx: 0, ny: 0, nz: -1 }
            ];

            for (const n of neighbors) {
                const nx = x + n.dx;
                const ny = y + n.dy;
                const nz = z + n.dz;
                // Проверяем, находится ли сосед в пределах чанка
                let isVisible = false;
                if (nx < 0 || nx >= chunkSize || ny < 0 || ny >= chunkSize || nz < 0 || nz >= chunkSize) {
                    // Сосед за пределами чанка – грань видима (если не используется соседний чанк)
                    isVisible = true;
                } else {
                    const neighborBlock = this.blocks[this.getBlockArrayIndex({
                        x: nx,
                        y: ny,
                        z: nz
                    })]
                    if (neighborBlock === 0) { // сосед – воздух
                        isVisible = true;
                    }
                    // Если блок непрозрачный – не добавляем грань
                }

                if (isVisible) {
                    // Добавляем грань со смещением (x,y,z) и нормалью (nx,ny,nz)
                    addFace(x, y, z, n.dx, n.dy, n.dz, n.nx, n.ny, n.nz);
                }
            }
        }
    
        if (positions.length === 0) {
            this.needUpdateMesh = false;
            return;
        }
    
        // 7. Создаём BufferGeometry и заполняем атрибуты
        const geometry = new Three.BufferGeometry();
        geometry.setAttribute('position', new Three.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('normal', new Three.Float32BufferAttribute(normals, 3));
        geometry.setIndex(indices);
    
        // Вычисляем bounding sphere (опционально)
        geometry.computeBoundingSphere();
    
        // 8. Создаём материал (можно задать цвет или использовать текстуру)
        // Для примера используем случайный цвет, но лучше брать цвет в зависимости от типа блока
        const material = new Three.MeshLambertMaterial({
            color: 0x8B8B8B, // серый цвет по умолчанию, или изменить на случайный
            // Если нужны текстуры, используйте map и атлас
        });
    
        this.object = new Three.Mesh(geometry, material)
        this.object.position.copy(this.getGlobalPosition())
        this.gameBasic.scene.add(this.object)
        this.needUpdateMesh = false;
    }

    loadChunk() {
        this.destroy()
    }

    update(delta) {
        if (this.needUpdateMesh) this.updateMesh()
    }
    
    destroy() {
        if (this.object != null) {
            this.gameBasic.scene.remove(this.object)
            this.object = null
        }
    }

    getGlobalPosition() {
        return this.data.pos.clone().multiply(this.gameBasic.chunkSize)
    }

    getGlobalPositionFromLocalPosition(pos) {
        return this.getGlobalPosition().clone().add(pos)
    }

    getLocalPositionFromGlobalPosition(pos) {
        return pos.clone().sub(this.getGlobalPosition())
    }

    getBlockArrayIndex(localPosition) {
        return localPosition.x + (localPosition.y * this.gameBasic.chunkSize.x) + (localPosition.z * this.gameBasic.chunkSize.x * this.gameBasic.chunkSize.y)
    }

    getLocalPositionFromArrayIndex(index) {
        return new Three.Vector3(
            index % this.gameBasic.chunkSize.x,
            Math.floor(index / this.gameBasic.chunkSize.x) % this.gameBasic.chunkSize.y,
            Math.floor(index / this.gameBasic.chunkSize.x / this.gameBasic.chunkSize.y) % this.gameBasic.chunkSize.z
        )
    }

    setBlock(localPosition, blockId) {
        this.blocks[this.getBlockArrayIndex(localPosition)] = blockId
    }

    getBlock(localPosition) {
        return this.blocks[this.getBlockArrayIndex(localPosition)]
    }
}
