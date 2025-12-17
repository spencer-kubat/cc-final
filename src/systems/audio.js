import * as THREE from 'three';

let sound;

export function initAudio(camera) {
    const listener = new THREE.AudioListener();
    camera.add(listener);
    sound = new THREE.Audio(listener);

    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('/music.wav', function(buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);

        // Note: We don't call play() here immediately to avoid browser errors.
        // We wait for user interaction.
    });
}

// Call this when the user clicks or presses a key for the first time
export function startMusic() {
    if (sound && !sound.isPlaying) {
        sound.play();
        console.log("Music Started");
    }
}