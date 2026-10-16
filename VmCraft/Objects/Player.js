import * as Three from "three";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import * as Utils from "../Utils.js";
import * as Gui from "../Gui.js";
import * as Consts from "../Consts.js";
import { Character } from "./Character.js";

const deadZone = Math.PI / 180;

export class Player extends Character {
    constructor(gameBasic) {
        super(gameBasic)
        Object.assign(this.data, {})
    }
    
    init() {
        super.init()

        this.abortController = new AbortController();
        this.oldControlLocked = false

        // ------------------ controls
        this.controls = new PointerLockControls(this.camera, this.gameBasic.renderer.domElement);
        this.controls.pointerSpeed = Consts.pointer_speed;
        this.controls.minPolarAngle = deadZone;
        this.controls.maxPolarAngle = Math.PI - deadZone;

        this.gameBasic.renderer.domElement.addEventListener("click", () => {
            if (!Gui.isControlLocked()) {
                this.controls.lock();
            }
        }, { signal: this.abortController.signal });

        const [onDoubleSpace_keydown, onDoubleSpace_keyup] = Utils.detectDoubleKey("Space", () => {
            this.data.fly = !this.data.fly;
        });

        document.addEventListener("keydown", (e) => {
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

        document.addEventListener("mousedown", (e) => {
            if (!this.controls.isLocked) return

            if (e.button == 0) {
                this.removeBlock()
            } else if (e.button == 2) {
                this.placeBlock(Utils.randomInt(1, 2))
            }
        })
    }

    _updateInputs() {
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
    }

    update(delta) {
        this.controls.pointerSpeed = Consts.pointer_speed;
        this._updateInputs();
        super.update(delta);
    }

    placeBlock(blockId) {
        const { origin, direction } = this.getLookRay()
        const hit = this.world.raycastBlock(origin, direction, Consts.interact_distance)
        if (!hit) return false

        return this.world.setBlock(hit.block.clone().add(hit.normal), blockId)
    }

    removeBlock() {
        const { origin, direction } = this.getLookRay()
        const hit = this.world.raycastBlock(origin, direction, Consts.interact_distance)
        if (!hit) return false

        return this.world.setBlock(hit.block, 0)
    }

    destroy() {
        this.abortController.abort();
        super.destroy()
    }
}