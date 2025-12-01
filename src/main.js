import { createScene } from './core/setup.js';
import { loadEnvironment } from './world/environment.js';
import { initHandTracking, getSwimForce } from './systems/handTracking.js';
import { updatePlayer } from './systems/player.js';

// 1. Setup
const { scene, camera, renderer } = createScene();

// 2. Load World
loadEnvironment(scene);

// 3. Start Systems
initHandTracking(); // Asks for webcam permission

// 4. Loop
function animate() {
    requestAnimationFrame(animate);

    // Get input
    const force = getSwimForce();

    // Apply input to player
    updatePlayer(camera, force);

    // Render
    renderer.render(scene, camera);
}
animate();