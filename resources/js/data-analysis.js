import {GlobalDataSet} from "./Classes/GlobalDataSet";

const
    experimentListItemIdAttribute = 'data-experiment-id',
    experimentListItemSelector = `[${experimentListItemIdAttribute}]`,
    loadExperimentButtonSelector = '[data-load-experiment] button.load',
    clearExperimentButtonSelector = '[data-load-experiment] button.remove',
    showAveragesButtonSelector = '[data-load-experiment] button.show-averages',
    clearAveragesButtonSelector = '[data-load-experiment] button.remove-averages';

let internalState = {
    globalDataSet: null,
};

function initiate() {
    loadData();
    graph.initiate('#results-plotter');
    listeners();
    drawEmtpyGraph();
}

function loadData() {
    const form = document.querySelector('form[name="ajax-list"]');

    helpers.ajaxForm(form, glboalDataSetSkeletonLoaded, dataLoadFailed);
}

function listeners() {
    helpers.addAtemporalEventListener('click', loadExperiment).querySelector(loadExperimentButtonSelector);
    helpers.addAtemporalEventListener('click', clearExperiment).querySelector(clearExperimentButtonSelector);
    helpers.addAtemporalEventListener('click', showAverages).querySelector(showAveragesButtonSelector);
    helpers.addAtemporalEventListener('click', clearAverages).querySelector(clearAveragesButtonSelector);
}

function drawEmtpyGraph() {
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

    const experimentListItem = event.target.closest(experimentListItemSelector),
        loadExperimentButton = experimentListItem.querySelector(loadExperimentButtonSelector),
        clearExperimentButton = experimentListItem.querySelector(clearExperimentButtonSelector),
        experimentId = parseInt(experimentListItem.getAttribute(experimentListItemIdAttribute), 10),
        experiment = internalState.globalDataSet.experiment(experimentId);

    if (loadExperimentButton.hasAttribute('disabled')) {
        return;
    }

    loadExperimentButton.classList.add('loading');
    loadExperimentButton.setAttribute('disabled', null);

    experiment.onload = experimentLoaded;
    experiment.load((data) => {
        loadExperimentButton.classList.remove('loading');
        loadExperimentButton.classList.add('hidden');
        loadExperimentButton.removeAttribute('disabled');
        clearExperimentButton.classList.remove('hidden');
    });
}

function clearExperiment(event) {
    const experimentListItem = event.target.closest(experimentListItemSelector),
        loadExperimentButton = experimentListItem.querySelector(loadExperimentButtonSelector),
        clearExperimentButton = experimentListItem.querySelector(clearExperimentButtonSelector),
        experimentId = parseInt(experimentListItem.getAttribute(experimentListItemIdAttribute), 10),
        experiment = internalState.globalDataSet.experiment(experimentId);

    experiment.deactivate();
    loadExperimentButton.classList.remove('hidden');
    clearExperimentButton.classList.add('hidden');

    drawGraphs();
}

function showAverages() {

}

function clearAverages() {

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
        let newListItem = experimentListItemTemplate.cloneNode(true),
            experimentTime = new Date(experiment.started_at);

        newListItem.classList.remove('template-item');
        newListItem.setAttribute('data-experiment-id', experiment.id);
        newListItem.querySelector('.experiment-number').innerHTML = experiment.id;
        newListItem.querySelector('.subject-number').innerHTML = experiment.subject_user_id;
        newListItem.querySelector('.subject-name').innerHTML = experiment.subject_user.name;
        newListItem.querySelector('.subject-email').innerHTML = experiment.subject_user.email;
        newListItem.querySelector('.experiment-date-time').innerHTML = experimentTime.toString();
        newListItem.setAttribute('data-load-experiment', experiment.id);
        experimentList.append(newListItem);
    });
}

function drawGraphs() {
    let plots, yMinMax,
        plotDrawn = false;

    graph.clearCanvas();

    plots = internalState.globalDataSet.experiments().reduceToActive().plotSet().trimPlotTime().setStartingYToZero();
    yMinMax = plots.yMinMax();

    internalState.globalDataSet.experiments().reduceToActive().forEach((experiment) => {
        experiment.trials().forEach((trial) => {
            let plot = trial.plot();

            if (trial.image.type.name === 'Peaceful') {
                plot.colour('#ff00ff');
            } else {
                plot.colour('#00FF00');
            }

            plot.trimPlotTime().setStartingYToZero();

            graph.drawPlot(plot, yMinMax, 0.33);
            plotDrawn = true;
        });
    });

    if (! plotDrawn) {
        drawEmtpyGraph();
    } else {
        graph.drawAxis(yMinMax);
        graph.drawLabels(yMinMax);
        graph.drawGrid(yMinMax);
    }

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
