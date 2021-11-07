let internalState = {
    dataset: null,
};

function initiate() {
    loadData();
    graph.initiate('#results-plotter');
    preload();
}

function preload() {
    const yMinMax = {
        yMin: -100,
        yMax: 100,
    };

    graph.clearCanvas();
    graph.drawAxis(yMinMax);
    graph.drawLabels(yMinMax);
    graph.drawGrid(yMinMax);
}

function loadData() {
    const form = document.querySelector('form[name="ajax"]');

    helpers.ajaxForm(form, dataLoaded, dataLoadFailed);
}

function dataLoaded(data) {
    const globalDataset = new GlobalDataset(data);

    let trials = globalDataset.experiment(2).trials();
    let yMinMax = globalDataset.experiment(2).plotset().trimPlotTime().setStartingYToZero().yMinMax();

    graph.clearCanvas();

    trials.forEach((trial) => {
        let plot = trial.plot();

        if (trial.image.type.name === 'Peaceful') {
            plot.colour('#ff00ff');
        } else {
            plot.colour('#00FF00');
        }

        graph.drawPlot(trial.plot().trimPlotTime().setStartingYToZero(), yMinMax, 0.33);
    });

    let emotionalImages = (trial) => trial.image.type.name === 'Emotional';
    let peacefulImages = (trial) => trial.image.type.name === 'Peaceful';

    graph.drawAxis(yMinMax);
    graph.drawLabels(yMinMax);
    graph.drawGrid(yMinMax);

    let emotionalAverage = globalDataset.experiment(2)
        .plotset()
        .filter(emotionalImages)
        .filterDuplicateData()
        .trimPlotTime()
        .setStartingYToZero()
        .averagePlot();

    emotionalAverage.colour('#00FF00');

    graph.drawPlot(emotionalAverage, yMinMax);

    let peacefulAverage = globalDataset.experiment(2)
        .plotset()
        .filter(peacefulImages)
        .filterDuplicateData()
        .trimPlotTime()
        .setStartingYToZero()
        .averagePlot();

    peacefulAverage.colour('#ff00ff');

    graph.drawPlot(peacefulAverage, yMinMax);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
