import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { createSeaweed } from './effects.js';

// X = Width (Left/Right), Z = Depth (Forward/Backward)
const CHUNK_WIDTH = 102;
const CHUNK_DEPTH = 102;

const VISIBLE_CHUNKS = 3; // 3x3 Grid

// Calculate "Half Grid" limits separately for X and Z
const HALF_GRID_X = (VISIBLE_CHUNKS * CHUNK_WIDTH) / 2;
const HALF_GRID_Z = (VISIBLE_CHUNKS * CHUNK_DEPTH) / 2;

let chunks = [];

export function loadEnvironment(scene) {
    const sun = new THREE.DirectionalLight(0xffffff, 1.5);
    sun.position.set(20, 100, 10);
    scene.add(sun);

    scene.add(new THREE.AmbientLight(0x224466, 0.4));

    const oceanColor = new THREE.Color(0x104060);
    scene.background = oceanColor;
    scene.fog = new THREE.FogExp2(oceanColor, 0.019);

    const loader = new GLTFLoader();
    const modelPath = `${import.meta.env.BASE_URL}NowallsWaterEnvironmentUpdated.glb`;

    loader.load(
        modelPath,
        function (gltf) {
            const originalModel = gltf.scene;

            // Generate 3x3 Grid
            for (let x = -1; x <= 1; x++) {
                for (let z = -1; z <= 1; z++) {
                    const chunk = SkeletonUtils.clone(originalModel);
                    chunk.position.set(x * CHUNK_WIDTH, 0, z * CHUNK_DEPTH);

                    createSeaweed(chunk);
                    scene.add(chunk);
                    chunks.push(chunk);
                }
            }
        },
        function (xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        function (error) {
            console.error('Error loading GLTF:', error);
        }
    );
}

export function updateEnvironment(camera) {
    if (chunks.length === 0) return;

    const playerX = camera.position.x;
    const playerZ = camera.position.z;

    chunks.forEach((chunk) => {
        // --- 1. CHECK X (WIDTH) ---
        const diffX = playerX - chunk.position.x;

        // Use HALF_GRID_X
        if (Math.abs(diffX) > HALF_GRID_X) {
            if (diffX > 0) chunk.position.x += CHUNK_WIDTH * VISIBLE_CHUNKS;
            else chunk.position.x -= CHUNK_WIDTH * VISIBLE_CHUNKS;
        }

        // --- 2. CHECK Z (DEPTH) ---
        const diffZ = playerZ - chunk.position.z;

        // Use HALF_GRID_Z
        if (Math.abs(diffZ) > HALF_GRID_Z) {
            if (diffZ > 0) chunk.position.z += CHUNK_DEPTH * VISIBLE_CHUNKS;
            else chunk.position.z -= CHUNK_DEPTH * VISIBLE_CHUNKS;
        }
    });
}