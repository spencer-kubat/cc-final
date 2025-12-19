import { createScene } from './core/setup.js';
import { loadEnvironment, updateEnvironment } from './world/environment.js';
import {initML5Tracking, getHeadData, getHandData} from './systems/handTracking.js';
import { initKeyboardListeners, updateKeyboardPhysics } from './systems/keyboardControls.js';
import { updatePlayerPhysics } from './systems/player.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { calculateHandState } from "./systems/poseCalculator.js";
import { updateGestureState } from "./systems/gestureMachine.js";
import { updateHeadTracking } from "./systems/headTracking.js";
import { createBubbles, updateBubbles, createSeaweed,updateSeaweed, createFish, updateFish} from './world/effects.js';
import {initAudio, playSwimSound, startAudio} from './systems/audio.js';

const floorY = 6.0;
const playerHeight = 2.0;
let useKeyboard = false;

// setup scene
const { scene, camera, renderer } = createScene();

initAudio(camera);
loadEnvironment(scene); // load environment
createBubbles(scene); // create bubble effects
createFish(scene); // create fish effects
initML5Tracking(); // start hand and head tracking
createSeaweed(scene); //create seaweed effects
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

const overlay = document.getElementById('overlay');
overlay.addEventListener('click', () => {
    startAudio();
    overlay.classList.add('hidden'); // hide overlay
    document.body.requestFullscreen(); // make fullscreen
});

//current bounds
function clampCameraToGround(camera) {
    const minHeight = floorY + playerHeight;

    if (camera.position.y < minHeight) {
        camera.position.y = minHeight;
    }
}

function animate() {
    requestAnimationFrame(animate);

    updateBubbles(camera);
    updateFish(camera);

    if (useKeyboard) {
        updateKeyboardPhysics(camera);
        clampCameraToGround(camera);
    }
    else {
        let handsData = getHandData();
        const handState = calculateHandState(handsData);
        const gesture = updateGestureState(handState);
        if (gesture === 'forwardSwim' || gesture === 'backwardSwim') {
            playSwimSound();
        }

        const facesData = getHeadData();
        updateHeadTracking(camera, facesData);

        updatePlayerPhysics(camera, gesture, handState);
        clampCameraToGround(camera);
    }
    updateSeaweed();
    renderer.render(scene, camera);

    updateEnvironment(camera);
}
animate();