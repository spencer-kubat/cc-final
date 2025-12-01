import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    // Underwater Fog (Crucial for your vibe)
    scene.fog = new THREE.FogExp2(0x001e0f, 0.02);
    scene.background = new THREE.Color(0x001e0f);

    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 10); // Start back a bit

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Handle Resize automatically
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer };
}