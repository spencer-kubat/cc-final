// src/systems/keyboardControls.js

const keys = { w: false, a: false, s: false, d: false, shift: false, space: false };
const SPEED = 0.5; // Fast debug speed

export function initKeyboardListeners() {
    window.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = true;
        if (e.key === ' ') keys.space = true;
    });

    window.addEventListener('keyup', (e) => {
        const key = e.key.toLowerCase();
        if (keys.hasOwnProperty(key)) keys[key] = false;
        if (e.key === ' ') keys.space = false;
    });
}

export function updateKeyboardPhysics(camera) {
    if (keys.w) camera.translateZ(-SPEED); // Move Forward
    if (keys.s) camera.translateZ(SPEED);  // Move Back
    if (keys.a) camera.translateX(-SPEED); // Strafe Left
    if (keys.d) camera.translateX(SPEED);  // Strafe Right
    if (keys.space) camera.position.y += SPEED / 2; // Fly Up
    if (keys.shift) camera.position.y -= SPEED / 2; // Fly Down
}