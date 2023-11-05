import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";
import { createAmmoRigidBody, phy } from "./myAmmoHelper.js";
//import {COLLISION_GROUP_BOX, COLLISION_GROUP_MOVEABLE, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE} from "./myAmmoHelper";
import { XZPLANE_SIDELENGTH } from "./script";


export function createCube(
    name = "cube",
    mass = 0,
    position = { x: -5, y: 0, z: 5 },
    width = 2,
    height = 8,
    depth = 2,
    color = 0xF090AF,
    setLocalScaling = true,
    setRotation = true
) {


    let geometry = new THREE.BoxGeometry(width, height, depth);
    geometry.translate(0, height / 2, 0);
    // Three:
    const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshPhongMaterial({ color: color }));
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.name = name;
    addMeshToScene(mesh);
    phy.rigidBodies.push(mesh);

    // Ammo:
    const boxShape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, depth / 2));
    const rigidBody = createAmmoRigidBody(boxShape, mesh, 0.4, 0.6, position, mass, setLocalScaling, setRotation);
    rigidBody.threeMesh = mesh;
    mesh.userData.physicsBody = rigidBody;
    // 4 = BODYSTATE_DISABLE_DEACTIVATION, dvs. "Never sleep".
    rigidBody.setActivationState(4);

    // Legger til physics world:
    phy.ammoPhysicsWorld.addRigidBody(
        rigidBody
    );

    return {
        mesh: mesh,
        rigidBody: rigidBody
    }
}