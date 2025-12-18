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
import { createBubbles, updateBubbles, createSeaweed,updateSeaweed} from './world/effects.js';
import {initAudio, playSwimSound, startAudio} from './systems/audio.js';

/**might need to adjust these bounds later
bounds are currently set for the environment for hard bounds we can adjust as needed
Currently still clipping through the parts of the environment that are raised. Need to fix by using the blender floor plane's y values with the camera's values so we don't pass through at any point 
*/
const BOUNDS = {
  minX: -45,
  maxX:  45,
  minY:  5,   
  maxY:  80,   
  minZ: -60,
  maxZ:  58

};

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
function clampCamera(camera) {
  camera.position.x = THREE.MathUtils.clamp(
    camera.position.x,
    BOUNDS.minX,
    BOUNDS.maxX
  );

  camera.position.y = THREE.MathUtils.clamp(
    camera.position.y,
    BOUNDS.minY,
    BOUNDS.maxY
  );

  camera.position.z = THREE.MathUtils.clamp(
    camera.position.z,
    BOUNDS.minZ,
    BOUNDS.maxZ
  );
}



function animate() {
    requestAnimationFrame(animate);

    //start the bubble particles
    updateBubbles();
    // check for keyboard mode
    //
    
    if (useKeyboard) {
        updateKeyboardPhysics(camera);
        clampCamera(camera);
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
        clampCamera(camera);
    }
    updateSeaweed();
    renderer.render(scene, camera);
}
animate();