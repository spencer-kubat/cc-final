import './style.css' // Vite handles CSS imports for you!
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const scene = new THREE.Scene();
scene.add(new THREE.AmbientLight(0x88aaff, 0.6));
scene.fog = new THREE.FogExp2(0x7db6ff,0.02); //adjust 2nd parameter for density of fog 
// LOAD GLB
const loader = new GLTFLoader();
loader.load(
    './WaterEnvironment.glb',
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


// AboveWater LIGHT
const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(10, 20, 10);
scene.add(light);

// CAMERA 
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 100);
camera.position.z = 1;
camera.position.y = 40;
camera.position.x = 10;

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