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

        trial.limit();
        if (trial.image.type.name === 'Peaceful') {
            hexColour = '#F1E8B8';
        } else {
            hexColour = '#00FF00';
        }
        graph.drawPlot(trial.getPlot(), hexColour, yMinMax);
    });
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
