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

    let trials = globalDataset.experiment(2).trials();
    let yMinMax = globalDataset.experiment(2).yMinMax();

    trials.forEach((trial) => {
        let hexColour;

        if (trial.image.type.name === 'Peaceful') {
            hexColour = '#F1E8B8';
        } else {
            hexColour = '#00FF00';
        }
        graph.drawPlot(trial.plot(), hexColour, yMinMax, 0.33);
    });

    let hexColour = '#00FF00';
    let emotionalAverage = globalDataset.experiment(2).averagePlotDataForEmotionalImages();

    graph.drawPlot(emotionalAverage, hexColour, yMinMax);

    hexColour = '#F1E8B8';
    let peacefulAverage = globalDataset.experiment(2).averagePlotDataForPeacefulImages();

    graph.drawPlot(peacefulAverage, hexColour, yMinMax);

    graph.drawAxis();
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
