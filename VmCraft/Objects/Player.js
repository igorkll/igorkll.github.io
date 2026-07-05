import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";

const height = 1.8;
const eyeHeight = height - 0.2;
const eyeHeightSeat = height - 0.5;
const deadZone = Math.PI / 180;
const terminalVelocity = -50
const gravity = 25
const jumpSpeed = 8
const velocity_drop = 0.00025

export class Player {
    constructor(gameBasic, pos) {
        this.gameBasic = gameBasic
        this.data = {
            pos: pos,
            fly: true,
            speed: 30,
            pointerSpeed: 1.5,
            runningSpeedMultiplier: 2,
            flightSpeedMultiplier: 2,
            seatSpeedMultiplier: 0.5,
            onGround: false,
            velocity: new Three.Vector3(0, 0, 0)
        }

        this.oldControlLocked = false
    }

    init() {
        this.abortController = new AbortController();

        // ------------------ camera
        this.camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(this.data.pos.x, this.data.pos.y + eyeHeight, this.data.pos.z);
        this.camera.lookAt(this.data.pos.x + 1, this.data.pos.y + eyeHeight, this.data.pos.z);

        // ------------------ controls
        this.controls = new PointerLockControls(this.camera, this.gameBasic.renderer.domElement);
        this.controls.pointerSpeed = this.data.pointerSpeed;
        this.controls.minPolarAngle = deadZone;
        this.controls.maxPolarAngle = Math.PI - deadZone;

        this.gameBasic.renderer.domElement.addEventListener("click", () => {
            if (!Gui.isControlLocked()) {
                this.controls.lock();
            }
        }, { signal: this.abortController.signal });

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

        const [onDoubleSpace_keydown, onDoubleSpace_keyup] = Utils.detectDoubleKey("Space", () => {
            this.data.fly = !this.data.fly;
        });

        // ---- Обработчик нажатий клавиш ----
        document.addEventListener("keydown", (e) => {
            e.preventDefault();

            switch (e.code) {
                case "KeyW": this.keys.w = true; break;
                case "KeyA": this.keys.a = true; break;
                case "KeyS": this.keys.s = true; break;
                case "KeyD": this.keys.d = true; break;
                case "Space": this.keys.up = true; break;
                case "KeyC": this.keys.down = true; break;
                case "ShiftLeft": this.keys.sprint = true; break;
            }

            onDoubleSpace_keydown(e)
        }, { signal: this.abortController.signal });

        document.addEventListener("keyup", (e) => {
            switch (e.code) {
                case "KeyW": this.keys.w = false; break;
                case "KeyA": this.keys.a = false; break;
                case "KeyS": this.keys.s = false; break;
                case "KeyD": this.keys.d = false; break;
                case "Space": this.keys.up = false; break;
                case "KeyC": this.keys.down = false; break;
                case "ShiftLeft": this.keys.sprint = false; break;
            }

            onDoubleSpace_keyup(e)
        }, { signal: this.abortController.signal });
    }

    isBlockSolid(x, y, z) {
        const block = this.world?.getBlock(new Three.Vector3(x, y, z));
        return block != null && block !== 0;
    }


    handleVerticalCollisions() {
        const pos = this.data.pos;
        const blockX = Math.floor(pos.x);
        const blockY = Math.floor(pos.y);
        const blockZ = Math.floor(pos.z);

        if (this.isBlockSolid(blockX, blockY - 1, blockZ)) {
            pos.y = blockY;
            this.data.velocity.y = 0;
            this.data.onGround = true;
        } else {
            this.data.onGround = false;
        }

        if (this.data.velocity.y > 0) {
            const headY = Math.floor(pos.y + height);
            if (this.isBlockSolid(blockX, headY, blockZ)) {
                pos.y = headY - height;
                this.data.velocity.y = 0;
            }
        }
    }

    updateControls(delta) {
        const controlLocked = Gui.isControlLocked()
        if (controlLocked && !this.oldControlLocked) {
            this.controls.unlock()
        }
        if (!controlLocked && this.oldControlLocked) {
            this.controls.lock()
        }
        this.oldControlLocked = controlLocked

        if (controlLocked) {
            this.keys = Object.assign({}, this.defaultKeys)
        }

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

        if (!this.data.fly && this.data.onGround && !this.oldKeys.up) {
            this.data.velocity.y += jumpSpeed;
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
            this.data.velocity.y -= gravity * delta;
            if (this.data.velocity.y < terminalVelocity) {
                this.data.velocity.y = terminalVelocity;
            }
        }

        this.data.pos.add(this.data.velocity.clone().multiplyScalar(delta))

        var voxel_velocity_drop_mul = 1
        var speed_mul = Math.pow(velocity_drop * voxel_velocity_drop_mul, delta);
        this.data.velocity.x *= speed_mul
        if (this.data.fly) {
            this.data.velocity.y *= speed_mul
        }
        this.data.velocity.z *= speed_mul
        
        this.handleVerticalCollisions()
        this.oldKeys = Object.assign({}, this.keys)
    }

    updateCamera(delta) {
        let y = this.data.pos.y + eyeHeight;
        if (this.keys.down && !this.data.fly) {
            y = this.data.pos.y + eyeHeightSeat;
        }
        this.camera.position.set(this.data.pos.x, y, this.data.pos.z);
    }

    update(delta) {
        this.controls.pointerSpeed = this.data.pointerSpeed;
        this.updateControls(delta);
        this.updateCamera(delta);
    }

    destroy() {
        this.abortController.abort();
    }
}