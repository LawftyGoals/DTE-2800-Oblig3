import './style.css';

import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { createArmMesh } from "./armGroup.js"



//console.log(window.location.pathname);

const ri = {
    currentlyPressedKeys: []
}
// Her legger man til three.js koden.
export function main() {

    createThreeScene();

    ri.camera.up = new THREE.Vector3(0, 1, 0);

    let target = new THREE.Vector3(0.0, 0.0, 0.0);
    ri.camera.lookAt(target);

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


    addSceneObjects();

}

function createThreeScene() {
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

function handleKeyUp(event) {
    ri.currentlyPressedKeys[event.code] = false;
}
function handleKeyDown(event) {
    ri.currentlyPressedKeys[event.code] = true;
}

function addLights() {
    let directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(90, 300, 0);
    directionalLight.castShadow = true;


    const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10, 0xff0000);

    directionalLightHelper.visible = true;
    ri.scene.add(directionalLightHelper);

    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = 401;
    directionalLight.shadow.camera.left = -250;
    directionalLight.shadow.camera.right = 250;
    directionalLight.shadow.camera.top = 250;
    directionalLight.shadow.camera.bottom = -250;

    let lightCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
    lightCamHelper.visible = false;

    ri.scene.add(lightCamHelper);
    ri.scene.add(directionalLight);


}

function addSceneObjects() {
    const loader = new THREE.TextureLoader();


    loader.load(
        '/bird1.png',
        (textureObject) => {
            let gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
            let mPlane = new THREE.MeshLambertMaterial({ color: 0x91aff11, side: THREE.DoubleSide, wireframe: false });
            let meshPlane = new THREE.Mesh(gPlane, mPlane);
            meshPlane.rotation.x = Math.PI / 2;
            meshPlane.receiveShadow = true;
            ri.scene.add(meshPlane);

            let arm = createArmMesh(textureObject);
            arm.name = "arm";
            arm.baseRot = 0.0;
            arm.joint1Rot = 0.0;
            arm.joint2Rot = 0.0;
            ri.scene.add(arm);

            animate(0);

        },
        undefined,
        (error) => {
            console.log(error);
        }
    )

}

function animate(currentTime) {
    window.requestAnimationFrame((currentTime) => { animate(currentTime); });

    let delta = ri.clock.getDelta();

    ri.controls.update();

    let arm = ri.scene.getObjectByName("arm");
    arm.rotation.y = arm.baseRot;

    let lowerJointArm = arm.getObjectByName("lowerJointArm", true);
    lowerJointArm.rotation.x = arm.joint1Rot;

    let midArmJoint = arm.getObjectByName("midArmJoint", true);
    midArmJoint.rotation.x = arm.joint2Rot;


    handleKeys(delta, arm);

    renderScene();
}

function renderScene() {
    ri.renderer.render(ri.scene, ri.camera);
}

function onWindowResize() {
    ri.camera.aspect = window.innerWidth / window.innerHeight;
    ri.camera.updateProjectionMatrix();
    ri.renderer.setSize(window.innerWidth, window.innerHeight);
    ri.controls.handleResize();
    renderScene();
}


function handleKeys(delta, arm) {

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