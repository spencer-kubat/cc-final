// src/systems/faceSteering.js

const DEADZONE = 0.1;
const SENSITIVITY = 0.03;
const MAX_LOOK_ANGLE = 1.5;
const PITCH_OFFSET = 0.15;

export function updateHeadTracking(camera, facesData) {
    if (!facesData || facesData.length === 0) return;

    const face = facesData[0];
    const nose = face.keypoints[1];
    const leftCheek = face.keypoints[454];  // left edge of face
    const rightCheek = face.keypoints[234]; // right edge of face

    // distance from left cheek to right cheek (total face width)
    const faceWidth = Math.abs(leftCheek.x - rightCheek.x);

    // Distance from left cheek to nose
    const leftToNose = Math.abs(leftCheek.x - nose.x);

    // Calculate Ratio (0.0 to 1.0)
    // 0.5 means nose is perfectly in the middle.
    // < 0.5 means looking Left (closer to left cheek)
    // > 0.5 means looking Right
    const ratio = leftToNose / faceWidth;

    // Center the ratio so 0.0 is straight ahead
    // Result: -0.5 (Left) to +0.5 (Right)
    const yawValue = ratio - 0.5;

    // Apply Rotation
    if (Math.abs(yawValue) > DEADZONE) {
        // We multiply by 2.0 to make the range -1 to 1 like before
        camera.rotation.y += (yawValue * 2.0) * SENSITIVITY;
    }


    // --- 2. CALCULATE PITCH (Looking Up/Down) ---
    // For Up/Down, Screen Position is actually usually better/safer.
    // Why? Because "Pitching" your head strictly using geometry is noisy.
    // However, we can make it relative to the Head Center to allow sitting off-center.

    // Calculate the vertical center of the head
    const headCenterY = (leftCheek.y + rightCheek.y) / 2;

    // Compare Nose Y to Head Center Y
    // If Nose is above HeadCenter -> Looking Up
    // If Nose is below HeadCenter -> Looking Down
    const pitchDiff = nose.y - headCenterY;

    // Normalize roughly (Face height is roughly faceWidth)
    let pitchValue = pitchDiff / faceWidth;

    pitchValue -= PITCH_OFFSET;

    // Apply Pitch
    // Note: You might need to tweak the Deadzone for pitch specifically
    if (Math.abs(pitchValue) > (DEADZONE / 2)) {
        camera.rotation.x -= pitchValue * SENSITIVITY;

        // Clamp
        camera.rotation.x = Math.max(-MAX_LOOK_ANGLE, Math.min(MAX_LOOK_ANGLE, camera.rotation.x));
    }

    // Ensure Horizon Lock
    camera.rotation.order = "YXZ";
}