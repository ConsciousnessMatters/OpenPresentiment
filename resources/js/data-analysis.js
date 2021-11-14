import {GlobalDataSet} from "./Classes/GlobalDataSet";

let internalState = {
    globalDataSet: null,
};

function initiate() {
    loadData();
    graph.initiate('#results-plotter');
    listeners();
    preload();
}

function loadData() {
    const form = document.querySelector('form[name="ajax-list"]');

    helpers.ajaxForm(form, glboalDataSetSkeletonLoaded, dataLoadFailed);
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
    // ToDo: Handle request when globalDataSet is not loaded.

    let experimentId = parseInt(event.target.closest('[data-load-experiment]').getAttribute('data-load-experiment'), 10),
        experiment = internalState.globalDataSet.experiment(experimentId);

    experiment.onload = experimentLoaded;
    experiment.load();
}

function glboalDataSetSkeletonLoaded(data) {
    internalState.globalDataSet = new GlobalDataSet(data);
    populateList();
}

function experimentLoaded() {
    drawGraphs();
}

function populateList() {
    const experimentList = document.querySelector('ul.experiments'),
        experimentListItemTemplate = document.querySelector('ul.experiments li.template-item');

    internalState.globalDataSet.experiments().forEach((experiment) => {
        let newListItem = experimentListItemTemplate.cloneNode(true);

        newListItem.classList.remove('template-item');
        newListItem.querySelector('.experiment-number').innerHTML = experiment.id;
        newListItem.setAttribute('data-load-experiment', experiment.id);
        experimentList.append(newListItem);
    });
}

function drawGraphs() {
    let trials, yMinMax;

    graph.clearCanvas();

    let testYMinMax = internalState.globalDataSet.experiments().reduceToLoaded().plotSet().yMinMax();

    debugger;

    internalState.globalDataSet.experimentsLoaded().forEach((experiment) => {
        trials = experiment.trials();
        yMinMax = experiment.plotSet().trimPlotTime().setStartingYToZero().yMinMax();

        trials.forEach((trial) => {
            let plot = trial.plot();

            if (trial.image.type.name === 'Peaceful') {
                plot.colour('#ff00ff');
            } else {
                plot.colour('#00FF00');
            }

            let a = plot.trimPlotTime();
            let b = a.setStartingYToZero();

            graph.drawPlot(b, yMinMax, 0.33);
        });

        graph.drawAxis(yMinMax);
        graph.drawLabels(yMinMax);
        graph.drawGrid(yMinMax);
    });


    // graph.clearCanvas();
    //
    // let emotionalImages = (trial) => trial.image.type.name === 'Emotional';
    // let peacefulImages = (trial) => trial.image.type.name === 'Peaceful';
    //
    // let emotionalAverage = globalDataSet.experiment(2)
    //     .plotSet()
    //     .filter(emotionalImages)
    //     .filterDuplicateData()
    //     .trimPlotTime()
    //     .setStartingYToZero()
    //     .averagePlot();
    //
    // emotionalAverage.colour('#00FF00');
    //
    // graph.drawPlot(emotionalAverage, yMinMax);
    //
    // let peacefulAverage = globalDataSet.experiment(2)
    //     .plotSet()
    //     .filter(peacefulImages)
    //     .filterDuplicateData()
    //     .trimPlotTime()
    //     .setStartingYToZero()
    //     .averagePlot();
    //
    // peacefulAverage.colour('#ff00ff');
    //
    // graph.drawPlot(peacefulAverage, yMinMax);
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
