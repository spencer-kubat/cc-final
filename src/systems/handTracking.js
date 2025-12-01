/* Handles Webcam and ML5 Logic.
   Independent of Three.js.
*/

let video;
let handPose;
let hands = []; // Stores the raw hand data from ml5

// State for the "Swim Physics"
let swimIntensity = 0;   // The current speed (0.0 to 1.0)
let lastWristDist = 0;   // Distance between wrists in the previous frame

export async function initHandTracking() {
    // 1. Create a hidden video element
    video = document.createElement('video');
    video.width = 640;
    video.height = 480;
    video.autoplay = true;
    video.playsInline = true;
    video.muted = true;
    video.flipped = true;

    // Optional: Attach to DOM if you want to see the debug camera
    document.body.appendChild(video);
    video.style.position = 'absolute';
    video.style.bottom = '10px';
    video.style.left = '10px';
    video.style.width = '200px';
    video.style.opacity = '0.5';


    // 2. Start Webcam
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.play();

        // 2. Wait for Video to actually have data (Crucial!)
        video.onloadeddata = () => {
            console.log("Video data loaded. Initializing ML5...");

            // 3. Initialize ML5 with a CALLBACK
            //    Pass 'modelLoaded' as the 3rd argument
            handPose = ml5.handPose({ flipped: true }, modelLoaded);
        };
    } catch (err) {
        console.error("Camera access denied:", err);
    }
}

// 4. This runs ONLY when the AI is fully downloaded
function modelLoaded() {
    console.log("Model Loaded! Starting detection loop...");

    // NOW it is safe to start detecting
    handPose.detectStart(video, (results) => {
        hands = results;
    });
}

/*
 * This function is called by the Game Loop every frame.
 * It returns a float (0.0 to 1.0) representing current forward "force".
 */
export function getSwimForce() {
    // DEBUG: Check what the camera sees
    if (hands.length > 0) {
        //console.log("Tracking Hand!", hands[0].wrist);
    } else {
        // console.log("Searching for hands...");
    }

    // 1. Friction (Always slow down if not swimming)
    swimIntensity *= 0.96;

    // 2. If we don't see two hands, just return the decaying speed
    if (hands.length < 2) {
        return swimIntensity;
    }

    // 3. Identify Left and Right hands (ml5 usually returns them in order, but checking confidence helps)
    const handA = hands[0];
    const handB = hands[1];

    // 4. Calculate Distance between Wrists
    // wrist is usually keypoint index 0
    const dx = handA.wrist.x - handB.wrist.x;
    const dy = handA.wrist.y - handB.wrist.y;

    // Euclidean distance (in pixels)
    const currentDist = Math.sqrt(dx*dx + dy*dy);

    // 5. THE STROKE LOGIC
    // If distance increased significantly since last frame, add force.
    const delta = currentDist - lastWristDist;

    // "20" is the sensitivity threshold.
    // You must move hands apart faster than 20px/frame to count as a stroke.
    if (delta > 15) {
        // Add to intensity, capped at 1.0
        swimIntensity += 0.05;
        if (swimIntensity > 1.0) swimIntensity = 1.0;

        // Optional: Log to see if it's working
        // console.log("Stroke!", swimIntensity.toFixed(2));
    }

    lastWristDist = currentDist;

    console.log(swimIntensity);
    return swimIntensity;
}