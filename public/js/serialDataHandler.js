'use strict';

const connectButton = document.getElementById('connect');

let port;
let inputReader;
let inputStream;
let inputStreamBuffer = '';
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

    serialReadLoop();
}

async function serialReadLoop() {
    while (true) {
        const { value, done } = await inputReader.read();

        if (value) {
            let logicalUnits;
            let dataUnit = value.replace(/\r/g, '');

            inputStreamBuffer += dataUnit;
            logicalUnits = inputStreamBuffer.split("\n");

            if (logicalUnits.length > 1) {
                let remainder;

                remainder = logicalUnits.pop();
                inputStreamBuffer = remainder;
                logicalUnits.forEach(handleIncomingDataPoint);
            }
        }
        if (done) {
            console.log('serialReadLoop() ended', done);
            inputReader.releaseLock();
            break;
        }
    }
}

function handleIncomingDataPoint(dataPoint) {
    const galvanicSkinResponse = new CustomEvent('GSRDataPoint', { detail: { time: Date.now(), millivolts: dataPoint }});
    document.dispatchEvent(galvanicSkinResponse);
}
