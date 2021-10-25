let experimetnalData;

function initiate() {
    console.log('We got here');
    loadData();
}

function loadData() {
    const form = document.querySelector('form[name="ajax"]');

    console.log('Loading Data...');
    helpers.ajaxForm(form, dataLoaded, dataLoadFailed);
}

function dataLoaded(data) {
    console.log('Data Loaded');
    experimetnalData = data;
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
    experimetnalData,
};