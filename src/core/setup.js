import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();

    //adjusted the near and far values here to get rid of the black box around the scene
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.5, 300);
    camera.position.set(0, 30, 10); // Start back a bit

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