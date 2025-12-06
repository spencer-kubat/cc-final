// src/systems/player.js

const FRICTION = 0.98;
const ACCELERATION = 0.3;
const MAX_SPEED = 0.5;

let velocity = 0; // Renamed from velocityZ since it's now directional

export function updatePlayerPhysics(camera, gestureState) {

    // 1. APPLY FORCE
    // Negative velocity = Forward in Three.js land
    if (gestureState === 'forwardSwim') velocity -= ACCELERATION;
    else if (gestureState === 'backwardSwim') velocity += ACCELERATION;

    // 2. CAP SPEED
    if (velocity < -MAX_SPEED) velocity = -MAX_SPEED;
    if (velocity > MAX_SPEED) velocity = MAX_SPEED;

    camera.translateZ(velocity);

    // 4. FRICTION
    velocity *= FRICTION;

    if (Math.abs(velocity) < 0.01) velocity = 0;
}