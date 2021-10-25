'use strict';

const connectButton = document.querySelector('button.connect'),
    microvoltMode = true;

let port,
    inputReader,
    inputStream,
    inputStreamBuffer = '',
    inputOverPromise,
    discardDataPoints = 10;

document.addEventListener('DOMContentLoaded', () => {
    connectButton.addEventListener('click', () => {
        clickConnect().catch(() => {
            document.body.classList.add('portSelectionFailure');
        });
    });
});

async function clickConnect() {
    await connect();
}

async function connect() {
    let streamDecoder = new TextDecoderStream();

    port = await navigator.serial.requestPort();

    fireCustomEventOnDocument('SerialPortSelected');

    await port.open({ baudRate: 9600 });
    inputOverPromise = port.readable.pipeTo(streamDecoder.writable);
    inputStream = streamDecoder.readable;
    inputReader = inputStream.getReader();

    fireCustomEventOnDocument('SerialPortReading');
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

                if (discardDataPoints) {
                    discardDataPoints--;
                } else {
                    logicalUnits.forEach(handleIncomingDataPoint);
                }
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
    // const dataItems = dataPoint.split(","),
    //     galvanicSkinResponse = new CustomEvent('GSRDataPoint', {
    //         detail: {
    //             time: parseInt(dataItems[0]),
    //             millivolts: getMillivolts(dataItems),
    //         }
    //     });
    //
    // document.dispatchEvent(galvanicSkinResponse);
    const dataItems = dataPoint.split(",");

    fireCustomEventOnDocument('GSRDataPoint', {
        time: parseInt(dataItems[0]),
        millivolts: getMillivolts(dataItems),
    });
}

function getMillivolts(dataItems) {
    if (microvoltMode) {
        return parseFloat(dataItems[1] / 1000);
    } else {
        return parseFloat(dataItems[1]);
    }
}

function fireCustomEventOnDocument(name, detailsObject = null) {
    let data = null;

    if (detailsObject !== null) {
        data = {
            detail: detailsObject
        };
    }

    const customEvent = new CustomEvent(name, data);
    document.dispatchEvent(customEvent);
}
