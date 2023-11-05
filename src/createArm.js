import * as THREE from "three";
import { addMeshToScene } from "./myThreeHelper.js";



export function createArm(textureObject) {

    //BASEGROUP INFO
    let baseGroupPosition = { x: 0, y: 0, z: 0 };

    //shpere info
    let baseSphereRadius = 10;
    let baseSpherePosition = { x: 0, y: 50, z: 0 };

    //basepole info
    let basePoleSize = { x: 5, y: 15, z: 5 };
    let basePolePosition = { x: 0, y: baseSphereRadius - 1, z: 0 };

    //FIRST ARM INFO
    let firstArmSize = { width: 4.5, height: 20, depth: 4.5 };
    let firstArmPosition = { x: 0, y: 0, z: 0 };

    //SECOND ARM INFO
    let secondArmSize = { width: 4.5, height: 20, depth: 4.5 };
    let secondArmPosition = { x: 0, y: 0, z: 0 };

    //SECOND ARM INFO
    let thirdArmSize = { width: 4.5, height: 20, depth: 4.5 };
    let thirdArmPosition = { x: 0, y: 0, z: 0 };

    // JOINT INFOS
    let firstJointSize = { radiusTop: 4, radiusBottom: 4, height: 5, radialSegments: 32, heightSegments: 1, openEnded: false };
    let firstJointPosition = { x: 0, y: basePoleSize.y - firstJointSize.radiusTop, z: -5 };

    let secondJointSize = { radiusTop: 4, radiusBottom: 4, height: 5, radialSegments: 32, heightSegments: 1, openEnded: false };
    let secondJointPosition = { x: 0, y: firstArmSize.height - firstJointSize.radiusTop / 2, z: 4.75 };

    let thirdJointSize = { radiusTop: 4, radiusBottom: 4, height: 5, radialSegments: 32, heightSegments: 1, openEnded: false };
    let thirdJointPosition = { x: 0, y: firstArmSize.height - firstJointSize.radiusTop / 2, z: 4.75 };

    // GRIP INFO
    let gripPosition = { x: 0, y: 10, z: 0 };
    let gripRodSize = { radiusTop: 1.5, radiusBottom: 1.5, height: 15, radialSegments: 32, heightSegments: 1, openEnded: false }

    let gripCollarPosition = { x: 0, y: gripRodSize.height, z: 0 };
    let gripCollarSize = { radiusTop: 3, radiusBottom: 3, height: 2, radialSegments: 32, heightSegments: 1, openEnded: false }


    let fingersPosition = { x: 0, y: gripCollarSize.height, z: 0 };


    //create base group
    const armMesh = new THREE.Group();
    armMesh.name = "arm";

    const baseMesh = new THREE.Group();
    baseMesh.name = "baseMesh";
    baseMesh.position.set(...Object.values(baseGroupPosition));
    armMesh.add(baseMesh);

    const jointMaterial = new THREE.MeshStandardMaterial({ map: textureObject[1], color: 0xffffff });
    const armMaterial = new THREE.MeshStandardMaterial({ map: textureObject[2], color: 0xffffff });


    // BASE SPHERE
    let geometryBaseSphere = new THREE.SphereGeometry(baseSphereRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    let meshBaseSphere = new THREE.Mesh(geometryBaseSphere, armMaterial);
    meshBaseSphere.name = "baseSphere"
    meshBaseSphere.position.set(baseSpherePosition.x, baseSpherePosition.y, baseSpherePosition.z);
    meshBaseSphere.rotateX(Math.PI);
    meshBaseSphere.castShadow = true;
    meshBaseSphere.receiveShadow = true;
    baseMesh.add(meshBaseSphere);

    //BASE ARM
    let geometryBasePole = new THREE.BoxGeometry(basePoleSize.x, basePoleSize.y, basePoleSize.z);
    geometryBasePole.translate(0, basePoleSize.y / 2, 0);
    let meshBasePole = new THREE.Mesh(geometryBasePole, new THREE.MeshStandardMaterial({ map: textureObject[1], color: 0xffffff }));
    meshBasePole.position.y = basePolePosition.y;

    meshBasePole.castShadow = true;
    meshBasePole.receiveShadow = true;
    meshBaseSphere.add(meshBasePole);


    //FIRST JOINT GROUP
    const firstJointMesh = new THREE.Group();
    firstJointMesh.name = "FirstJointGroup";
    firstJointMesh.position.set(...Object.values(firstJointPosition));
    meshBasePole.add(firstJointMesh)

    //FIRST JOINT
    let meshFirstArm = createJointArm(firstJointMesh, firstJointSize, firstArmSize, jointMaterial, armMaterial, firstArmPosition);

    //SECOND JOINT GROUP
    const secondJointMesh = new THREE.Group();
    secondJointMesh.name = "SecondJointGroup";
    secondJointMesh.position.set(...Object.values(secondJointPosition));
    meshFirstArm.add(secondJointMesh)

    //SECOND JOINT
    let meshSecondArm = createJointArm(secondJointMesh, secondJointSize, secondArmSize, jointMaterial, armMaterial, secondArmPosition);

    //THIRD JOINT GROUP
    const thirdJointMesh = new THREE.Group();
    thirdJointMesh.name = "ThirdJointGroup";
    thirdJointMesh.position.set(...Object.values(thirdJointPosition));
    meshSecondArm.add(thirdJointMesh)

    //THIRD JOINT
    let meshThirdArm = createJointArm(thirdJointMesh, thirdJointSize, thirdArmSize, jointMaterial, armMaterial, thirdArmPosition);

    // GRIP
    const gripMesh = new THREE.Group();
    gripMesh.name = "Grip";
    gripMesh.position.set(...Object.values(gripPosition));
    meshThirdArm.add(gripMesh);

    //GRIP ROD
    let geometryGripRod = new THREE.CylinderGeometry(...Object.values(gripRodSize));
    geometryGripRod.translate(0, gripRodSize.height / 2, 0);
    let meshGripRod = new THREE.Mesh(geometryGripRod, new THREE.MeshStandardMaterial({ map: textureObject[1], color: 0xffffff }));

    meshGripRod.castShadow = true;
    meshGripRod.receiveShadow = true;
    gripMesh.add(meshGripRod);

    //GRIP Collar
    let geometryGripCollar = new THREE.CylinderGeometry(...Object.values(gripCollarSize));
    geometryGripCollar.translate(0, gripCollarSize.height / 2, 0);
    let meshGripCollar = new THREE.Mesh(geometryGripCollar, new THREE.MeshStandardMaterial({ map: textureObject[1], color: 0xffffff }));
    meshGripCollar.position.set(...Object.values(gripCollarPosition));

    meshGripCollar.castShadow = true;
    meshGripCollar.receiveShadow = true;
    meshGripRod.add(meshGripCollar);

    //GRIP FINGERS
    let fingerGroup = new THREE.Group();
    fingerGroup.name = "Fingers"
    fingerGroup.position.set(...Object.values(fingersPosition));
    meshGripCollar.add(fingerGroup);

    let fingerSize = { width: 3, height: 1.5, depth: 1 }

    let fingerMaterial = new THREE.MeshStandardMaterial({ map: textureObject[1], color: 0xffffff });
    let firstLeftDigit = createFinger(fingerGroup, "FirstLeftDigit", fingerMaterial, fingerSize, 0, 0.5, -2);
    let secondLeftDigit = createFinger(firstLeftDigit, "SecondLeftDigit", fingerMaterial, fingerSize, 0, fingerSize.height, 0);
    let thirdLeftDigit = createFinger(secondLeftDigit, "ThirdLeftDigit", fingerMaterial, fingerSize, 0, fingerSize.height, 0);


    let firstRightDigit = createFinger(fingerGroup, "FirstRightDigit", fingerMaterial, fingerSize, 0, 0.5, 2);
    let secondRightDigit = createFinger(firstRightDigit, "SecondRightDigit", fingerMaterial, fingerSize, 0, fingerSize.height, 0);
    let thirdRightDigit = createFinger(secondRightDigit, "ThirdRightDigit", fingerMaterial, fingerSize, 0, fingerSize.height, 0);

    armMesh.castShadow = true;
    armMesh.recieveShadow = true;

    addMeshToScene(armMesh);

    return armMesh;

}

function createJointArm(parent, jointSize, armSize, jointMaterial, armMaterial, armPosition) {
    let geometryFirstJoint = new THREE.CylinderGeometry(...Object.values(jointSize));
    geometryFirstJoint.rotateX(Math.PI / 2);
    let meshFirstJoint = new THREE.Mesh(geometryFirstJoint, jointMaterial);
    meshFirstJoint.castShadow = true;
    meshFirstJoint.receiveShadow = true;
    parent.add(meshFirstJoint);

    let geometryFirstArm = new THREE.BoxGeometry(...Object.values(armSize));
    geometryFirstArm.translate(0, armSize.height / 2, 0);
    let meshFirstArm = new THREE.Mesh(geometryFirstArm, armMaterial);
    meshFirstArm.position.set(...Object.values(armPosition));
    meshFirstArm.castShadow = true;
    meshFirstArm.receiveShadow = true;
    meshFirstJoint.add(meshFirstArm);

    return meshFirstArm;

}

function createFinger(parent, name, material, size = { width: 3, height: 3, depth: 1 }, x = 0, y = 0, z = 0) {

    let geometryFingerJoint = new THREE.CylinderGeometry(size.depth / 2, size.depth / 2, size.width - 0.1, 32, 1, false);
    geometryFingerJoint.rotateZ(Math.PI / 2);

    let meshFingerJoint = new THREE.Mesh(geometryFingerJoint, material);
    meshFingerJoint.name = name; // "GripFingerLeft";
    meshFingerJoint.castShadow = true;
    meshFingerJoint.receiveShadow = true;
    meshFingerJoint.position.x = x;
    meshFingerJoint.position.y = y;
    meshFingerJoint.position.z = z;
    parent.add(meshFingerJoint);


    let gripFingerGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
    gripFingerGeometry.translate(0, size.height / 2, 0);
    let gripFingerMesh = new THREE.Mesh(gripFingerGeometry, material);
    gripFingerMesh.position.y = size.depth / 2 - 0.1;
    gripFingerMesh.name = name;
    gripFingerMesh.castShadow = true;
    gripFingerMesh.receiveShadow = true;


    meshFingerJoint.add(gripFingerMesh);

    return gripFingerMesh;

}