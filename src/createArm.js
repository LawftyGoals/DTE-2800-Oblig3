import * as THREE from "three"
import { createAmmoRigidBody, phy } from "./myAmmoHelper.js";
import { addMeshToScene } from "./myThreeHelper.js";


import { createSphere } from "./sphere.js";
import { createCylinder } from "./cylinder.js";
import { createCube } from "./cube.js";

/**
 * 
 * 

I am assuming that what you mean is that you want an object to rotate around a specific point within it's geometry.

For example, the cylinderGeometry rotates around it's center. Suppose you want it to rotate around its end.

What you need to do is translate the cylinder geometry right after it is created so that the desired point within the geometry is now at the origin.

geometry.translate( 0, cylinderHeight/2, 0 );

Now, when you rotate the cylinder, it will now rotate around its end, rather than its middle.

The end that it is rotating around will also be located at the position you have set for the cylinder mesh.

Obviously, you can do this with any geometry, not just cylinders.

three.js r.147

// CYLINDER
var cyl_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
var cyl_width = 1;
var cyl_height = 5;
// THREE.CylinderGeometry(bottomRadius, topRadius, height, segmentsRadius, segmentsHeight, openEnded )
var cylGeometry = new THREE.CylinderGeometry(cyl_width, cyl_width, cyl_height, 20, 1, false);
// translate the cylinder geometry so that the desired point within the geometry is now at the origin
cylGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, cyl_height/2, 0 ) );
var cylinder = new THREE.Mesh(cylGeometry, cyl_material);

scene.add( cylinder );    


 */



export function createArm(textureObject) {
    let armMass = 0;

    //shpere info
    let baseSphereRadius = 10;
    let baseSpherePosition = { x: 0, y: 0, z: 0 };

    //basepole info
    let basePoleSize = { x: 5, y: 20, z: 5 };
    let basePolePosition = { x: 0, y: baseSphereRadius - 1, z: 0 };


    //create base group
    const armMesh = new THREE.Group();
    armMesh.name = "arm";


    // BASE SPHERE
    let geometryBaseSphere = new THREE.SphereGeometry(baseSphereRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    let meshBaseSphere = new THREE.Mesh(geometryBaseSphere, new THREE.MeshPhongMaterial({ map: textureObject[1], color: 0xffffff, side: THREE.DoubleSide }));
    meshBaseSphere.name = "baseSphere"
    meshBaseSphere.position.set(baseSpherePosition.x, baseSpherePosition.y, baseSpherePosition.z);
    meshBaseSphere.castShadow = true;
    armMesh.add(meshBaseSphere);

    //BASE ARM
    let geometryBasePole = new THREE.BoxGeometry(basePoleSize.x, basePoleSize.y, basePoleSize.z);
    geometryBasePole.translate(0, basePoleSize.y / 2, 0);
    let meshBasePole = new THREE.Mesh(geometryBasePole, new THREE.MeshPhongMaterial({ map: textureObject[1], color: 0xffffff }));
    meshBasePole.position.y = basePolePosition.y;
    //meshBasePole.position.set(0, baseSphereRadius, 0);
    meshBaseSphere.add(meshBasePole);



    armMesh.castShadow = true;
    armMesh.recieveShadow = true;

    let armShape = new Ammo.btCompoundShape();
    let baseSphereShape = new Ammo.btSphereShape(baseSphereRadius);
    let basePoleShape = new Ammo.btBoxShape(new Ammo.btVector3(basePoleSize.x / 2, basePoleSize.y / 2, basePoleSize.z / 2));


    let baseSphereTransform = new Ammo.btTransform();
    baseSphereTransform.setIdentity();
    baseSphereTransform.setOrigin(new Ammo.btVector3(baseSpherePosition.x, baseSpherePosition.y, baseSpherePosition.z));
    armShape.addChildShape(baseSphereTransform, baseSphereShape);


    let basePoleTransform = new Ammo.btTransform();
    basePoleTransform.setIdentity();
    basePoleTransform.setOrigin(new Ammo.btVector3(basePolePosition.x, basePolePosition.y, basePolePosition.z));
    armShape.addChildShape(basePoleTransform, basePoleShape);



    let rigidBody = createAmmoRigidBody(armShape, armMesh, 0.2, 0.9, baseSpherePosition, armMass);

    armMesh.userData.physicsBody = rigidBody;
    phy.ammoPhysicsWorld.addRigidBody(rigidBody);




    addMeshToScene(armMesh);
    phy.rigidBodies.push(armMesh);
    rigidBody.threeMesh = armMesh;
    //let sphereBase = createSphere(textureObject[1], "sphereBase", 10);
    //
    //let baseCube = createCube();
    //
    //arm.add(sphereBase.mesh);
    //
    //let compoundShape = new Ammo.btCompoundShape();
    //let baseCubeShape = new Ammo.btBoxShape(new Ammo.btVector3(2, 2, 2));
    //
    //let trans1 = new Ammo.btTransform();
    //trans1.setIdentity();
    //trans1.setOrigin(new Ammo.btVector3(0, 0, 0));
    //
    //compoundShape.addChildShape(trans1, baseCubeShape);
    //
    //let rigidBody = createAmmoRigidBody(compoundShape, arm, 0.2, 0.9, { x: 0, y: 0, z: 0 }, 0);
    //arm.userData.physicsBody = rigidBody;
    //// Legger til physics world:
    //phy.ammoPhysicsWorld.addRigidBody(rigidBody);
    //
    //



    //create material for mesh -  type phong

    //The base of the arm
    //let footCylinderGeometry = new THREE.CylinderGeometry(20, 30, 15, 20, 5, false);
    //let footMesh = new THREE.Mesh(footCylinderGeometry, material);
    //
    //footMesh.castShadow = true;
    //footMesh.name = 'foot';
    //footMesh.position.x = 0;
    //footMesh.position.y = 8;
    //footMesh.position.z = 0;
    //arm.add(footMesh);
    //
    ////lower arm
    //let lowerArmCylinderGeometry = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
    //let lowerArmMesh = new THREE.Mesh(lowerArmCylinderGeometry, material);
    //
    //lowerArmMesh.castShadow = true;
    //lowerArmMesh.name = 'LowerArm';
    //lowerArmMesh.position.x = 0;
    //lowerArmMesh.position.y = 57.5;
    //lowerArmMesh.position.z = 0;
    //footMesh.add(lowerArmMesh);
    //
    ////joint and arm for lower to mid
    //const lowerJointArm = new THREE.Group();
    //lowerJointArm.position.x = 0;
    //lowerJointArm.position.y = 50;
    //lowerJointArm.position.z = 0;
    //lowerJointArm.name = "lowerJointArm";
    //
    ////lower joint
    //let lowerJointSphereGeometry = new THREE.SphereGeometry(10, 8, 6);
    //let lowerJointMesh = new THREE.Mesh(lowerJointSphereGeometry, material);
    //
    //lowerJointMesh.castShadow = true;
    //lowerJointMesh.name = 'LowerJoint';
    //lowerJointArm.add(lowerJointMesh);
    //
    //// the mid arm.
    //let midArmCylinderGeometry = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
    //let midArmMesh = new THREE.Mesh(midArmCylinderGeometry, material);
    //
    //midArmMesh.castShadow = true;
    //midArmMesh.name = 'LowerArm';
    //midArmMesh.position.x = 0;
    //midArmMesh.position.y = 50;
    //midArmMesh.position.z = 0;
    //lowerJointArm.add(midArmMesh);
    //
    ////add lower joint and mid arm to base
    //lowerArmMesh.add(lowerJointArm)
    //
    //
    //let midArmJoint = new THREE.Group();
    //
    //midArmJoint.position.x = 0;
    //midArmJoint.position.y = 100;
    //midArmJoint.position.z = 0;
    //midArmJoint.name = "midArmJoint";
    //
    ////mid joint
    //let midJointSphereGeometry = new THREE.SphereGeometry(10, 8, 6);
    //let midJointMesh = new THREE.Mesh(midJointSphereGeometry, material);
    //
    //midJointMesh.castShadow = true;
    //midJointMesh.name = 'MidJoint';
    //midArmJoint.add(midJointMesh);
    //
    //// the upper arm
    //let upperArmCylinderGeometry = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
    //let upperArmMesh = new THREE.Mesh(upperArmCylinderGeometry, material);
    //
    //upperArmMesh.castShadow = true;
    //upperArmMesh.name = 'LowerArm';
    //upperArmMesh.position.x = 0;
    //upperArmMesh.position.y = 50;
    //upperArmMesh.position.z = 0;
    //midArmJoint.add(upperArmMesh);
    //
    //lowerJointArm.add(midArmJoint);
    //
    //
    //let grip = new THREE.Group();
    //
    //grip.position.x = 0;
    //grip.position.y = 100;
    //grip.position.z = 0;
    //grip.name = "grip";
    //
    //let gripCylinderGemoetry = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
    //let gripCylinderMesh = new THREE.Mesh(gripCylinderGemoetry, material);
    //
    //gripCylinderMesh.castShadow = true;
    //gripCylinderMesh.name = "GripCylinder";
    //grip.add(gripCylinderMesh);
    //
    //
    //let gripCuffGeometry = new THREE.CylinderGeometry(8, 8, 5, 8, 1, false);
    //let gripCuffMesh = new THREE.Mesh(gripCuffGeometry, material);
    //
    //gripCuffMesh.castShadow = true;
    //gripCuffMesh.name = "GripCuff";
    //gripCuffMesh.position.x = 0;
    //gripCuffMesh.position.y = 50 - 2.5;
    //gripCuffMesh.position.z = 0;
    //gripCylinderMesh.add(gripCuffMesh);
    //
    //const fw = 2, fh = 10, fd = 5;
    //
    ////let gripFingerLeftGeometry = new THREE.BoxGeometry(lfw, lfh, lfd);
    ////gripFingerLeftGeometry.translate(0, lfh / 2, 0);
    ////let gripFingerLeftMesh = new THREE.Mesh(gripFingerLeftGeometry, material);
    //
    ////gripFingerLeftMesh.castShadow = true;
    ////gripFingerLeftMesh.name = "GripFingerLeft";
    ////gripFingerLeftMesh.position.x = 2;
    ////gripCuffMesh.add(gripFingerLeftMesh);
    //
    //let firstDigitLeft = createFinger(gripCuffMesh, material, fw, fh, fd, "FirstDigitLeft", 2, 0, 0, -Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //let secondDigitLeft = createFinger(firstDigitLeft, material, fw, fh, fd, "SecondDigitLeft", 0, fh, 0, Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //let thirdDigitLeft = createFinger(secondDigitLeft, material, fw, fh, fd, "ThirdDigitLeft", 0, fh, 0, Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //
    //let firstDigitRight = createFinger(gripCuffMesh, material, fw, fh, fd, "FirstDigitRight", -2, 0, 0, Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //let secondDigitRight = createFinger(firstDigitRight, material, fw, fh, fd, "SecondDigitRight", 0, fh, 0, -Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //let thirdDigitRight = createFinger(secondDigitRight, material, fw, fh, fd, "ThirdDigitRight", 0, fh, 0, -Math.PI / 20, new THREE.Vector3(0, 0, 1));
    //
    //
    //
    //
    //midArmJoint.add(grip);
    ////gripCylinderMesh.position.x = 0;
    //// gripCylinderMesh.position.y = ;
    //// gripCylinderMesh.position.z = 0;





}

function createFinger(parent, material, w, h, d, name, x = 0, y = 0, z = 0, rotation = 0, rotationVector = new THREE.Vector3(0, 0, 0)) {

    let gripFingerGeometry = new THREE.BoxGeometry(w, h, d);
    gripFingerGeometry.translate(0, h / 2, 0);
    let gripFingerLeftMesh = new THREE.Mesh(gripFingerGeometry, material);

    gripFingerLeftMesh.castShadow = true;
    gripFingerLeftMesh.name = name; // "GripFingerLeft";
    gripFingerLeftMesh.position.x = x;
    gripFingerLeftMesh.position.y = y;
    gripFingerLeftMesh.position.z = z;
    if (rotation)
        gripFingerLeftMesh.setRotationFromAxisAngle(rotationVector, rotation);

    parent.add(gripFingerLeftMesh);

    return gripFingerLeftMesh;


}