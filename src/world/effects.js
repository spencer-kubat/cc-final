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

//attempt at making the seaweed ripple

const seaweed = []; 
export function createSeaweed(root) {
  seaweed.length = 0;

  root.traverse((child) => {
    if (child.name.includes('Seaweed')) {
 const pos = child.geometry.attributes.position;

  seaweed.push({
    mesh: child,
    original: pos.array.slice(),   // ✅ store original vertex positions
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

const FISH_BOUNDS = {
  minX: -45,
  maxX:  45,
  minY:  5,
  maxY:  80,
  minZ: -60,
  maxZ:  58
};

export function createFish(scene) {
  const shape = new THREE.Shape();

  shape.moveTo(-0.6, 0);
  shape.quadraticCurveTo(0, 0.4, 0.6, 0);
  shape.quadraticCurveTo(0, -0.4, -0.6, 0);


  shape.lineTo(-1.0, 0.3);
  shape.lineTo(-0.9, 0);
  shape.lineTo(-1.0, -0.3);
  shape.lineTo(-0.6, 0);

  const geometry = new THREE.ShapeGeometry(shape);
  const material = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide
  });

  const mesh = new THREE.Mesh(geometry, material);

  mesh.rotation.y = Math.PI;

  mesh.position.set(
    THREE.MathUtils.randFloat(-30, 30),
    THREE.MathUtils.randFloat(10, 50),
    THREE.MathUtils.randFloat(-30, 30)
  );

  scene.add(mesh);

  return {
    mesh,
    direction: new THREE.Vector3(
      Math.random() - 0.5,
      0,
      Math.random() - 0.5
    ).normalize(),
    speed: THREE.MathUtils.randFloat(0.02, 0.05),
    phase: Math.random() * Math.PI * 2
  };
}



export function updateFish(fish) {
  // move forward
  fish.mesh.position.addScaledVector(fish.direction, fish.speed);

  // face movement direction (NO sideways sliding)
  const angle = Math.atan2(fish.direction.x, fish.direction.z);
  fish.mesh.rotation.y = angle;

  // bounds bounce
  if (fish.mesh.position.x < FISH_BOUNDS.minX || fish.mesh.position.x > FISH_BOUNDS.maxX)
    fish.direction.x *= -1;

  if (fish.mesh.position.z < FISH_BOUNDS.minZ || fish.mesh.position.z > FISH_BOUNDS.maxZ)
    fish.direction.z *= -1;

  if (fish.mesh.position.y < FISH_BOUNDS.minY || fish.mesh.position.y > FISH_BOUNDS.maxY)
    fish.direction.y *= -1;
}






