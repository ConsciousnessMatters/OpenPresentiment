'use strict';

const connectButton = document.getElementById('connect');

let port;
let inputReader;
let inputStream;
let inputOverPromise;

document.addEventListener('DOMContentLoaded', () => {
    connectButton.addEventListener('click', clickConnect);
});

async function clickConnect() {
    await connect();
}

async function connect() {
    let streamDecoder = new TextDecoderStream();

    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    inputOverPromise = port.readable.pipeTo(streamDecoder.writable);
    inputStream = streamDecoder.readable;

    inputReader = inputStream.getReader();
    readLoop();
}

async function readLoop() {
    while (true) {
        const { serialDataUnit, done } = await inputReader.read();
        if (serialDataUnit) {
            console.log(serialDataUnit);
        }
        if (done) {
            console.log('readLoop() ended', done);
            inputReader.releaseLock();
            break;
        }
    }
}
