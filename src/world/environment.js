import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createSeaweed } from './effects.js'



    //Don't pass through the floor logic
 let floorPlane = null;
    export function getFloorPlane() {
        return floorPlane;  
    }


export function loadEnvironment(scene) {
    // AboveWater LIGHT
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(10, 20, 10);
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x88aaff, 0.6));
    scene.fog = new THREE.FogExp2(0x7db6ff,0.02); //adjust 2nd parameter for density of fog
    // LOAD GLB
    const loader = new GLTFLoader();
 loader.load(
  './WaterEnvironment.glb',
  function (gltf) {

    scene.add(gltf.scene);
    console.log("Model loaded", gltf);

 
     gltf.scene.traverse((child) => {
      if (child.name === 'Plane') {
        floorY = child.getWorldPosition(new THREE.Vector3()).y;
      }
    });
    
    // Register seaweed after the model is loaded
    createSeaweed(gltf.scene);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    console.error('Error loading GLTF:', error);
  }
);

    
   
}

