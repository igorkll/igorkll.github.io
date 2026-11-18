import * as Three from 'three';
import * as Main from './Main.js';
import * as Game from './Game.js';
import * as Consts from './Consts.js';

const roadTiles = new Map();

function deleteRoadTile(roadTile) {
    Main.scene.remove(roadTile);
    roadTile.geometry.dispose();
    roadTile.material.dispose();
    roadTiles.delete(roadTile.userData.key);
}

function getTilePosKey(x, z) {
    return `${x}:${z}`;
}

function createRoadTile(x, z) {
    const key = getTilePosKey(x, z);
    if (roadTiles.has(key)) return;

    const geometry = new Three.PlaneGeometry(Consts.TILE_SIZE, Consts.TILE_SIZE);
    const material = new Three.MeshStandardMaterial({
        color: ((x + z) % 2) == 0 ? 0x555555 : 0x666666
    });

    const tile = new Three.Mesh(geometry, material);

    tile.rotation.x = -Math.PI / 2;
    tile.position.set(
        x * Consts.TILE_SIZE,
        0,
        z * Consts.TILE_SIZE
    );

    Main.scene.add(tile);

    tile.userData.key = key;
    tile.userData.x = x;
    tile.userData.z = z;
    roadTiles.set(key, tile);

    return tile;
}

function recreateRoad() {
    for (const roadTile of roadTiles.values()) {
        deleteRoadTile(roadTile);
    }

    roadTiles.clear();
}

export function init() {
    recreateRoad();
}

export function process(delta) {
    const cx = Math.floor(Game.car.position.x / Consts.TILE_SIZE)
    const cz = Math.floor(Game.car.position.z / Consts.TILE_SIZE)

    for (let ix = cx - Consts.TILE_LOADING; ix <= cx + Consts.TILE_LOADING; ix++)
        for (let iz = cz - Consts.TILE_LOADING; iz <= cz + Consts.TILE_LOADING; iz++)
            createRoadTile(ix, iz);

    let noUnloadKeys = []
    for (let ix = cx - Consts.TILE_UNLOADING; ix <= cx + Consts.TILE_UNLOADING; ix++)
        for (let iz = cz - Consts.TILE_UNLOADING; iz <= cz + Consts.TILE_UNLOADING; iz++)
            noUnloadKeys.push(getTilePosKey(ix, iz))

    for (const roadTile of roadTiles.values()) {
        if (!noUnloadKeys.includes(roadTile.userData.key)) {
            deleteRoadTile(roadTile);
        }
    }
}
