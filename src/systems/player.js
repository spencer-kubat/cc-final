export function updatePlayer(camera, swimForce) {
    const maxSpeed = 0.2;

    // Move Camera Forward (Negative Z)
    // swimForce comes from handTracking.js
    const currentSpeed = swimForce * maxSpeed;

    camera.position.z -= currentSpeed;

    // Optional: Add some "bobbing" motion to feel like water
    // camera.position.y += Math.sin(Date.now() * 0.001) * 0.005;
}