'use strict';

let gsrData = [],
    scaleFactor = window.devicePixelRatio || 1,
    canvasActivated = false,
    axisSpaceX = 100 * scaleFactor,
    axisSpaceY = 50 * scaleFactor,
    plotWidth,
    plotHeight,
    timeMin,
    timeMax,
    millivoltsMin,
    millivoltsMax;

const spacingPerSecond = 50 * scaleFactor,
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

    if (datapoints.length === 0) {
        console.debug('No Datapoints');
        return false;
    }

    timeMin = minimumDataPointValue(datapoints, 'time').time;
    timeMax = (plotWidth / spacingPerSecond) * 1000 + timeMin;
    millivoltsMin = minimumDataPointValue(datapoints, 'millivolts').millivolts;
    millivoltsMax = maximumDataPointValue(datapoints, 'millivolts').millivolts;

    renderScaleX();
    renderScaleY();
    renderPlot(datapoints, axisSpaceX);
    renderAxis();
}

function getRelevantSubsetOfDataPointsForGraphing() {
    let timePeriod = (plotWidth / spacingPerSecond) * 1000,
        gsrDataLength = gsrData.length,
        gsrLastIndex = gsrDataLength - 1,
        latestDataPoint = gsrData[gsrLastIndex],
        timeOfLatestDataPoint = latestDataPoint.time,
        earliestTime = timeOfLatestDataPoint - timePeriod,
        relevantSubset = [];

    // ToDo: I don't presently understand why the undefined check is required, but without it bad things happened.
    for (let index = gsrData.length - 1; index >= 0 && gsrData[index] !== undefined && gsrData[index].time > earliestTime; index--) {
        relevantSubset.push(gsrData[index]);
    }

    relevantSubset.reverse();

    return relevantSubset;
}

function renderAxis() {
    graphCC.beginPath();
    graphCC.moveTo(axisSpaceX, 0);
    graphCC.lineTo(axisSpaceX, graphCC.canvas.height - axisSpaceY);
    graphCC.lineTo(graphCC.canvas.width, graphCC.canvas.height - axisSpaceY);
    graphCC.strokeStyle = "#dddddd";
    graphCC.stroke();
}

function renderScaleX() {
    const intervalX = 1000,
        firstInterval = Math.ceil(timeMin / intervalX) * intervalX;
    
    for (let calculatedInterval = firstInterval; calculatedInterval < timeMax; calculatedInterval += intervalX) {
        let scaledTimeValue = scaleValue(calculatedInterval, timeMin, timeMax, plotWidth),
            fontsize = 14 * scaleFactor,
            fontXOffset = 0 * scaleFactor,
            fontYOffset = 20 * scaleFactor;

        graphCC.globalAlpha = 0.1;
        graphCC.beginPath();
        graphCC.moveTo(scaledTimeValue + axisSpaceX, 0);
        graphCC.lineTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();
        graphCC.globalAlpha = 1;

        graphCC.beginPath();
        graphCC.moveTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY);
        graphCC.lineTo(scaledTimeValue + axisSpaceX, graphCC.canvas.height - axisSpaceY / 1.2);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();

        graphCC.font = fontsize + 'px Open Sans';
        graphCC.fillStyle = "#dddddd";
        graphCC.textAlign = "center";
        graphCC.fillText(parseInt(calculatedInterval / 1000), scaledTimeValue + axisSpaceX + fontXOffset, (graphCC.canvas.height - axisSpaceY / 1.2) + fontYOffset);
    }
}

function renderScaleY() {
    const scales = [100, 50, 10, 5, 1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001],
        requiredDivisions = 4,
        millivoltRange = millivoltsMax - millivoltsMin,
        intervalY = scales.find((scale) => {
            return scale * requiredDivisions <= millivoltRange;
        });

    let firstInterval;

    if (typeof intervalY === 'undefined') {
        return;
    }

    firstInterval = Math.ceil(millivoltsMin / intervalY) * intervalY;

    for (let calculatedInterval = firstInterval; calculatedInterval < millivoltsMax; calculatedInterval += intervalY) {

        let scaledMillivoltsValue = scaleValue(calculatedInterval, millivoltsMin, millivoltsMax, plotHeight, true),
            fontsize = 14 * scaleFactor,
            fontXOffset = -8 * scaleFactor,
            fontYOffset = 5 * scaleFactor;

        graphCC.globalAlpha = 0.1;
        graphCC.beginPath();
        graphCC.moveTo(graphCC.canvas.width, scaledMillivoltsValue);
        graphCC.lineTo(axisSpaceX, scaledMillivoltsValue);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();
        graphCC.globalAlpha = 1;

        graphCC.beginPath();
        graphCC.moveTo(axisSpaceX, scaledMillivoltsValue);
        graphCC.lineTo(axisSpaceX / 1.2, scaledMillivoltsValue);
        graphCC.strokeStyle = "#dddddd";
        graphCC.stroke();

        graphCC.font = fontsize + 'px Open Sans';
        graphCC.fillStyle = "#dddddd";
        graphCC.textAlign = "right";
        graphCC.fillText(formatNumberForYAxis(calculatedInterval, intervalY), (axisSpaceX / 1.2) + fontXOffset, scaledMillivoltsValue + fontYOffset);
    }
}

function formatNumberForYAxis(number, intervalY) {
    if (intervalY >= 1) {
        return parseInt(number);
    } else if (number == 0) {
        return 0;
    } else {
        return number.toFixed(2);
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

function calculateSuperAverage() {
    let totalValue = gsrData.reduce((previousDP, currentDP) => {
        return previousDP + currentDP.millivolts;
    }, 0);

    return totalValue / gsrData.length;
}