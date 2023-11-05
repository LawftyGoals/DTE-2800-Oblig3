import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";
import { createAmmoRigidBody, phy } from "./myAmmoHelper.js";

import { XZPLANE_SIDELENGTH } from "./script";

export function createAmmoXZPlane(baseTexture) {

    baseTexture.wrapS = THREE.RepeatWrapping;
    baseTexture.wrapT = THREE.RepeatWrapping;
    baseTexture.repeat.set(10, 10);

    let material = new THREE.MeshStandardMaterial({ map: baseTexture, color: 0xffffff, side: THREE.DoubleSide });

    let geometry = new THREE.PlaneGeometry(XZPLANE_SIDELENGTH, XZPLANE_SIDELENGTH, 1, 1);
    geometry.rotateX(-Math.PI / 2);

    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    mesh.name = 'xzplane';

    const mass = 0;
    const position = { x: 0, y: 0, z: 0 };

    let shape = new Ammo.btBoxShape(new Ammo.btVector3(XZPLANE_SIDELENGTH / 2, 0, XZPLANE_SIDELENGTH / 2));
    let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

    mesh.userData.physicsBody = rigidBody;

    phy.ammoPhysicsWorld.addRigidBody(rigidBody);

    addMeshToScene(mesh);
    phy.rigidBodies.push(mesh);
    rigidBody.threeMesh = mesh;



}