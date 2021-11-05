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
    const globalDataset = new GlobalDataset(data);
    window.globalDataset = globalDataset; // ToDo: What?

    let trials = globalDataset.experiment(2).trials();
    let yMinMax = globalDataset.experiment(2).plotset().trimPlotTime().setStartingYToZero().yMinMax();
    let hexColour;

    trials.forEach((trial) => {
        if (trial.image.type.name === 'Peaceful') {
            hexColour = '#F1E8B8';
        } else {
            hexColour = '#00FF00';
        }
        graph.drawPlot(trial.plot().trimPlotTime().setStartingYToZero(), hexColour, yMinMax, 0.33);
    });

    let emotionalImages = (trial) => {
        return trial.image.type.name === 'Emotional';
    };

    let peacefulImages = (trial) => {
        return trial.image.type.name === 'Peaceful';
    };

    graph.drawAxis();

    hexColour = '#00FF00';
    let emotionalAverage = globalDataset.experiment(2).plotset().filter(emotionalImages).filterDuplicateData().trimPlotTime().setStartingYToZero().averagePlot();
    graph.drawPlot(emotionalAverage, hexColour, yMinMax);

    hexColour = '#F1E8B8';
    let peacefulAverage = globalDataset.experiment(2).plotset().filter(peacefulImages).filterDuplicateData().trimPlotTime().setStartingYToZero().averagePlot();
    graph.drawPlot(peacefulAverage, hexColour, yMinMax);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
