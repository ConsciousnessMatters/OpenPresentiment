'use strict';

const connectionProgress = document.querySelector('.open-gsr .connection-progress');

document.addEventListener('UserCancelledConnection', (event) => {
    alert('User cancelled connection, reload page to try again.');
});

document.querySelector('button.connect').addEventListener('click', (event) => {
    connectionProgress.classList.remove('hidden');
    connectionProgress.innerHTML = 'Please select a port.';
});

document.addEventListener('SerialPortSelected', (event) => {
    connectionProgress.innerHTML = 'Connecting...';
});

document.addEventListener('GraphOnline', (event) => {
    updateToStage3();
});

document.querySelector('button.clearData').addEventListener('click', (event) => {
    clearData();
});

document.querySelector('button.exportData').addEventListener('click', (event) => {
    exportData();
});

// document.querySelectorAll('button.goBackHome').forEach((element) => {
//     element.addEventListener('click', (event) => {
//         window.location = '/';
//     });
// });

function updateToStage2() {

}

function updateToStage3() {
    document.querySelector('.open-gsr .connection-progress').classList.add('hidden');
    document.querySelector('.open-gsr .options').classList.remove('hidden');
    document.querySelector('.open-gsr .connect').classList.add('hidden');
    document.querySelector('.open-gsr .axis-x-label').classList.remove('hidden');
    document.querySelector('.open-gsr .axis-y-label').classList.remove('hidden');
}

function clearData() {
    gsrData = [];
}

function exportData() {
    const a =  document.createElement('a'),
        startTime = gsrData[0].time ?? 0;

    let virtualFile,
        saveData = '';

    saveData += "milliseconds, millivolts\r\n";
    gsrData.forEach((datapoint) => {
        saveData += datapoint.time - startTime + "," + datapoint.millivolts + "\r\n";
    });

    virtualFile = new Blob([saveData], {type: 'text/csv'});
    a.href = URL.createObjectURL(virtualFile);
    a.download = 'OpenPresentimentGSR-' + Date.now();
    a.click();
    URL.revokeObjectURL(a.href);
}
