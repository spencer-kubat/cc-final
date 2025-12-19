import * as THREE from 'three';
import { createScene } from './core/setup.js';
import { loadEnvironment } from './world/environment.js';
import {initML5Tracking, getHeadData, getHandData} from './systems/handTracking.js';
import { initKeyboardListeners, updateKeyboardPhysics } from './systems/keyboardControls.js';
import { updatePlayerPhysics } from './systems/player.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
import { calculateHandState } from "./systems/poseCalculator.js";
import { updateGestureState } from "./systems/gestureMachine.js";
import { updateHeadTracking } from "./systems/headTracking.js";
import {
  createBubbles,
  updateBubbles,
  createSeaweed,
  updateSeaweed,
  createFish,
  updateFish
} from './world/effects.js';
import {initAudio, playSwimSound, startAudio} from './systems/audio.js';
import { getFloorPlane } from './world/environment.js';

/**might need to adjust these bounds later
bounds are currently set for the environment for hard bounds we can adjust as needed
Currently still clipping through the parts of the environment that are raised. Need to fix by using the blender floor plane's y values with the camera's values so we don't pass through at any point 
*/

const downRay = new THREE.Raycaster();
const DOWN = new THREE.Vector3(0, -1, 0);
const CAMERA_HEIGHT = 1.6;


// setup scene
const { scene, camera, renderer } = createScene();
initAudio(camera);

// load environment
loadEnvironment(scene);

// create bubble effects
createBubbles(scene);
// start hand and head tracking
initML5Tracking();
//create seaweed effects
createSeaweed(scene);
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

const overlay = document.getElementById('overlay');
overlay.addEventListener('click', () => {
    startAudio();
    overlay.classList.add('hidden'); // hide overlay
    document.body.requestFullscreen(); // make fullscreen
});

//current bounds
function clampCameraToGround(camera, scene) {
  downRay.set(camera.position, DOWN);

  const hits = downRay.intersectObjects(scene.children, true);
  if (hits.length === 0) return;

  const groundY = hits[0].point.y + CAMERA_HEIGHT;

  if (camera.position.y < groundY) {
    camera.position.y = groundY;
  }
}

const fishes = [];
for (let i = 0; i < 10; i++) {
    fishes.push(createFish(scene));
}

function animate() {
    requestAnimationFrame(animate);

    //start the bubble particles
    updateBubbles();
    // check for keyboard mode
    //
    for (const f of fishes) {
    updateFish(f);
    }

    if (useKeyboard) {
        updateKeyboardPhysics(camera);
        clampCameraToGround(camera, scene);
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
        clampCameraToGround(camera, scene);
    }
    updateSeaweed();
    renderer.render(scene, camera);
}
animate();