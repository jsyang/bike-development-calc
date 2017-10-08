import SOUNDS from './sounds';

let audioContext = new AudioContext();
let audioBuffers = {};

function defineSound({ name, arrayBuffer }) {
    // https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/decodeAudioData 
    audioContext.decodeAudioData(arrayBuffer)
        .then(decodedAudioBuffer => {
            audioBuffers[name] = decodedAudioBuffer;
        });
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

Object.keys(SOUNDS)
    .forEach(name => defineSound({ name, arrayBuffer: base64ToArrayBuffer(SOUNDS[name]) }));

export function playSound(name: string) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffers[name];
    source.connect(audioContext.destination);
    source.start();
}