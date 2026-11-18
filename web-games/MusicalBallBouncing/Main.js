import * as Three from 'three';
import * as Game from './Game.js';
import * as Consts from './Consts.js';
import * as Gui from './Gui.js';

// ------------------------------------- init

export let additionalCameraOffset = 0;

export const clock = new Three.Clock();

export const scene = new Three.Scene()

export const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})

document.body.appendChild(renderer.domElement);
Gui.setupCanvas(renderer.domElement);

// ------------------------------------- base objects

export const sunLight = new Three.DirectionalLight(0xffffff, 2.0); 

export const ambientLight =  new Three.HemisphereLight(
    0xb1d5ff, // цвет неба
    0x806044, // цвет земли
    1.0
);

const aspect = window.innerWidth / window.innerHeight;
export const camera = new Three.OrthographicCamera(
    -Consts.HOR_VIEW_SIZE / 2,
     Consts.HOR_VIEW_SIZE / 2,
     Consts.HOR_VIEW_SIZE / 2 / aspect,
    -Consts.HOR_VIEW_SIZE / 2 / aspect,
    0.1,
    1000
);

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const aspect = window.innerWidth / window.innerHeight;

    camera.left = -Consts.HOR_VIEW_SIZE / 2;
    camera.right = Consts.HOR_VIEW_SIZE / 2;
    camera.top = Consts.HOR_VIEW_SIZE / 2 / aspect;
    camera.bottom = -Consts.HOR_VIEW_SIZE / 2 / aspect;

    additionalCameraOffset = camera.bottom + 1.5;

    camera.updateProjectionMatrix();
}

resize();

// -------------------------------------

window.addEventListener('resize', resize);

let firstFrame = true;

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), Consts.MAX_DELTA);

    if (firstFrame) {
        Game.init();
        Gui.init();
        firstFrame = false;
    }

    Game.render(delta);

    renderer.render(scene, camera);
}

animate();
