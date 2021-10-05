'use strict';

let gsrData = [],
    scaleFactor = window.devicePixelRatio || 1,
    canvasActivated = false,
    axisSpaceX = 50,
    axisSpaceY = 50;

const datapointSpacing = 4,
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
    let origin = false,
        plotWidth = graphCC.canvas.width - axisSpaceX,
        datapointsToUse = Math.floor( plotWidth / datapointSpacing),
        datapoints = gsrData.slice(-1 * datapointsToUse);

    renderPlot(origin, datapoints, axisSpaceX);
    renderAxis();
}

function renderAxis() {
    graphCC.beginPath();
    graphCC.moveTo(axisSpaceX, 0);
    graphCC.lineTo(axisSpaceX, graphCC.canvas.height - axisSpaceY);
    graphCC.lineTo(graphCC.canvas.width, graphCC.canvas.height - axisSpaceY);
    graphCC.strokeStyle = "#dddddd";
    graphCC.stroke();
}

function renderPlot(origin, datapoints, offsetX) {
    let millivoltsMin = minimumDataPointValue(datapoints, 'millivolts').millivolts,
        millivoltsMax = maximumDataPointValue(datapoints, 'millivolts').millivolts,
        plotHeight = graphCC.canvas.height - axisSpaceY;

    graphCC.beginPath();
    datapoints.forEach((datapoint, index) => {
        let dataPointYValue = scaleValue(datapoint.millivolts, millivoltsMin, millivoltsMax, plotHeight);

        if (!origin) {
            origin = datapoint;
            graphCC.moveTo(offsetX, dataPointYValue);
        } else {
            graphCC.lineTo(index * datapointSpacing + offsetX, dataPointYValue);
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
