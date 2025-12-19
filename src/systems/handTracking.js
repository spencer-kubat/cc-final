/* global ml5 */

let faceMesh;
let handPose;
let video;
let faces = [];
let hands = [];

// Debugging Variables
let debugCanvas;
let ctx;

export async function initML5Tracking() {
    // Setup Video (Hidden)
    video = document.createElement('video');
    video.playsInline = true;
    video.autoplay = true;
    video.muted = true;
    video.width = 320;  // Force standard resolution
    video.height = 240;

    setupDebugCanvas();

    video.srcObject = await navigator.mediaDevices.getUserMedia({video: true});
    video.play();

    video.onloadeddata = () => {
        console.log("Video loaded. Starting ML5...");
        // Initialize ML5
        handPose = ml5.handPose({ flipped: false }, modelLoaded);
    };

    const faceOptions = { maxFaces: 1, refineLandmarks: false, flipped: true };
    faceMesh = ml5.faceMesh(video, faceOptions, () => {
        console.log("Face Model Loaded");
        faceMesh.detectStart(video, (results) => {
            faces = results;
        });
    });
}

function modelLoaded() {
    console.log("Model Loaded!");
    // Start the detection loop
    handPose.detectStart(video, (results) => {
        hands = results;
    });

    // Start the Visual Drawing Loop (separate from game loop)
    requestAnimationFrame(drawDebug);
}

// --- VISUAL DEBUGGING LOGIC ---
function setupDebugCanvas() {
    debugCanvas = document.createElement('canvas');
    debugCanvas.width = 320;  // Half size is enough for preview
    debugCanvas.height = 240;

    Object.assign(debugCanvas.style, {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        border: '2px solid white',
        borderRadius: '8px',
        zIndex: '100',
        transform: 'scaleX(-1)'
    });

    document.body.appendChild(debugCanvas);
    ctx = debugCanvas.getContext('2d');
}

function drawDebug() {
    requestAnimationFrame(drawDebug); // Keep looping

    if (!ctx || !video) return;

    ctx.drawImage(video, 0, 0, debugCanvas.width, debugCanvas.height);

    // Draw Hands
    if (hands.length > 0) {
        const scaleX = debugCanvas.width / video.width;
        const scaleY = debugCanvas.height / video.height;

        for (let hand of hands) {
            // Color Logic (p5 style)
            if (hand.handedness === "Left") {
                ctx.fillStyle = "magenta";
            } else {
                ctx.fillStyle = "yellow";
            }

            // Draw Keypoints
            for (let keypoint of hand.keypoints) {
                const x = keypoint.x * scaleX;
                const y = keypoint.y * scaleY;

                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2); // Radius 5 circle
                ctx.fill();
            }
        }
    }
}

export function getHandData() {
    return hands;
}

export function getHeadData() {
    return faces;
}