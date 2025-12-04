export function calculateHandState(hands) {
    let state = {
        validPose: false, // keep or delete?
        wristDistance: 0,
        areHandsClose: false,
        areHandsFar: false,
        thumbsUp: false,
        thumbsDown: false,
        palmsDown: false,
        palmsUp: false,
    }

    if (!hands || hands.length < 2) return state;
    state.validPose = true;

    let leftHand = hands[0];
    let rightHand = hands[1];

    let wristDistanceX = leftHand.wrist.x - rightHand.wrist.x;
    let wristDistanceY = leftHand.wrist.y - rightHand.wrist.y; // todo: for validPose?

    state.wristDistance = Math.sqrt(wristDistanceX*wristDistanceX + wristDistanceY*wristDistanceY);

    // if (state.wristDistance < 300) {
    //     state.areHandsClose = true;
    // } else if (state.wristDistance > 350) {
    //     state.areHandsFar = true;
    // }

    let fingerDistanceX = leftHand.middle_finger_tip.x - rightHand.middle_finger_tip.x;
    let fingerDistanceY = leftHand.middle_finger_tip.y - rightHand.middle_finger_tip.y; // todo: for validPose?

    state.fingerDistance = Math.sqrt(fingerDistanceX*fingerDistanceX + fingerDistanceY*fingerDistanceY);
    //console.log(state.fingerDistance);

    if (state.fingerDistance < 150) {
        state.areHandsClose = true;
    } else if (state.fingerDistance > 350) {
        state.areHandsFar = true;
    }

    // todo: use only one of the blocks below
    if (leftHand.pinky_finger_mcp.y < leftHand.thumb_mcp.y && rightHand.pinky_finger_mcp.y < rightHand.thumb_mcp.y) {
        state.thumbsUp = false;
        state.thumbsDown = true;
    } else if (leftHand.pinky_finger_mcp.y > leftHand.thumb_mcp.y && rightHand.pinky_finger_mcp.y > rightHand.thumb_mcp.y) {
        state.thumbsUp = true;
        state.thumbsDown = false;
    }

    let leftHandPalmDown = (Math.abs(leftHand.index_finger_mcp.y - leftHand.pinky_finger_mcp.y) < 30);
    let rightHandPalmDown = (Math.abs(rightHand.index_finger_mcp.y - rightHand.pinky_finger_mcp.y) < 30);

    state.palmsDown = leftHandPalmDown && rightHandPalmDown;
    console.log(state.palmsDown);

    // let leftThumbPinkyDistanceY = leftHand.thumb_tip.y - leftHand.pinky_finger_tip.y;
    // let rightThumbPinkyDistanceY = rightHand.thumb_tip.y - rightHand.pinky_finger_tip.y;
    // if (leftThumbPinkyDistanceY > 50 && rightThumbPinkyDistanceY > 50) {
    //     state.palmsIn = false;
    //     state.palmsOut = true;
    // } else if (leftThumbPinkyDistanceY < -50 && rightThumbPinkyDistanceY < -50) {
    //     state.palmsIn = true;
    //     state.palmsOut = false;
    // }

    return state;
}