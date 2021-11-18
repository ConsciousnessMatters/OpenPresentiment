import {GlobalDataSet} from "./Classes/GlobalDataSet";

const
    experimentListItemIdAttribute = 'data-experiment-id',
    experimentListItemSelector = `[${experimentListItemIdAttribute}]`,
    loadButtonSelector = '[data-load-experiment] button.load',
    clearButtonSelector = '[data-load-experiment] button.remove',
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
    helpers.addAtemporalEventListener('click', loadExperiment).querySelector(loadButtonSelector);
    helpers.addAtemporalEventListener('click', clearExperiment).querySelector(clearButtonSelector);
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

function getExperimentFromEvent(event) {
    const listItem = event.target.closest(experimentListItemSelector),
        loadButton = listItem.querySelector(loadButtonSelector),
        clearButton = listItem.querySelector(clearButtonSelector),
        showAveragesButton = listItem.querySelector(showAveragesButtonSelector),
        clearAveragesButton = listItem.querySelector(clearAveragesButtonSelector),
        id = parseInt(listItem.getAttribute(experimentListItemIdAttribute), 10),
        experiment = internalState.globalDataSet.experiment(id);

    return { loadButton, clearButton, showAveragesButton, clearAveragesButton, id, experiment };
}

function loadExperiment(event) {
    // ToDo: Handle request when globalDataSet is not loaded.

    const { loadButton, clearButton, showAveragesButton, clearAveragesButton, id, experiment } = getExperimentFromEvent(event);

    if (loadButton.hasAttribute('disabled')) {
        return;
    }

    loadButton.classList.add('loading');
    loadButton.setAttribute('disabled', null);

    experiment.onload = experimentLoaded;
    experiment.load((data) => {
        loadButton.classList.remove('loading');
        loadButton.classList.add('hidden');
        loadButton.removeAttribute('disabled');
        clearButton.classList.remove('hidden');
    });
}

function clearExperiment(event) {
    const { loadButton, clearButton,  showAveragesButton, clearAveragesButton, id, experiment } = getExperimentFromEvent(event);

    experiment.deactivate();
    loadButton.classList.remove('hidden');
    clearButton.classList.add('hidden');

    drawGraphs();
}

function showAverages() {
    const { loadButton, clearButton,  showAveragesButton, clearAveragesButton, id, experiment } = getExperimentFromEvent(event);
}

function clearAverages() {
    const { loadButton, clearButton,  showAveragesButton, clearAveragesButton, id, experiment } = getExperimentFromEvent(event);
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

    plots = internalState.globalDataSet.experiments().reduceToActiveTrials().plotSet().trimPlotTime().setStartingYToZero();
    yMinMax = plots.yMinMax();

    internalState.globalDataSet.experiments().reduceToActiveTrials().forEach((experiment) => {
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
