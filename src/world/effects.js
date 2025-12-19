// src/world/effects.js
import * as THREE from 'three';

const bubbles = [];
const bubbleCount = 300;
const spawnRange = 120;

// create bubbles and add to scene
export function createBubbles(scene) {
  const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bubbleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
  });

  for (let i = 0; i < bubbleCount; i++) {
    const b = new THREE.Mesh(bubbleGeometry, bubbleMaterial);

    b.position.set(
      (Math.random() - 0.5) * spawnRange,
      Math.random() * 60,
      (Math.random() - 0.5) * spawnRange
    );

    scene.add(b);
    bubbles.push(b);
  }
}

// update bubbles
export function updateBubbles(camera) {
    const camPos = camera.position;

    for (const b of bubbles) {
        b.position.y += 0.03;

        if (b.position.x < camPos.x - spawnRange/2) b.position.x += spawnRange;
        if (b.position.x > camPos.x + spawnRange/2) b.position.x -= spawnRange;

        // check Z Axis (swimming direction)
        if (b.position.z < camPos.z - spawnRange/2) b.position.z += spawnRange;
        if (b.position.z > camPos.z + spawnRange/2) b.position.z -= spawnRange;

        if (b.position.y > camPos.y + 20) b.position.y -= 40;
        if (b.position.y < camPos.y - 20) b.position.y += 40;
    }
}

//attempt at making the seaweed ripple
const seaweed = []; 
export function createSeaweed(root) {
  seaweed.length = 0;

  root.traverse((child) => {
    if (child.name.includes('Seaweed')) {
 const pos = child.geometry.attributes.position;

  seaweed.push({
    mesh: child,
    original: pos.array.slice(),   
    offset: Math.random() * Math.PI * 2
  });
    }
  });

  console.log(`Seaweed objects found: ${seaweed.length}`);
}


export function updateSeaweed() {
  const time = performance.now() * 0.003;

  for (const s of seaweed) {
    const pos =  s.mesh.geometry.attributes.position;
    const original = s.original;

    for (let i = 0; i < pos.count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1; // Y = height

      const height = original[iy];

      //trying to not make it rotate at the bottom
      const influence = Math.max(height / 5, 0);

      pos.array[ix] =
        original[ix] +
        //adjust math here to make desired effects. Left  as is for now, looks good
        Math.sin(time + s.offset - height * 0.8) * .8 * influence;
    }

    pos.needsUpdate = true;
    s.mesh.geometry.computeVertexNormals();
  }
}

// --- FISH CONFIGURATION ---
const fishes = [];
const FISH_COUNT = 40;
const FISH_RANGE = 120;

export function createFish(scene) {
    // OPTIMIZATION: Create the shape and geometry ONCE, then reuse it.
    const shape = new THREE.Shape();
    shape.moveTo(-0.6, 0);
    shape.quadraticCurveTo(0, 0.4, 0.6, 0);
    shape.quadraticCurveTo(0, -0.4, -0.6, 0);
    // Tail
    shape.lineTo(-1.0, 0.3);
    shape.lineTo(-0.9, 0);
    shape.lineTo(-1.0, -0.3);
    shape.lineTo(-0.6, 0);

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.1,
        bevelEnabled: false
    });

    // Black silhouette for contrast
    const material = new THREE.MeshBasicMaterial({
        color: 0x111111,
        side: THREE.DoubleSide
    });

    geometry.rotateY(-Math.PI / 2);

    for (let i = 0; i < FISH_COUNT; i++) {
        const mesh = new THREE.Mesh(geometry, material);

        // Random Position
        mesh.position.set(
            (Math.random() - 0.5) * FISH_RANGE,
            Math.random() * 40 + 5, // Keep them somewhat near the floor/mid-water
            (Math.random() - 0.5) * FISH_RANGE
        );

        // Random Rotation (facing direction)
        const angle = Math.random() * Math.PI * 2;
        mesh.rotation.y = angle;

        scene.add(mesh);

        fishes.push({
            mesh,
            // Store the velocity vector based on rotation
            direction: new THREE.Vector3(Math.sin(angle), 0, Math.cos(angle)).normalize(),
            speed: THREE.MathUtils.randFloat(0.05, 0.1), // Swim speed
            phase: Math.random() * Math.PI * 2 // For the wiggle animation
        });
    }
}

export function updateFish(camera) {
    const camPos = camera.position;
    const time = performance.now() / 1000;

    for (const fish of fishes) {
        // Move along the direction vector
        fish.mesh.position.addScaledVector(fish.direction, fish.speed);

        // 2. WIGGLE ANIMATION (Visual only)
        // We gently rock the fish left/right to look alive
        // We add the wiggle to the base rotation
        const baseRotation = Math.atan2(fish.direction.x, fish.direction.z);
        fish.mesh.rotation.y = baseRotation + Math.sin(time * 10 + fish.phase) * 0.1;


        // Same logic as bubbles, but for X and Z primarily

        if (fish.mesh.position.x < camPos.x - FISH_RANGE / 2) fish.mesh.position.x += FISH_RANGE;
        if (fish.mesh.position.x > camPos.x + FISH_RANGE / 2) fish.mesh.position.x -= FISH_RANGE;

        if (fish.mesh.position.z < camPos.z - FISH_RANGE / 2) fish.mesh.position.z += FISH_RANGE;
        if (fish.mesh.position.z > camPos.z + FISH_RANGE / 2) fish.mesh.position.z -= FISH_RANGE;

        // Check Y Axis (Height - keep them from flying to space or digging underground)
        if (fish.mesh.position.y > camPos.y + 30) fish.mesh.position.y -= 50;
        if (fish.mesh.position.y < camPos.y - 20) fish.mesh.position.y += 50;
    }
}