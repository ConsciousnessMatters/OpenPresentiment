'use strict';

document.addEventListener('GraphOnline', (event) => {
    updateButtonOptionsToStage2();
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

function updateButtonOptionsToStage2() {
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
