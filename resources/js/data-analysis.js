let internalState = {
    dataset: null,
};

function initiate() {
    loadData();
    graph.initiate('#results-plotter');
}

function loadData() {
    const form = document.querySelector('form[name="ajax"]');

    helpers.ajaxForm(form, dataLoaded, dataLoadFailed);
}

function dataLoaded(data) {
    let plot,
        csvData = data.experimentalData[1].trials[0].gsr_data;

    internalState.dataset = new Dataset(csvData);
    internalState.dataset.limit();
    plot = internalState.dataset.getPlot();

    drawPlot(plot);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

function drawPlot(plot) {
    graph.drawPlot(plot);
}



export const dataAnalysis = {
    initiate,
};
