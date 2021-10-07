'use strict';

/*
Debugging notes: The scale as is should be theoretically perfect, however the assumption that each datapoint is
perfectly spaced is probably the cause of the problems. I want to migrate now to plot using actual times, not theoretic.
This should make the scale work perfectly again. Treat the scale as a code checksum, when they're in sync we're plotting
nicely. Out of sync means there's an error somewhere. Also note the transition point from static to moving, it should be
synchronised.
*/

let gsrData = [],
    scaleFactor = window.devicePixelRatio || 1,
    canvasActivated = false,
    axisSpaceX = 30 * scaleFactor,
    axisSpaceY = 30 * scaleFactor,
    plotWidth,
    plotHeight,
    timeMin,
    timeMax,
    millivoltsMin,
    millivoltsMax;

const datapointSpacing = 6,
    spacingPerSecond = 50 * scaleFactor,
    graphCC = document.getElementById('graph').getContext('2d');

document.addEventListener('GSRDataPoint', (event) => {
    gsrData.push(event.detail);
    if (!canvasActivated) {
        const graphOnline = new CustomEvent('GraphOnline');
        document.dispatchEvent(graphOnline);
        canvasSetup();
    }
    renderGraph();
});

window.addEventListener('resize', () => {
    canvasSetup();
});

function canvasSetup() {
    graphCC.canvas.width = graphCC.canvas.scrollWidth * scaleFactor;
    graphCC.canvas.height = graphCC.canvas.scrollHeight * scaleFactor;
    renderGraph();
}

function renderGraph() {
    let datapoints;

    plotWidth = graphCC.canvas.width - axisSpaceX;
    plotHeight = graphCC.canvas.height - axisSpaceY;
    datapoints = getRelevantSubsetOfDataPointsForGraphing();
    timeMin = minimumDataPointValue(datapoints, 'time').time;
    timeMax = (plotWidth / spacingPerSecond) * 1000 + timeMin;
    millivoltsMin = minimumDataPointValue(datapoints, 'millivolts').millivolts;
    millivoltsMax = maximumDataPointValue(datapoints, 'millivolts').millivolts;

    renderScaleX(datapoints);
    renderPlot(datapoints, axisSpaceX);
    renderAxis(datapoints);
}

function getRelevantSubsetOfDataPointsForGraphing() {
    let timePeriod = (plotWidth / spacingPerSecond) * 1000,
        timeOfLatestDataPoint = gsrData[gsrData.length - 1].time,
        earliestTime = timeOfLatestDataPoint - timePeriod,

        relevantSubset = [];

    // ToDo: I don't presently understand why the undefined check is required, but without it bad things happen.
    for (let index = gsrData.length - 1; index >= 0 && gsrData[index] !== undefined && gsrData[index].time > earliestTime; index--) {
        relevantSubset.push(gsrData[index]);
    }

    relevantSubset.reverse();

    return relevantSubset;
}

function renderAxis(datapoints) {
    graphCC.beginPath();
    graphCC.moveTo(axisSpaceX, 0);
    graphCC.lineTo(axisSpaceX, graphCC.canvas.height - axisSpaceY);
    graphCC.lineTo(graphCC.canvas.width, graphCC.canvas.height - axisSpaceY);
    graphCC.strokeStyle = "#dddddd";
    graphCC.stroke();
}

function renderScaleX(datapoints) {
    const plotWidth = graphCC.canvas.width - axisSpaceX,
        intervalX = 1000,
        firstInterval = Math.ceil(timeMin / intervalX) * intervalX;
    
    for (let calculatedInterval = firstInterval; calculatedInterval < timeMax; calculatedInterval += intervalX) {
        let scaledTimeValue = scaleValue(calculatedInterval, timeMin, timeMax, plotWidth);

        graphCC.globalAlpha = 0.1;
        graphCC.beginPath();
        graphCC.moveTo(scaledTimeValue + axisSpaceX, 0);
        graphCC.lineTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();
        graphCC.globalAlpha = 1;

        graphCC.beginPath();
        graphCC.moveTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY);
        graphCC.lineTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY / 1.5);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();
    }
}

function renderPlot(datapoints, offsetX) {
    let origin = false;

    graphCC.beginPath();
    datapoints.forEach((datapoint, index) => {
        let dataPointYValue = scaleValue(datapoint.millivolts, millivoltsMin, millivoltsMax, plotHeight, true),
            dataPointXValue = scaleValue(datapoint.time, timeMin, timeMax, plotWidth);

        if (!origin) {
            origin = datapoint;
            graphCC.moveTo(offsetX, dataPointYValue);
        } else {
            graphCC.lineTo(dataPointXValue + offsetX, dataPointYValue);
        }
    });
    graphCC.strokeStyle = "#00ff00";
    graphCC.stroke();
}

function minimumDataPointValue(datapoints, property) {
    return datapoints.reduce((previousDP, currentDP) => {
        return previousDP[property] < currentDP[property] ? previousDP : currentDP;
    });
}

function maximumDataPointValue(datapoints, property) {
    return datapoints.reduce((previousDP, currentDP) => {
        return previousDP[property] > currentDP[property] ? previousDP : currentDP;
    });
}

function scaleValue(value, min, max, scale, flipscale = false) {
    let valueOffset = value - min,
        maxOffset = max - min,
        valueNeutralScaling = valueOffset / maxOffset;

    if (flipscale) {
        valueNeutralScaling = 1 - valueNeutralScaling;
    }

    return valueNeutralScaling * scale;
}
