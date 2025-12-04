// src/systems/player.js

// Physics Constants
const FRICTION = 0.98;       // Higher = more glide (Ice), Lower = less glide (Mud)
const ACCELERATION = 0.5;    // Speed added per stroke
const MAX_SPEED = 0.8;       // Max speed cap

let velocityZ = 0; // "Momentum" stored here

export function updatePlayerPhysics(camera, gestureState, controls) {

    // 1. APPLY FORCE (Impulse)
    // We only add speed on the exact frame the gesture fires
    if (gestureState === 'forwardSwim') {
        velocityZ -= ACCELERATION;
    }
    else if (gestureState === 'backwardSwim') {
        velocityZ += ACCELERATION;
    }

    // 2. CAP SPEED
    if (velocityZ < -MAX_SPEED) velocityZ = -MAX_SPEED;
    if (velocityZ > MAX_SPEED) velocityZ = MAX_SPEED;

    // 3. APPLY TO CAMERA
    camera.position.z += velocityZ;

    // 4. FIX FOR ORBIT CONTROLS (Crucial!)
    // If you don't move the target, you will walk past it and the camera will flip.
    if (controls) {
        controls.target.z += velocityZ;
        controls.update();
    }

    // 5. FRICTION (Decay)
    velocityZ *= FRICTION;

    // Clean stop to save CPU
    if (Math.abs(velocityZ) < 0.001) velocityZ = 0;
}