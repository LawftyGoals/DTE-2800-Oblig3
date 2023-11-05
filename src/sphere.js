import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";
import { createAmmoRigidBody, phy } from "./myAmmoHelper.js";
//import {COLLISION_GROUP_BOX, COLLISION_GROUP_MOVEABLE, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE} from "./myAmmoHelper";
import { XZPLANE_SIDELENGTH } from "./script";

export function createSphere(baseTexture, name = "base", wRadius = 1, mass = 0, color = 0xffffff, position = { x: 0, y: 0, z: 0 }, thetaStart = 0, thetaLength = Math.PI / 2) {

    baseTexture.wrapS = THREE.ClampToEdgeWrapping;
    baseTexture.wrapT = THREE.ClampToEdgeWrapping;
    baseTexture.repeat.set(1, 1)

    const radius = wRadius;

    let geometry = new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI * 2, thetaStart, thetaLength);
    //geometry.rotateX(-Math.PI / 2)

    let mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ map: baseTexture, color: color, side: THREE.DoubleSide })
    )

    mesh.name = name;
    mesh.position.set(position.x, position.y, position.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    let shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
    shape.setMargin(0.05);

    let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.6, position, mass);

    mesh.userData.physicsBody = rigidBody;

    phy.ammoPhysicsWorld.addRigidBody(rigidBody);

    addMeshToScene(mesh);

    phy.rigidBodies.push(mesh);
    rigidBody.threeMesh = mesh;

}