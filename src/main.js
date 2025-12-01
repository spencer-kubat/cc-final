import { createScene } from './core/setup.js';
import { loadEnvironment } from './world/environment.js';
import { initHandTracking, getSwimForce } from './systems/handTracking.js';
import { updatePlayer } from './systems/player.js';
import {OrbitControls} from "three/addons/controls/OrbitControls.js";

// 1. Setup
const { scene, camera, renderer } = createScene();

// 2. Load World
loadEnvironment(scene);

// 3. Start Systems
initHandTracking(); // Asks for webcam permission

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;   // smooth motion
controls.dampingFactor = 0.05;
controls.target.set(0, 0, 0);    // point camera looks at

// 4. Loop
function animate() {
    requestAnimationFrame(animate);

    // Get input and apply to player
    // const force = getSwimForce();
    // updatePlayer(camera, force);

    controls.update(); // needed if enableDamping = true

    // Render
    renderer.render(scene, camera);
}
animate();