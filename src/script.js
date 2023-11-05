import './style.css';

import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { createArmMesh } from "./armGroup.js"

import {
    createAmmoWorld,
    updatePhysics
} from "./myAmmoHelper.js";

import {
    createThreeScene,
    handleKeys,
    onWindowResize,
    renderScene,
} from "./myThreeHelper.js";



import { createAmmoXZPlane } from "./ammoXZPlane.js";

import { createArm } from "./createArm.js";

import { createSphere } from "./sphere.js";
import { createCylinder } from "./cylinder.js";


export const XZPLANE_SIDELENGTH = 100;

//console.log(window.location.pathname);

export const ri = {
    currentlyPressedKeys: [],
    scene: undefined,
    renderer: undefined,
    camera: undefined,
    clock: undefined,
    controls: undefined,
    lilGui: undefined
}


// Her legger man til three.js koden.
export function main() {

    createThreeScene();


    createAmmoWorld();
    /**
     * Trackball control implementation
     */

    ri.controls = new TrackballControls(ri.camera, ri.renderer.domElement);
    ri.controls.addEventListener('change', renderScene);

    ri.clock = new THREE.Clock();

    window.addEventListener('resize', onWindowResize, false);

    //arm rotation controls
    document.addEventListener('keyup', handleKeyUp, false)
    document.addEventListener('keydown', handleKeyDown, false)


    addAmmoSceneLoader();

}




function handleKeyUp(event) {
    ri.currentlyPressedKeys[event.code] = false;
}
function handleKeyDown(event) {
    ri.currentlyPressedKeys[event.code] = true;
}

function addAmmoSceneLoader() {
    let loadList = ["/img/bird1.png", "/img/bird1.png"]

    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);
    const textureObjects = [];

    for (let i = 0; i < loadList.length; i++) {
        textureObjects.push(textureLoader.load(loadList[i]));
    }

    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
        console.log('Started loading file ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    }

    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');
    }

    loadingManager.onError = (url) => {
        console.log('There was an error loading ' + url);
    };

    loadingManager.onLoad = () => {
        addAmmoSceneObjects(textureObjects);
    }


}

function addAmmoSceneObjects(textureObjects) {

    //createSphere("base", 5, 0, textureObjects[1], 0xA8A8F8);
    createAmmoXZPlane(textureObjects[0]);
    //createCylinder(textureObjects[1]);
    createArm(textureObjects);

    animate(0);
}





function animate(currentTime, myThreeScene, myAmmoPhysicsWorld) {
    window.requestAnimationFrame((currentTime) => { animate(currentTime, myThreeScene, myAmmoPhysicsWorld); });

    let delta = ri.clock.getDelta();

    ri.controls.update();


    updatePhysics(delta);


    //let arm = ri.scene.getObjectByName("arm");
    //arm.rotation.y = arm.baseRot;
    //
    //let lowerJointArm = arm.getObjectByName("lowerJointArm", true);
    //lowerJointArm.rotation.x = arm.joint1Rot;
    //
    //let midArmJoint = arm.getObjectByName("midArmJoint", true);
    //midArmJoint.rotation.x = arm.joint2Rot;


    handleKeys(delta);

    renderScene();
}


























// function OLDanimate(currentTime) {
//     window.requestAnimationFrame((currentTime) => { animate(currentTime); });
// 
//     let delta = ri.clock.getDelta();
// 
//     ri.controls.update();
// 
//     let arm = ri.scene.getObjectByName("arm");
//     arm.rotation.y = arm.baseRot;
// 
//     let lowerJointArm = arm.getObjectByName("lowerJointArm", true);
//     lowerJointArm.rotation.x = arm.joint1Rot;
// 
//     let midArmJoint = arm.getObjectByName("midArmJoint", true);
//     midArmJoint.rotation.x = arm.joint2Rot;
// 
// 
//     handleKeys(delta, arm);
// 
//     renderScene();
// }




// function addSceneObjects() {
//     const loader = new THREE.TextureLoader();
// 
// 
//     loader.load(
//         '/bird1.png',
//         (textureObject) => {
//             let gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
//             let mPlane = new THREE.MeshLambertMaterial({ color: 0x91aff11, side: THREE.DoubleSide, wireframe: false });
//             let meshPlane = new THREE.Mesh(gPlane, mPlane);
//             meshPlane.rotation.x = Math.PI / 2;
//             meshPlane.receiveShadow = true;
//             ri.scene.add(meshPlane);
// 
//             let arm = createArmMesh(textureObject);
//             arm.name = "arm";
//             arm.baseRot = 0.0;
//             arm.joint1Rot = 0.0;
//             arm.joint2Rot = 0.0;
//             ri.scene.add(arm);
// 
//             animate(0);
// 
//         },
//         undefined,
//         (error) => {
//             console.log(error);
//         }
//     )
// 
// }