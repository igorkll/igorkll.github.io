import * as Three from 'three';
import * as Game from './Game.js';
import * as Consts from './Consts.js';

// ------------------------------------- init

export const clock = new Three.Clock();

export const scene = new Three.Scene()

export const renderer = new Three.WebGLRenderer({
    antialias: true,
    preserveDrawingBuffer: true
})

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// ------------------------------------- base objects

export const sunLight = new Three.DirectionalLight(0xffffff, 2.0); 
scene.add(sunLight)

export const ambientLight =  new Three.HemisphereLight(
    0xb1d5ff, // цвет неба
    0x806044, // цвет земли
    1.0
);
scene.add(ambientLight)

export const camera = new Three.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);

// -------------------------------------

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

let firstFrame = true;

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), Consts.MAX_DELTA);

    if (firstFrame) {
        Game.init();
        firstFrame = false;
    }

    Game.render(delta);

    renderer.render(scene, camera);
}

animate();
