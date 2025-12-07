// src/world/effects.js
import * as THREE from 'three';

const bubbles = [];   // <— no "let" needed, we only mutate contents

// create bubbles and add to scene
export function createBubbles(scene) {
  const bubbleCount = 200;

  const bubbleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
  const bubbleMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
  });

  for (let i = 0; i < bubbleCount; i++) {
    const b = new THREE.Mesh(bubbleGeometry, bubbleMaterial);

    b.position.set(
      (Math.random() - 0.5) * 100,
      Math.random() * 60,
      (Math.random() - 0.5) * 100
    );

    scene.add(b);
    bubbles.push(b);
  }
}

// update bubbles
export function updateBubbles() {
  for (const b of bubbles) {
    b.position.y += 0.03;

    if (b.position.y > 60) {
      b.position.y = 0;
      b.position.x = (Math.random() - 0.5) * 100;
      b.position.z = (Math.random() - 0.5) * 100;
    }
  }
}
