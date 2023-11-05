
import * as THREE from "three";
import GUI from "lil-gui";
import { ri } from "./script.js"


export function createThreeScene() {
    /**
     * canvas set up
     */
    document.body.style.margin = 0;
    const canvas = document.createElement('canvas');
    const canvasDiv = document.getElementById("canvasDiv");
    canvasDiv.style.position = "absolute";
    canvasDiv.appendChild(canvas);

    /**
     * Renderer setup
     */

    ri.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    ri.renderer.setSize(window.innerWidth - 16, window.innerHeight - 8);
    ri.renderer.setClearColor(0xBFD104, 0xff);
    ri.renderer.shadowMap.enabled = true;
    ri.renderer.shadowMapSoft = true;
    ri.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    ri.scene = new THREE.Scene();
    ri.scene.background = new THREE.Color(0xdddddd)


    /**
     * lille gui hjelper module >.<
     */

    ri.lilGui = new GUI();

    /**
     * Light setup
     */

    addLights();

    /**
     * Camera setup
     */
    ri.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 10000);
    ri.camera.position.x = 100;
    ri.camera.position.y = 0;
    ri.camera.position.z = 0;
}

export function addLights() {

    const ambientFolder = ri.lilGui.addFolder('Ambient Light');
    const directionalFolder = ri.lilGui.addFolder('Directional Light');
    const spotFolder = ri.lilGui.addFolder('Spot Light');


    //AMBIENT
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

    ambientLight.visible = true;
    ri.scene.add(ambientLight);
    //add to folder
    ambientFolder.add(ambientLight, 'visible').name("On/Off");
    ambientFolder.add(ambientLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
    ambientFolder.addColor(ambientLight, 'color').name('Color');

    //DIRECTIONALLIGHT

    let directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100, 20, 0);
    directionalLight.castShadow = true;
    directionalLight.visible = true;


    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10, 0xff0000);

    directionalLightHelper.visible = true;
    ri.scene.add(directionalLightHelper);

    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;

    directionalLight.shadow.camera.near = 5;
    directionalLight.shadow.camera.far = 110;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;

    //add to folder
    directionalFolder.add(directionalLight, 'visible').name("On/Off");
    directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
    directionalFolder.addColor(directionalLight, 'color').name("Color");
    directionalFolder.add(directionalLight.position, 'y').min(0).max(100).step(1).name("Y");
    directionalFolder.add(directionalLight.position, 'x').min(-50).max(50).step(1).name("X");
    directionalFolder.add(directionalLight.position, 'z').min(-50).max(50).step(1).name("Z");

    let lightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    lightCamHelper.visible = false;

    ri.scene.add(lightCamHelper);
    ri.scene.add(directionalLight);


    //SPOTLIGHT
    const spotLight = new THREE.SpotLight(0xffffff, 0.5, 0, Math.PI * 0.1, 0, 0);
    spotLight.visible = true;
    spotLight.castShadow = true;
    spotLight.position.set(-20, -50, 0);
    spotLight.target.position.set(0, 50, 0);
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    spotLight.shadow.camera.near = 5;
    spotLight.shadow.camera.far = 110;
    spotLight.shadow.camera.fov = 800;
    ri.scene.add(spotLight);
    ri.scene.add(spotLight.target);

    spotFolder.add(spotLight, 'visible').name("On/Off");
    spotFolder.add(spotLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
    spotFolder.addColor(directionalLight, 'color').name("Color");
    spotFolder.add(spotLight.position, 'y').min(0).max(100).step(1).name("Y");
    spotFolder.add(spotLight.position, 'x').min(-50).max(50).step(1).name("X");
    spotFolder.add(spotLight.position, 'z').min(-50).max(50).step(1).name("Z");

    spotFolder.add(spotLight.target.position, 'y').min(-50).max(50).step(1).name("Target Y");
    spotFolder.add(spotLight.target.position, 'x').min(-50).max(50).step(1).name("Target X");
    spotFolder.add(spotLight.target.position, 'z').min(-50).max(50).step(1).name("Target Z");


}

export function renderScene() {
    ri.renderer.render(ri.scene, ri.camera);
}

export function onWindowResize() {
    ri.camera.aspect = window.innerWidth / window.innerHeight;
    ri.camera.updateProjectionMatrix();
    ri.renderer.setSize(window.innerWidth, window.innerHeight);
    ri.controls.handleResize();
    renderScene();
}



export function handleKeys(delta, arm) {

    let rotationSpeed = (Math.PI);
    let extentionSpeed = 10;

    if (ri.currentlyPressedKeys["KeyA"]) {
        arm.baseRot = arm.baseRot + (rotationSpeed * delta);
        arm.baseRot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyD"]) {
        arm.baseRot = arm.baseRot - (rotationSpeed * delta);
        arm.baseRot %= (Math.PI * 2);
    }


    if (ri.currentlyPressedKeys["KeyR"]) {
        arm.firstJointZRot = arm.firstJointZRot + (rotationSpeed * delta);
        arm.firstJointZRot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyT"]) {
        arm.firstJointZRot = arm.firstJointZRot - (rotationSpeed * delta);
        arm.firstJointZRot %= (Math.PI * 2);
    }


    if (ri.currentlyPressedKeys["KeyF"]) {
        arm.secondJointZRot = arm.secondJointZRot + (rotationSpeed * delta);
        arm.secondJointZRot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyG"]) {
        arm.secondJointZRot = arm.secondJointZRot - (rotationSpeed * delta);
        arm.secondJointZRot %= (Math.PI * 2);
    }

    if (ri.currentlyPressedKeys["KeyC"]) {
        arm.thirdJointZRot = arm.thirdJointZRot + (rotationSpeed * delta);
        arm.thirdJointZRot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyV"]) {
        arm.thirdJointZRot = arm.thirdJointZRot - (rotationSpeed * delta);
        arm.thirdJointZRot %= (Math.PI * 2);
    }

    if (ri.currentlyPressedKeys["Comma"]) {
        arm.gripRotY = arm.gripRotY + (rotationSpeed * delta);
        arm.gripRotY %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["Period"]) {
        arm.gripRotY = arm.gripRotY - (rotationSpeed * delta);
        arm.gripRotY %= (Math.PI * 2);
    }


    if (ri.currentlyPressedKeys["KeyW"] && arm.gripExtensionY < 15) {
        arm.gripExtensionY = arm.gripExtensionY + (extentionSpeed * delta);
    }
    if (ri.currentlyPressedKeys["KeyS"] && arm.gripExtensionY > 5) {
        arm.gripExtensionY = arm.gripExtensionY - (extentionSpeed * delta);
    }

    if (ri.currentlyPressedKeys["KeyQ"]) {
        if (arm.firstLeftDigitRotX < -Math.PI / 8) {
            arm.firstLeftDigitRotX = arm.firstLeftDigitRotX + (rotationSpeed * delta);
            arm.firstLeftDigitRotX %= (Math.PI * 2);


            arm.firstRightDigitRotX = arm.firstRightDigitRotX - (rotationSpeed * delta);
            arm.firstRighttDigitRotX %= (Math.PI * 2);
        }
    }
    if (ri.currentlyPressedKeys["KeyE"]) {
        if (arm.firstLeftDigitRotX > -Math.PI / 2) {
            arm.firstLeftDigitRotX = arm.firstLeftDigitRotX - (rotationSpeed * delta);
            arm.firstLeftDigitRotX %= (Math.PI * 2);


            arm.firstRightDigitRotX = arm.firstRightDigitRotX + (rotationSpeed * delta);
            arm.firstRighttDigitRotX %= (Math.PI * 2);
        }
    }


}

export function addMeshToScene(mesh) {
    ri.scene.add(mesh);

}

export function getRigidBodyFromMesh(meshName) {
    const mesh = ri.scene.getObjectByName(meshName);
    if (mesh)
        return mesh.userData.physicsBody;
    else
        return null;
}
