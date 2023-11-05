import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";
import { createAmmoRigidBody, phy } from "./myAmmoHelper.js";
//import {COLLISION_GROUP_BOX, COLLISION_GROUP_MOVEABLE, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE} from "./myAmmoHelper";
import { XZPLANE_SIDELENGTH } from "./script";

export function createCylinder(baseTexture, name = "baseCylinder", mass = 0, tRadius = 1, bRadius = 1, height = 1, radialSegments = 24, open = false, color = 0x0eFF09, position = { x: 0, y: 0, z: 0 }, thetaStart = 0, thetaLength = Math.PI / 2) {

    baseTexture.wrapS = THREE.ClampToEdgeWrapping;
    baseTexture.wrapT = THREE.ClampToEdgeWrapping;
    baseTexture.repeat.set(1, 1)


    let geometry = new THREE.CylinderGeometry(tRadius, bRadius, height, radialSegments, 1, open);
    geometry.translate(0, height / 2, 0);
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

    return {
        mesh: mesh,
        rigidBody: rigidBody
    }

}