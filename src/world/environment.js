import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadEnvironment(scene) {
    // 1. Lights
    const ambient = new THREE.AmbientLight(0x404040, 2); // Soft blue-ish light
    const spot = new THREE.SpotLight(0xffffff, 5);
    spot.position.set(0, 50, 0);
    scene.add(ambient, spot);

    // 2. Load the Map
    const loader = new GLTFLoader();
    loader.load('CreativeCoding.glb', (gltf) => {
        gltf.scene.scale.set(1, 1, 1);
        scene.add(gltf.scene);
        console.log("Environment loaded");
    });
}