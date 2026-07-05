import * as Three from 'three'
import * as Gui from './Gui.js'
import * as WorldManager from './WorldManager.js';
import { World } from './Objects/World.js'
import { GameBasic } from './Objects/GameBasic.js'

// ---------------------- main

const timer = new Three.Timer()

const scene = new Three.Scene()
scene.background = new Three.Color(0x88ccff)

const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})
renderer.setSize(window.innerWidth, window.innerHeight)

const sunLight = new Three.DirectionalLight(0xffffff, 1.0); 
sunLight.position.set(50, 100, 50);
scene.add(sunLight)

const ambientLight = new Three.AmbientLight(0xffffff)
scene.add(ambientLight)

const gameBasic = new GameBasic(renderer, scene)

document.body.appendChild(renderer.domElement)

export let world

(async () => {
    const worlds = await WorldManager.worldList()
    let _world = worlds[0] || null
    
    if (_world == null) {
        _world = await WorldManager.saveWorld({
            name: "default"
        }, true)
    }

    world = new World(gameBasic, _world)
})()

export function loadWorld(_world) {
    world.destroy()
    world = new World(gameBasic, _world)
}

// ---------------------- frame handle

let delta = 0
let fps = 0

function updateFps() {
    if (delta > 0) fps = Math.floor(1 / delta)
}

setInterval(updateFps, 1000)
updateFps()

function getDebugOverlayText() {
    return `FPS: ${fps}
Position: ${world.player.data.pos.x.toFixed(3)} ${world.player.data.pos.y.toFixed(3)} ${world.player.data.pos.z.toFixed(3)}`
}

function frameHandle() {
    requestAnimationFrame(frameHandle)

    timer.update()
    delta = timer.getDelta()
    if (world) {
        world.update(delta)
        renderer.render(scene, world.player.camera)
        Gui.updateDebugOverlay(getDebugOverlayText())
    }
}
frameHandle()

window.addEventListener('resize', () => {
    if (world) {
        world.player.camera.aspect = window.innerWidth / window.innerHeight
        world.player.camera.updateProjectionMatrix()
    }
    renderer.setSize(window.innerWidth, window.innerHeight)
})
