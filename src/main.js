import { createScene } from './core/setup.js';
import { loadEnvironment } from './world/environment.js';
import { initHandTracking, getRawHands } from './systems/handTracking.js';
// CHANGE 1: Import the new physics function
import { updatePlayerPhysics } from './systems/player.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { calculateHandState } from "./systems/poseCalculator.js";
import { updateGestureState } from "./systems/gestureMachine.js";

// 1. Setup
const { scene, camera, renderer } = createScene();

// 2. Load World
loadEnvironment(scene);

// 3. Start Systems
initHandTracking();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.target.set(0, 30, -100); // Look far ahead, not at the floor!

// 4. Loop
function animate() {
    requestAnimationFrame(animate);

    // A. Hand Tracking Pipeline
    let handsData = getRawHands();
    const handState = calculateHandState(handsData);

    // (Optional Debug Log)
    // if (handState.validPose) console.log(handState);

    // B. State Machine
    const gesture = updateGestureState(handState);

    // C. Physics Engine (CHANGE 2)
    // We pass 'controls' so the target moves WITH the player
    updatePlayerPhysics(camera, gesture, controls);

    // Note: You don't need controls.update() here anymore
    // because updatePlayerPhysics handles it.

    renderer.render(scene, camera);
}
animate();