const scaleFactor = window.devicePixelRatio || 1,
    preZeroTime = 7000,
    postZeroTime = 10000;

let internalState = {
    dataset: null,
    margins: {
        xMin: 100,
        yMin: 100,
        xMax: 50,
        yMax: 0,
    },
    axis: {
    },
    grid: {
        minimumSpacing: 5,
        availableScales: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5, 10, 50, 100, 500],
    },
    CC: null,
};

function initiate(selector) {
    internalState.CC = document.querySelector(selector).getContext('2d');

    window.addEventListener('resize', () => {
        canvasSetup();
    });
    canvasSetup();
    return this;
}

function canvasSetup() {
    internalState.CC.canvas.width = internalState.CC.canvas.scrollWidth * scaleFactor;
    internalState.CC.canvas.height = internalState.CC.canvas.scrollHeight * scaleFactor;
}

function plotToDrawAreaConverter(plot = null, yMinMax = null) {
    const daXMin = internalState.margins.xMin * scaleFactor,
        daXMax = internalState.CC.canvas.width - internalState.margins.xMax * scaleFactor,
        daYMin = internalState.margins.yMin * scaleFactor,
        daYMax = internalState.CC.canvas.height - internalState.margins.yMax * scaleFactor;

    return {
        plot: {
            xMin: (-1 * preZeroTime),
            xMax: (postZeroTime),
            yMin: yMinMax?.yMin ?? plot.lowestValues().y,
            yMax: yMinMax?.yMax ?? plot.highestValues().y,
        },
        draw: {
            xMin: daXMin,
            xMax: daXMax,
            yMin: daYMin,
            yMax: daYMax,
            width: daXMax - daXMin,
            height: daYMax - daYMin,
        }
    }
}

function drawPlot(plot, yMinMax = null, opacity = 1) {
    plot.trimPlotTime(preZeroTime, postZeroTime);

    const plotToDraw = plotToDrawAreaConverter(plot, yMinMax);

    let origin = false;

    internalState.CC.beginPath();

    plot.forEach((plotpoint) => {
        let floatingXValue = scaleValue(plotpoint.x, plotToDraw.plot.xMin, plotToDraw.plot.xMax, plotToDraw.draw.width),
            floatingYValue = scaleValue(plotpoint.y, plotToDraw.plot.yMin, plotToDraw.plot.yMax, plotToDraw.draw.height);

        let dataPointXValue = floatingXValue + (internalState.margins.xMin * scaleFactor),
            dataPointYValue = floatingYValue + (internalState.margins.yMin * scaleFactor);

        if (!origin) {
            origin = plotpoint;
            internalState.CC.moveTo(dataPointXValue, flipYValue(dataPointYValue));
        } else {
            internalState.CC.lineTo(dataPointXValue, flipYValue(dataPointYValue));
        }
    });

    internalState.CC.strokeStyle = plot.colour();
    internalState.CC.lineWidth = 1 * scaleFactor;
    internalState.CC.globalAlpha = opacity;
    internalState.CC.stroke();
    internalState.CC.globalAlpha = 1;

    return this;
}

function drawAxis(yMinMax) {
    const plotToDraw = plotToDrawAreaConverter(null, yMinMax);

    internalState.CC.beginPath();
    internalState.CC.moveTo(plotToDraw.draw.xMin, flipYValue(plotToDraw.draw.yMax));
    internalState.CC.lineTo(plotToDraw.draw.xMin, flipYValue(plotToDraw.draw.yMin));
    internalState.CC.lineTo(plotToDraw.draw.xMax, flipYValue(plotToDraw.draw.yMin));
    internalState.CC.strokeStyle = "#dddddd";
    internalState.CC.stroke();

    return this;
}

function drawLabels(yMinMax) {
    return this;
}

function drawGrid(yMinMax) {
    // renderScaleX(yMinMax);

    return this;
}

function renderScaleX(yMinMax) {
    const intervalX = 1000,
        timeMin = preZeroTime * -1,
        timeMax = postZeroTime,
        plotWidth = preZeroTime + postZeroTime,
        firstInterval = Math.ceil(timeMin / intervalX) * intervalX
        xDaMin = internalState.margins.xMin * scaleFactor;

    for (let calculatedInterval = firstInterval; calculatedInterval < timeMax; calculatedInterval += intervalX) {
        let scaledTimeValue = scaleValue(calculatedInterval, timeMin, timeMax, plotWidth),
            fontsize = 14 * scaleFactor,
            fontXOffset = 0 * scaleFactor,
            fontYOffset = 20 * scaleFactor;

        internalState.CC.globalAlpha = 0.1;
        internalState.CC.beginPath();
        internalState.CC.moveTo(scaledTimeValue + axisSpaceX, 0);
        internalState.CC.lineTo(scaledTimeValue + axisSpaceX, internalState.CC.canvas.height - axisSpaceY);
        internalState.CC.strokeStyle = "#dddddd";
        internalState.CC.stroke();
        internalState.CC.globalAlpha = 1;

        internalState.CC.beginPath();
        internalState.CC.moveTo(scaledTimeValue + axisSpaceX, internalState.CC.canvas.height - axisSpaceY);
        internalState.CC.lineTo(scaledTimeValue + axisSpaceX, internalState.CC.canvas.height - axisSpaceY / 1.2);
        internalState.CC.strokeStyle = "#dddddd";
        internalState.CC.stroke();

        internalState.CC.font = fontsize + 'px Open Sans';
        internalState.CC.fillStyle = "#dddddd";
        internalState.CC.textAlign = "center";
        internalState.CC.fillText(parseInt(calculatedInterval / 1000), scaledTimeValue + axisSpaceX + fontXOffset, (internalState.CC.canvas.height - axisSpaceY / 1.2) + fontYOffset);
    }
}


function scaleValue(value, min, max, scale) {
    let valueOffset = value - min,
        maxOffset = max - min,
        valueNeutralScaling = valueOffset / maxOffset;

    return valueNeutralScaling * scale;
}

function flipYValue(yValue) {
    return internalState.CC.canvas.height - yValue;
}

export const graph = {
    drawPlot,
    drawAxis,
    drawLabels,
    drawGrid,
    initiate,
};
