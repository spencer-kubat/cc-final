import { createScene } from './core/setup.js';
import { loadEnvironment } from './world/environment.js';
import {initML5Tracking, getHeadData, getHandData} from './systems/handTracking.js';
import { initKeyboardListeners, updateKeyboardPhysics } from './systems/keyboardControls.js';
import { updatePlayerPhysics } from './systems/player.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { calculateHandState } from "./systems/poseCalculator.js";
import { updateGestureState } from "./systems/gestureMachine.js";
import { updateHeadTracking } from "./systems/headTracking.js";

// setup scene
const { scene, camera, renderer } = createScene();

// load environment
loadEnvironment(scene);

// start hand and head tracking
initML5Tracking();

let useKeyboard = false;
initKeyboardListeners();

// setup pointer lock controls
const mouseControls = new PointerLockControls(camera, renderer.domElement);

// event listeners to detect when the user breaks out (hits ESC)
mouseControls.addEventListener('unlock', () => {
    useKeyboard = false;
    console.log("Mouse unlocked. Switching back to Hands.");
});

// enter key to toggle control modes
window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        useKeyboard = !useKeyboard;
        if (useKeyboard) {
            mouseControls.lock(); // This requests the browser to hide the cursor and lock it.
        } else {
            mouseControls.unlock();
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    // check for keyboard mode
    if (useKeyboard) {
        updateKeyboardPhysics(camera);
    }
    else {
        let handsData = getHandData();
        const handState = calculateHandState(handsData);
        const gesture = updateGestureState(handState);

        const facesData = getHeadData();
        updateHeadTracking(camera, facesData);

        updatePlayerPhysics(camera, gesture, handState);
    }

    renderer.render(scene, camera);
}
animate();