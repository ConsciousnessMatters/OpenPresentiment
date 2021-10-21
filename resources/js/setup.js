function initiate() {
    setupEventHandling();
}

function setupEventHandling() {
    document.querySelector('#import-images').addEventListener('click', importImages);
}

function importImages() {
    let xhr = new XMLHttpRequest(),
        url = '/mylab/setup/importImages';

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
        } else if (xhr.readyState === 4) {
            console.log('Something went wrong trying to obtain images.');
        }
    };

    xhr.onerror = () => {
        console.log('Something went very wrong trying to obtain images.');
    };

    xhr.open('GET', url, true);
    xhr.send();
}

export const setup = {
    initiate
};
