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
    console.log('Yes');

    let trials = globalDataset.experiment(2).trials();
    let yMinMax = globalDataset.experiment(2).yMinMax();
    let hexColour;

    trials.forEach((trial) => {
        if (trial.image.type.name === 'Peaceful') {
            hexColour = '#F1E8B8';
        } else {
            hexColour = '#00FF00';
        }
        graph.drawPlot(trial.plot(), hexColour, yMinMax, 0.33);
    });

    hexColour = '#00FF00';
    let emotionalAverage = globalDataset.experiment(2).averagePlotDataForEmotionalImages();

    graph.drawPlot(emotionalAverage, hexColour, yMinMax);

    hexColour = '#F1E8B8';
    let peacefulAverage = globalDataset.experiment(2).averagePlotDataForPeacefulImages();

    graph.drawPlot(peacefulAverage, hexColour, yMinMax);


    let emotionalImages = (trial) => {
        return trial.image.type.name === 'Emotional';
    };

    let peacefulImages = (trial) => {
        return trial.image.type.name === 'Peaceful';
    };

    graph.drawAxis();

    hexColour = '#00FF00';
    let emotionalAverage2 = globalDataset.experiment(2).plotset().filter(emotionalImages).filterDuplicateData().startXFromZero().averagePlot();
    graph.drawPlot(emotionalAverage2, hexColour, yMinMax);

    hexColour = '#F1E8B8';
    let peacefulAverage2 = globalDataset.experiment(2).plotset().filter(peacefulImages).filterDuplicateData().startXFromZero().averagePlot();
    graph.drawPlot(peacefulAverage2, hexColour, yMinMax);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
