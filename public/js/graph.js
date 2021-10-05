'use strict';

let gsrData = [],
    scaleFactor = window.devicePixelRatio || 1,
    canvasActivated = false;

const datapointSpacing = 4,
    graphCC = document.getElementById('graph').getContext('2d');

document.addEventListener('GSRDataPoint', (event) => {
    gsrData.push(event.detail);
    if (!canvasActivated) {
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
    let origin = false,
        datapoints,
        millivoltsMin,
        millivoltsMax,
        datapointsToUse = Math.floor(graphCC.canvas.width / datapointSpacing);

    datapoints = gsrData.slice(-1 * datapointsToUse);
    millivoltsMin = minimumDataPointValue(datapoints, 'millivolts').millivolts;
    millivoltsMax = maximumDataPointValue(datapoints, 'millivolts').millivolts;

    graphCC.beginPath();
    datapoints.forEach((datapoint, index) => {
        let dataPointYValue = scaleValue(datapoint.millivolts, millivoltsMin, millivoltsMax, graphCC.canvas.height);

        if (!origin) {
            origin = datapoint;
            graphCC.moveTo(0, dataPointYValue);
        } else {
            graphCC.lineTo(index * datapointSpacing, dataPointYValue);
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

function scaleValue(value, min, max, scale) {
    let valueOffset = value - min,
        maxOffset = max - min,
        valueNeutralScaling = valueOffset / maxOffset,
        valueNeutralScalingYFlipped = 1 - valueNeutralScaling;

    return valueNeutralScalingYFlipped * scale;
}
