import * as THREE from 'three';

let listener;
let music;
let ambient;
let swimBuffer; // Reusable buffer for swim sounds

export function initAudio(camera) {
    listener = new THREE.AudioListener();
    camera.add(listener);

    const loader = new THREE.AudioLoader();

    music = new THREE.Audio(listener);
    loader.load(`${import.meta.env.BASE_URL}music.wav`, (buffer) => {
        music.setBuffer(buffer);
        music.setLoop(true);
        music.setVolume(0.2);
    });

    ambient = new THREE.Audio(listener);
    loader.load(`${import.meta.env.BASE_URL}ambient.wav`, (buffer) => {
        ambient.setBuffer(buffer);
        ambient.setLoop(true);
        ambient.setVolume(0.6);
    });

    loader.load(`${import.meta.env.BASE_URL}swim.mp3`, (buffer) => {
        swimBuffer = buffer;
    });
}


export function startAudio() {
    // Resume context (Browser requirement)
    if (listener.context.state === 'suspended') {
        listener.context.resume();
    }

    if (music && !music.isPlaying) {
        music.play();
    }

    if (ambient && !ambient.isPlaying) {
        ambient.play();
    }
}

export function playSwimSound() {
    if (!swimBuffer) return;

    // Create a fresh audio source for this specific splash
    const sfx = new THREE.Audio(listener);
    sfx.setBuffer(swimBuffer);

    // Randomize pitch (0.9 to 1.1) for variety
    sfx.setDetune((Math.random() * 200) - 100);
    sfx.setVolume(0.8);

    sfx.play();
}