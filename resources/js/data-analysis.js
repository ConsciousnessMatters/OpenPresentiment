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
        let plot = trial.plot();

        if (trial.image.type.name === 'Peaceful') {
            plot.colour('#ff00ff');
        } else {
            plot.colour('#00FF00');
        }

        graph.drawPlot(plot.trimPlotTime().setStartingYToZero(), yMinMax, 0.33);
    });

    let emotionalImages = (trial) => {
        return trial.image.type.name === 'Emotional';
    };

    let peacefulImages = (trial) => {
        return trial.image.type.name === 'Peaceful';
    };

    graph.drawAxis(yMinMax);
    graph.drawLabels(yMinMax);
    graph.drawGrid(yMinMax);

    let emotionalAverage = globalDataset.experiment(2).plotset().filter(emotionalImages).filterDuplicateData().trimPlotTime().setStartingYToZero().averagePlot();
    emotionalAverage.colour('#00FF00');
    graph.drawPlot(emotionalAverage, yMinMax);

    let peacefulAverage = globalDataset.experiment(2).plotset().filter(peacefulImages).filterDuplicateData().trimPlotTime().setStartingYToZero().averagePlot();
    peacefulAverage.colour('#ff00ff');
    graph.drawPlot(peacefulAverage, yMinMax);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
