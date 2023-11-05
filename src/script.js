import './style.css';

import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';


import {
    createThreeScene,
    handleKeys,
    onWindowResize,
    renderScene,
} from "./myThreeHelper.js";



import { createXZPlane } from "./xzPlane.js";

import { createArm } from "./createArm.js";


export const XZPLANE_SIDELENGTH = 100;

//console.log(window.location.pathname);

export const ri = {
    currentlyPressedKeys: {},
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


    addSceneLoader();

}




function handleKeyUp(event) {
    ri.currentlyPressedKeys[event.code] = false;
}
function handleKeyDown(event) {
    ri.currentlyPressedKeys[event.code] = true;
}

function addSceneLoader() {
    let loadList = ["/img/bare.png", "/img/joint.png", "/img/arm.png", "/img/bird1.png"]

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
        addSceneObjects(textureObjects);
    }


}

function addSceneObjects(textureObjects) {

    createXZPlane(textureObjects[0], { x: 0, y: -50, z: 0 });
    createXZPlane(textureObjects[0], { x: 0, y: 50, z: 0 });

    let arm = createArm(textureObjects);
    arm.baseRot = 0.0;
    arm.firstJointZRot = Math.PI / 4;
    arm.secondJointZRot = -Math.PI / 4;
    arm.thirdJointZRot = -Math.PI / 4;
    arm.gripExtensionY = 5;

    arm.gripRotY = 0;

    arm.firstLeftDigitRotX = -Math.PI / 4;
    arm.secondLeftDigitRotX = Math.PI / 4;
    arm.thirdLeftDigitRotX = Math.PI / 4;

    arm.firstRightDigitRotX = Math.PI / 4;
    arm.secondRightDigitRotX = -Math.PI / 4;
    arm.thirdRightDigitRotX = -Math.PI / 4;



    animate(0);
}





function animate(currentTime, myThreeScene) {
    window.requestAnimationFrame((currentTime) => { animate(currentTime, myThreeScene); });

    let delta = ri.clock.getDelta();

    ri.controls.update();


    let arm = ri.scene.getObjectByName("arm");
    arm.rotation.y = arm.baseRot;

    let firstJoint = ri.scene.getObjectByName("FirstJointGroup");
    firstJoint.rotation.z = arm.firstJointZRot;

    let secondJoint = ri.scene.getObjectByName("SecondJointGroup");
    secondJoint.rotation.z = arm.secondJointZRot;

    let thirdJoint = ri.scene.getObjectByName("ThirdJointGroup");
    thirdJoint.rotation.z = arm.thirdJointZRot;


    let gripRod = ri.scene.getObjectByName("Grip");
    gripRod.position.y = arm.gripExtensionY;
    gripRod.rotation.y = arm.gripRotY;


    let firstLeftDigit = ri.scene.getObjectByName("FirstLeftDigit");
    firstLeftDigit.rotation.x = arm.firstLeftDigitRotX;

    let secondLeftDigit = ri.scene.getObjectByName("SecondLeftDigit");
    secondLeftDigit.rotation.x = arm.secondLeftDigitRotX;

    let thirdLeftDigit = ri.scene.getObjectByName("ThirdLeftDigit");
    thirdLeftDigit.rotation.x = arm.thirdLeftDigitRotX;

    let firstRightDigit = ri.scene.getObjectByName("FirstRightDigit");
    firstRightDigit.rotation.x = arm.firstRightDigitRotX;

    let secondRightDigit = ri.scene.getObjectByName("SecondRightDigit");
    secondRightDigit.rotation.x = arm.secondRightDigitRotX;

    let thirdRightDigit = ri.scene.getObjectByName("ThirdRightDigit");
    thirdRightDigit.rotation.x = arm.thirdRightDigitRotX;

    handleKeys(delta, arm);

    renderScene();
}



