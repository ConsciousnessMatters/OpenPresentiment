let internalState = {
    globalDataset: null,
};

function initiate() {
    loadData();
    graph.initiate('#results-plotter');
    listeners();
    preload();
}

function loadData() {
    const form = document.querySelector('form[name="ajax-list"]');

    helpers.ajaxForm(form, glboalDatasetSkeletonLoaded, dataLoadFailed);
}

function listeners() {
    helpers.addAtemporalEventListener('click', loadExperiment).querySelector('[data-load-experiment] button');
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

function loadExperiment(event) {
    // ToDo: Handle request when globalDataset is not loaded.

    let experimentId = parseInt(event.target.closest('[data-load-experiment]').getAttribute('data-load-experiment'), 10),
        experiment = internalState.globalDataset.experiment(experimentId);

    experiment.onload = experimentLoaded;
    experiment.load();
}

function glboalDatasetSkeletonLoaded(data) {
    internalState.globalDataset = new GlobalDataset(data);
    populateList();
    // drawGraphs();
}

function experimentLoaded() {
    drawGraphs();
}

function populateList() {
    const experimentList = document.querySelector('ul.experiments'),
        experimentListItemTemplate = document.querySelector('ul.experiments li.template-item');

    internalState.globalDataset.experiments().forEach((experiment) => {
        let newListItem = experimentListItemTemplate.cloneNode(true);

        newListItem.classList.remove('template-item');
        newListItem.querySelector('.experiment-number').innerHTML = experiment.id;
        newListItem.setAttribute('data-load-experiment', experiment.id);
        experimentList.append(newListItem);
    });
}

function drawGraphs() {
    debugger;

    let trials = internalState.globalDataset.experiment(2).trials();
    let yMinMax = internalState.globalDataset.experiment(2).plotset().trimPlotTime().setStartingYToZero().yMinMax();

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
