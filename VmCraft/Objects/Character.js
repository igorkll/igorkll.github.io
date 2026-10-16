import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";
import * as Consts from "../Consts.js";

export class Character {
    constructor(gameBasic) {
        this.gameBasic = gameBasic

        const defaultHeight = 1.8;
        
        this.data = {
            pos: new Three.Vector3(0, 0, 0),
            velocity: new Three.Vector3(0, 0, 0),
            fly: false,
            speed: 30,
            runningSpeedMultiplier: 2,
            flightSpeedMultiplier: 2,
            seatSpeedMultiplier: 0.5,
            onGround: false,
            jumpSpeed: 8,
            height: defaultHeight,
            eyeHeight: defaultHeight - 0.2,
            eyeHeightSeat: defaultHeight - 0.2,
            width: 0.6,
            character_velocity_drop_mul: 1
        }
    }

    getSaveData() {
        const outData = Object.assign({}, this.data, {
            pos: Utils.getArrFromVec(this.data.pos),
            velocity: Utils.getArrFromVec(this.data.velocity)
        })

        if (this.camera) {
            const cameraRotation = this.camera.quaternion
            outData.cameraRotation = [cameraRotation.x, cameraRotation.y, cameraRotation.z, cameraRotation.w]
        }

        return outData
    }

    setSaveData(data) {
        this.data = Object.assign({}, data, {
            pos: Utils.getVecFromArrCheck(data.pos),
            velocity: Utils.getVecFromArrCheck(data.velocity)
        })

        if (this.camera) {
            const cameraRotation = data.cameraRotation
            this.camera.quaternion.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], cameraRotation[3])
        } else {
            this.cameraRotation = data.cameraRotation
        }
        delete this.data.cameraRotation
    }

    init() {
        // ------------------ camera

        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.data.pos.x, this.data.pos.y + this.data.eyeHeight, this.data.pos.z);

        if (this.cameraRotation) {
            const cameraRotation = this.cameraRotation
            this.camera.quaternion.set(cameraRotation[0], cameraRotation[1], cameraRotation[2], cameraRotation[3])
        } else {
            this.camera.lookAt(this.data.pos.x + 1, this.data.pos.y + this.data.eyeHeight, this.data.pos.z);
        }

        // ------------------ keys

        this.defaultKeys = {
            w: false,
            a: false,
            s: false,
            d: false,
            up: false,
            down: false,
            sprint: false
        }

        this.keys = Object.assign({}, this.defaultKeys)
        this.oldKeys = Object.assign({}, this.defaultKeys)
    }

    _isBlockSolid(x, y, z) {
        const block = this.world?.getBlock(new Three.Vector3(x, y, z));
        return block != null && block !== 0;
    }

    _collides() {
        const pos = this.data.pos
        const half = this.data.width / 2
        
    
        const minX = Math.floor(pos.x - half + Consts.EPS)
        const maxX = Math.floor(pos.x + half - Consts.EPS)
        const minY = Math.floor(pos.y + Consts.EPS)
        const maxY = Math.floor(pos.y + this.data.height - Consts.EPS)
        const minZ = Math.floor(pos.z - half + Consts.EPS)
        const maxZ = Math.floor(pos.z + half - Consts.EPS)
    
        for (let x = minX; x <= maxX; x++)
            for (let y = minY; y <= maxY; y++)
                for (let z = minZ; z <= maxZ; z++)
                    if (this._isBlockSolid(x, y, z)) return true
        return false
    }

    _moveAxis(axis, amount) {
        if (amount === 0) return
        const pos = this.data.pos
        const half = this.data.width / 2
    
        pos[axis] += amount
    
        if (!this._collides()) return
    
        if (axis === 'x') {
            if (amount > 0) pos.x = Math.floor(pos.x + half) - half - Consts.EPS
            else            pos.x = Math.floor(pos.x - half) + 1 + half + Consts.EPS
            this.data.velocity.x = 0
        } else {
            if (amount > 0) pos.z = Math.floor(pos.z + half) - half - Consts.EPS
            else            pos.z = Math.floor(pos.z - half) + 1 + half + Consts.EPS
            this.data.velocity.z = 0
        }
    }

    _handleHorizontalCollisions(delta) {
        this._moveAxis('x', this.data.velocity.x * delta)
        this._moveAxis('z', this.data.velocity.z * delta)
    }

    _handleVerticalCollisions(delta) {
        const halfWidth = this.data.width / 2;
        const pos = this.data.pos;

        let col1 = false;
        let col2 = false;

        const blockY_EPS = Math.floor(pos.y - Consts.EPS);
        const headY_EPS = Math.floor(pos.y + this.data.height + Consts.EPS);

        for (let ix = -1; ix <= 1; ix += 2) {
            for (let iy = -1; iy <= 1; iy += 2) {
                const blockX = Math.floor(pos.x + (ix * halfWidth));
                const blockZ = Math.floor(pos.z + (iy * halfWidth));

                if (this._isBlockSolid(blockX, blockY_EPS, blockZ)) {
                    col1 = true;
                }

                if (this._isBlockSolid(blockX, headY_EPS, blockZ)) {
                    col2 = true;
                }
            }
        }

        if (col1 && this.data.velocity.y <= 0) {
            pos.y = blockY_EPS + 1;
            this.data.velocity.y = 0;
            this.data.onGround = true;
            this.data.fly = false;
        } else {
            this.data.onGround = false;
        }

        if (col2 && this.data.velocity.y > 0) {
            pos.y = headY_EPS - this.data.height;
            this.data.velocity.y = 0;
        }
    }

    _updateMovement(delta) {
        const forward = new Three.Vector3();
        this.camera.getWorldDirection(forward);
        forward.y = 0;
        forward.normalize();

        const right = new Three.Vector3();
        right.crossVectors(forward, new Three.Vector3(0, 1, 0)).normalize();

        const move = new Three.Vector3(0, 0, 0);
        if (this.keys.w) move.add(forward)
        if (this.keys.s) move.sub(forward)
        if (this.keys.a) move.sub(right)
        if (this.keys.d) move.add(right)

        if (this.keys.up && !this.data.fly && this.data.onGround) {
            this.data.velocity.y += this.data.jumpSpeed;
            this.data.onGround = false;
        }

        let current_speed_mul = 1
        if (this.keys.sprint) current_speed_mul *= this.data.runningSpeedMultiplier
        if (this.data.fly) current_speed_mul *= this.data.flightSpeedMultiplier
        else if (this.keys.down) current_speed_mul *= this.data.seatSpeedMultiplier

        if (move.lengthSq() > 0) {
            move.normalize()
            this.data.velocity.x += current_speed_mul * move.x * this.data.speed * delta;
            this.data.velocity.z += current_speed_mul * move.z * this.data.speed * delta;
        }

        if (this.data.fly) {
            if (this.keys.up) {
                this.data.velocity.y += current_speed_mul * this.data.speed * delta
            }
            if (this.keys.down) {
                this.data.velocity.y -= current_speed_mul * this.data.speed * delta
            }
        } else {
            this.data.velocity.y -= Consts.gravity * delta;
            if (this.data.velocity.y < Consts.terminal_velocity) {
                this.data.velocity.y = Consts.terminal_velocity;
            }
        }
        
        let voxel_velocity_drop_mul = 1 //для имитации льда в будущем
        let speed_mul = Math.pow(Consts.velocity_drop * voxel_velocity_drop_mul * this.data.character_velocity_drop_mul, delta);

        this.data.velocity.x *= speed_mul
        this.data.velocity.z *= speed_mul
        this._handleHorizontalCollisions(delta)
        
        this.data.pos.y += this.data.velocity.y * delta
        if (this.data.fly) this.data.velocity.y *= speed_mul
        this._handleVerticalCollisions(delta)
    }

    _updateCamera(delta) {
        let y = this.data.pos.y + this.data.eyeHeight;
        if (this.keys.down && !this.data.fly) {
            y = this.data.pos.y + this.data.eyeHeightSeat;
        }
        this.camera.position.set(this.data.pos.x, y, this.data.pos.z);
    }

    update(delta) {
        this._updateMovement(delta);
        this._updateCamera(delta);
        this.oldKeys = Object.assign({}, this.keys)
    }

    getLookRay() {
        const origin = new Three.Vector3()
        const direction = new Three.Vector3()
    
        this.camera.getWorldPosition(origin)
        this.camera.getWorldDirection(direction)
    
        return { origin, direction }
    }

    destroy() {
    }
}