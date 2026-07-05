import * as Three from "three"
import * as Utils from "../Utils.js"
import * as Gui from "../Gui.js"
import html2canvas from '../html2canvas.esm.js'

const geometry = new Three.BoxGeometry(0.8, 0.8, 0.8)
const material = new Three.MeshLambertMaterial({ color: 0x666666 })

const geometry2 = new Three.BoxGeometry(0.4, 0.4, 0.4)
const material2 = new Three.MeshLambertMaterial({
    color: 0xff0000,
    emissive: new Three.Color(0xff0000),
    emissiveIntensity: 1.0
})

const imageParts = [
    "images/ALinux/ALinux.img.part_aa",
    "images/ALinux/ALinux.img.part_ab",
    "images/ALinux/ALinux.img.part_ac",
    "images/ALinux/ALinux.img.part_ad"
]

export class Robot {
    constructor(gameBasic, pos) {
        this.gameBasic = gameBasic
        this.data = {
            speed: 3,

            pos: pos,
            targetPos: pos,

            rot: 0,
            targetRot: 0
        }
    }

    init() {
        this.object = new Three.Mesh(geometry, material)
        this.gameBasic.scene.add(this.object)

        const cube2 = new Three.Mesh(geometry2, material2)
        cube2.position.set(0.3, 0.1, 0)
        this.object.add(cube2)

        // ---------------------- vm

        this.v86Container = document.createElement('div')
        this.v86Container.classList.add("vm-display")
        document.body.appendChild(this.v86Container)

        Utils.loadAndCombineImages(imageParts).then((hda_buffer) => {
            this.emulator = new window.V86({
                wasm_path: "v86/v86.wasm",
            
                screen_container: this.v86Container,
            
                bios: {
                    url: "v86/bios/seabios.bin",
                },
            
                vga_bios: {
                    url: "v86/bios/vgabios.bin",
                },
    
                hda: {
                    buffer: hda_buffer
                },
            
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 256 * 1024 * 1024,
    
                autostart: true,
                disable_keyboard: false
            })
    
            this.emulator.add_listener("emulator-ready", () => {
                this.emulator.keyboard_set_status(false)
                this.emulator.ready = true

                let recive_buffer = ""
                this.emulator.add_listener('serial0-output-byte', (byte) => {
                    if (this.isBusy()) {
                        this.emulator.serial0_send('busy\n')
                        return
                    }

                    const ch = String.fromCharCode(byte)

                    if (ch == '\n') {
                        let successfully = false
                        switch (recive_buffer) {
                            case "forward":
                                successfully = this.move(1)
                                break
            
                            case "back":
                                successfully = this.move(-1)
                                break
            
                            case "turn_left":
                                successfully = this.turn(-1)
                                break
            
                            case "turn_right":
                                successfully = this.turn(1)
                                break
            
                            case "top":
                                successfully = this.rawmove(0, 1, 0)
                                break
            
                            case "bottom":
                                successfully = this.rawmove(0, -1, 0)
                                break
                        }

                        recive_buffer = ""
                        this.emulator.serial0_send(successfully ? 'successfully\n' : "failed\n")
                    } else {
                        recive_buffer += ch
                    }
                })
    
                this.interact()
            })
        })

        // ---------------------- display

        const canvas = document.createElement('canvas')

        const vmTexture = new Three.CanvasTexture(canvas)
        vmTexture.minFilter = Three.NearestFilter
        vmTexture.magFilter = Three.NearestFilter
        vmTexture.format = Three.RGBAFormat

        const screenMaterial = new Three.MeshStandardMaterial({
            map: vmTexture,
            emissive: new Three.Color(0xffffff),
            emissiveMap: vmTexture,
            emissiveIntensity: 1.0
        });

        const screenGeometry = new Three.PlaneGeometry(0.6, 0.6)
        this.screen = new Three.Mesh(screenGeometry, screenMaterial)
        this.screen.position.set(-0.41, 0, 0)
        this.screen.rotation.y = -Math.PI / 2
        this.object.add(this.screen)

        this.updateTimer = setInterval(() => {
            this.v86Container.style.display = 'block'
            canvas.width = this.v86Container.scrollWidth
            canvas.height = this.v86Container.scrollHeight
            html2canvas(this.v86Container, {
                canvas: canvas,
                useCORS: true,
                scale: 1
            }).then(() => {
                vmTexture.needsUpdate = true
            })

            if (!this.v86Container.openedModal) {
                this.v86Container.style.display = ''
            }
        }, 100)
    }

    interact() {
        if (!this.emulator || !this.emulator.ready) return
        
        this.emulator.keyboard_set_status(true)
        this.v86Container.style.display = 'block'
        this.v86Container.openedModal = true

        Gui.openModalWindow(this.v86Container, () => {
            this.emulator.keyboard_set_status(false)
            this.v86Container.style.display = ''
            this.v86Container.openedModal = false
            document.body.appendChild(this.v86Container)
        })
    }

    turn(side) {
        this.data.targetRot += side
        if (this.data.targetRot < 0) this.data.targetRot = 3
        if (this.data.targetRot > 3) this.data.targetRot = 0
        return true
    }

    move(value) {
        switch (this.data.targetRot) {
            case 0:
                return this.rawmove(value, 0, 0)

            case 1:
                return this.rawmove(0, 0, value)

            case 2:
                return this.rawmove(value * -1, 0, 0)

            case 3:
                return this.rawmove(0, 0, value * -1)
        }
    }

    rawmove(x, y, z) {
        this.data.targetX += x
        this.data.targetY += y
        this.data.targetZ += z
        return true
    }

    mode_delta(side) {
        if (side > 0) {
            return 1
        } else if (side < 0) {
            return -1
        }
        return 0
    }

    update(delta) {
        this.data.pos.x += this.mode_delta(this.data.targetPos.x - this.data.pos.x) * delta * this.data.speed
        this.data.rot += this.mode_delta(this.data.targetRot - this.data.rot) * delta * this.data.speed
        
        this.stopped = Math.abs(this.data.targetX - this.data.pos.x) < 0.05 && Math.abs(this.data.targetY - this.data.pos.y) < 0.05 && Math.abs(this.data.targetY - this.data.pos.z) < 0.05
        if (this.stopped) {
            this.data.pos.x = this.data.targetX
            this.data.pos.y = this.data.targetY
            this.data.pos.z = this.data.targetZ
        }

        this.stoppedrot = Math.abs(this.data.targetRot - this.data.rot) < 0.05
        if (this.stoppedrot) {
            this.data.rot = this.data.targetRot
        }

        this.object.position.copy(this.data.pos);
        this.object.rotation.y = (Math.PI / 2) * -this.data.rot
    }

    isBusy() {
        if (!this.stopped || !this.stoppedrot) return true

        return false
    }
    
    destroy() {
        this.gameBasic.scene.remove(this.object)

        if (this.emulator && typeof this.emulator.stop === 'function') {
            this.emulator.stop()
        }
        if (this.v86Container && this.v86Container.parentNode) {
            this.v86Container.parentNode.removeChild(this.v86Container)
        }

        clearInterval(this.updateTimer)
    }
}
