// gestureMachine.js

const states = {
    idle: 'idle',
    forwardSwim: 'forwardSwim',
    backwardSwim: 'backwardSwim',
    primedForward: 'primedForward',
    primedBackward: 'primedBackward',
};

let currentState = states.idle;
let primeTimestamp = 0; // The moment we LEFT the safe zone

export function updateGestureState(handData) {
    const now = Date.now();

    switch (currentState) {

        // --- 1. IDLE (Waiting to start) ---
        case states.idle:
            // Entry Rule: Hands must be close AND thumbs down
            if (handData.areHandsClose && handData.thumbsDown) {
                enterState(states.primedForward);
            } else if (handData.areHandsFar && handData.thumbsUp) {
                enterState(states.primedBackward);
            }
            break;
            
        case states.primedForward:
            if (handData.areHandsClose && handData.thumbsDown) {
                primeTimestamp = now;
            }
            // LOGIC B: THE CHECK
            // If hands are NOT close, we are in the "Gap". Check time.
            const timeSinceLeftSafeZone = now - primeTimestamp;
            if (timeSinceLeftSafeZone > 3000) {
                console.log("Too slow! Stroke cancelled.");
                enterState(states.idle);
                return states.idle;
            }
            if (handData.areHandsFar && handData.thumbsDown) {
                enterState(states.forwardSwim);
            }
            if (!handData.thumbsUp) {
                //enterState(states.idle);
            }

            break;

        case states.primedBackward:
            if (handData.areHandsFar && handData.thumbsUp) {
                primeTimestamp = now;
            }
            const timeSinceLeftSafeZones = now - primeTimestamp;
            if (timeSinceLeftSafeZones > 3000) {
                console.log("Too slow! Stroke cancelled.");
                enterState(states.idle);
                return states.idle;
            }
            if (handData.areHandsClose && handData.thumbsUp) {
                enterState(states.backwardSwim);
            }
            break;

        // --- 3. SWIMMING (The Action) ---
        case states.forwardSwim:
            enterState(states.idle);
            break;

        case states.backwardSwim:
            enterState(states.idle);
            break;

    }

    return currentState;
}

function enterState(newState) {
    currentState = newState;
    primeTimestamp = Date.now(); // Initialize timer on entry
    console.log(`State Changed: ${newState}`);
}