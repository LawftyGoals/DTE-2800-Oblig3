
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
    ri.camera.position.x = 230;
    ri.camera.position.y = 400;
    ri.camera.position.z = 350;
}

export function addLights() {

    const ambientFolder = ri.lilGui.addFolder('Ambient Light');
    const directionalFolder = ri.lilGui.addFolder('Directional Light');


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
    directionalLight.position.set(0, 100, 0);
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

    if (ri.currentlyPressedKeys["KeyA"]) {
        arm.baseRot = arm.baseRot + (rotationSpeed * delta);
        arm.baseRot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyD"]) {
        arm.baseRot = arm.baseRot - (rotationSpeed * delta);
        arm.baseRot %= (Math.PI * 2);
    }


    if (ri.currentlyPressedKeys["KeyS"]) {
        arm.joint1Rot = arm.joint1Rot + (rotationSpeed * delta);
        arm.joint1Rot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyW"]) {
        arm.joint1Rot = arm.joint1Rot - (rotationSpeed * delta);
        arm.joint1Rot %= (Math.PI * 2);
    }


    if (ri.currentlyPressedKeys["KeyV"]) {
        arm.joint2Rot = arm.joint2Rot + (rotationSpeed * delta);
        arm.joint2Rot %= (Math.PI * 2);
    }
    if (ri.currentlyPressedKeys["KeyB"]) {
        arm.joint2Rot = arm.joint2Rot - (rotationSpeed * delta);
        arm.joint2Rot %= (Math.PI * 2);
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
