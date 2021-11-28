import {GlobalDataSet} from "./Classes/GlobalDataSet";
import {PlotSet} from "./Classes/PlotSet";

const
    experimentListItemIdAttribute = 'data-experiment-id',
    experimentListItemSelector = `[${experimentListItemIdAttribute}]`,
    showTrialsButtonSelector = '[data-load-experiment] button.show-trials',
    clearTrialsButtonSelector = '[data-load-experiment] button.remove-trials',
    loadAveragesButtonSelector = '[data-load-experiment] button.show-averages',
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
    helpers.addAtemporalEventListener('click', showTrials).querySelector(showTrialsButtonSelector);
    helpers.addAtemporalEventListener('click', clearTrials).querySelector(clearTrialsButtonSelector);
    helpers.addAtemporalEventListener('click', showAverages).querySelector(loadAveragesButtonSelector);
    helpers.addAtemporalEventListener('click', clearAverages).querySelector(clearAveragesButtonSelector);
    document.querySelector('.experiment-listing').addEventListener('mouseenter', () => {
        document.body.classList.add('scroll-lock');
    });
    document.querySelector('.experiment-listing').addEventListener('mouseleave', () => {
        document.body.classList.remove('scroll-lock');
    });
    document.body.addEventListener('scroll', scrollHandler);
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
        showTrialsButton = listItem.querySelector(showTrialsButtonSelector),
        clearTrialsButton = listItem.querySelector(clearTrialsButtonSelector),
        showAveragesButton = listItem.querySelector(loadAveragesButtonSelector),
        clearAveragesButton = listItem.querySelector(clearAveragesButtonSelector),
        id = parseInt(listItem.getAttribute(experimentListItemIdAttribute), 10),
        experiment = internalState.globalDataSet.experiment(id);

    return { showTrialsButton, clearTrialsButton, showAveragesButton, clearAveragesButton, id, experiment };
}

function buttonTogglesShowing(showButton, clearButton) {
    showButton.classList.remove('loading');
    showButton.classList.add('hidden');
    showButton.removeAttribute('disabled');
    clearButton.classList.remove('hidden');
}

function showTrials(event) {
    // ToDo: Handle request when globalDataSet is not loaded.

    const { showTrialsButton, clearTrialsButton, experiment } = getExperimentFromEvent(event);

    if (showTrialsButton.hasAttribute('disabled')) {
        return;
    }

    showTrialsButton.classList.add('loading');
    showTrialsButton.setAttribute('disabled', null);

    experiment.onload = (data) => {
        buttonTogglesShowing(showTrialsButton, clearTrialsButton);
        experiment.activateTrials();
        experimentLoaded(data);
    }
    experiment.load();
}

function clearTrials(event) {
    const { showTrialsButton, clearTrialsButton, experiment } = getExperimentFromEvent(event);

    experiment.deactivateTrials();
    showTrialsButton.classList.remove('hidden');
    clearTrialsButton.classList.add('hidden');

    drawGraphs();
}

function showAverages() {
    // ToDo: Handle request when globalDataSet is not loaded.

    const { showAveragesButton, clearAveragesButton, experiment } = getExperimentFromEvent(event);

    if (showAveragesButton.hasAttribute('disabled')) {
        return;
    }

    showAveragesButton.classList.add('loading');
    showAveragesButton.setAttribute('disabled', null);

    experiment.onload = (data) => {
        buttonTogglesShowing(showAveragesButton, clearAveragesButton);
        experiment.activateAverage();
        experimentLoaded(data);
    }
    experiment.load();
}

function clearAverages() {
    const { showAveragesButton, clearAveragesButton, experiment } = getExperimentFromEvent(event);

    experiment.deactivateAverage();
    showAveragesButton.classList.remove('hidden');
    clearAveragesButton.classList.add('hidden');

    drawGraphs();
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
    let plots, averagePlots, yMinMax,
        plotDrawn = false;

    graph.clearCanvas();

    plots = internalState.globalDataSet.experiments().reduceToActiveTrials().plotSet().trimPlotTime().setStartingYToZero();
    averagePlots = internalState.globalDataSet.experiments().reduceToActiveAverages().averagePlotSet().trimPlotTime().setStartingYToZero();

    yMinMax = PlotSet.yMinMax([plots.yMinMax(), averagePlots.yMinMax()]);

    internalState.globalDataSet.experiments().reduceToActiveTrials().forEach((experiment) => {
        experiment.setPeacefulPlotColour('#ff00ff');
        experiment.setEmotionalPlotColour('#00FF00');

        experiment.plotSet().forEach((plot) => {
            plot.trimPlotTime().setStartingYToZero();

            graph.drawPlot(plot, yMinMax, 0.33);
            plotDrawn = true;
        });
    });

    internalState.globalDataSet.experiments().reduceToActiveAverages().forEach((experiment) => {
        experiment.setPeacefulPlotColour('#ff00ff');
        experiment.setEmotionalPlotColour('#00FF00');

        experiment.averagePlotSet().forEach((averagePlot) => {
            averagePlot.trimPlotTime().setStartingYToZero();

            graph.drawPlot(averagePlot, yMinMax, 1);
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
    //     .trimPlotTime()
    //     .setStartingYToZero()
    //     .averagePlot();
    //
    // peacefulAverage.colour('#ff00ff');
    //
    // graph.drawPlot(peacefulAverage, yMinMax);
}

function scrollHandler(event) {
    debugger;
}

function dataLoadFailed() {
    console.log('Something went wrong loading data.');
}

export const dataAnalysis = {
    initiate,
};
