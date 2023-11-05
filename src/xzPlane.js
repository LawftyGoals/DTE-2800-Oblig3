import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";

import { XZPLANE_SIDELENGTH } from "./script.js";

export function createXZPlane(baseTexture, position = { x: 0, y: 0, z: 0 }) {

    baseTexture.wrapS = THREE.RepeatWrapping;
    baseTexture.wrapT = THREE.RepeatWrapping;
    baseTexture.repeat.set(10, 10);

    let material = new THREE.MeshStandardMaterial({ map: baseTexture, color: 0xffffff, metalness: 0.3, side: THREE.DoubleSide });

    let geometry = new THREE.PlaneGeometry(XZPLANE_SIDELENGTH, XZPLANE_SIDELENGTH, 1, 1);
    geometry.rotateX(-Math.PI / 2);

    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.name = 'xzplane';

    mesh.position.set(...Object.values(position));


    addMeshToScene(mesh);


}