import './style.css' // Vite handles CSS imports for you!
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();

// LOAD GLB
const loader = new GLTFLoader();
loader.load(
    './CreativeCoding.glb',
    function (gltf) {
        scene.add(gltf.scene);
        console.log("Model loaded", gltf);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading GLTF:', error);
    }
);

// LIGHT
const light = new THREE.PointLight(0x975111, 50, 1000);
light.position.set(0, 3, 0);
scene.add(light);

// CAMERA
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
camera.position.z = 2;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;   // smooth motion
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);    // point camera looks at

// ANIMATE LOOP
function animate() {
    requestAnimationFrame(animate);

    controls.update(); // needed if enableDamping = true
    renderer.render(scene, camera);
}
animate();