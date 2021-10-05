'use strict';

document.addEventListener('GraphOnline', (event) => {
    updateButtonOptionsToStage2();
});

document.querySelector('#clearData').addEventListener('click', (event) => {
    clearData();
});

document.querySelector('#exportData').addEventListener('click', (event) => {
    exportData();
});

function updateButtonOptionsToStage2() {
    document.querySelector('#setup > .options').classList.remove('hidden');
    document.querySelector('#setup > .connect').classList.add('hidden');
}

function clearData() {
    gsrData = [];
}

function exportData() {
    const a =  document.createElement('a'),
        saveData = JSON.stringify(gsrData),
        virtualFile = new Blob([saveData], {type: 'application/json'});

    a.href = URL.createObjectURL(virtualFile);
    a.download = 'OpenPresentimentGSR-' + Date.now();
    a.click();
    URL.revokeObjectURL(a.href);
}
