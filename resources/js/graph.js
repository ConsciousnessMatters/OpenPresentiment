const scaleFactor = window.devicePixelRatio || 1;

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

function drawPlot(plot, hexColour = "#00ff00", yMinMax = null, opacity = 1) {
    plot.trimPlotTime(7000, 10000);

    const xPlMin = -7000,
        xPlMax = 10000,
        yPlMin = yMinMax?.yMin ?? plot.lowestValues().y,
        yPlMax = yMinMax?.yMax ?? plot.highestValues().y;

    const xDaMin = internalState.margins.xMin * scaleFactor,
        xDaMax = internalState.CC.canvas.width - internalState.margins.xMax * scaleFactor,
        yDaMin = internalState.margins.yMin * scaleFactor,
        yDaMax = internalState.CC.canvas.height - internalState.margins.yMax * scaleFactor,
        daWidth = xDaMax - xDaMin,
        daHeight = yDaMax - yDaMin;

    let origin = false;

    internalState.CC.beginPath();

    plot.forEach((plotpoint) => {
        let floatingXValue = scaleValue(plotpoint.x, xPlMin, xPlMax, daWidth),
            floatingYValue = scaleValue(plotpoint.y, yPlMin, yPlMax, daHeight);

        let dataPointXValue = floatingXValue + (internalState.margins.xMin * scaleFactor),
            dataPointYValue = floatingYValue + (internalState.margins.yMin * scaleFactor);

        if (!origin) {
            origin = plotpoint;
            internalState.CC.moveTo(dataPointXValue, flipYValue(dataPointYValue));
        } else {
            internalState.CC.lineTo(dataPointXValue, flipYValue(dataPointYValue));
        }
    });

    internalState.CC.strokeStyle = hexColour;
    internalState.CC.lineWidth = 1 * scaleFactor;
    internalState.CC.globalAlpha = opacity;
    internalState.CC.stroke();
    internalState.CC.globalAlpha = 1;

    return this;
}

function drawAxis() {
    const xMin = internalState.margins.xMin * scaleFactor,
        yMin = internalState.margins.yMin * scaleFactor,
        xMax = internalState.margins.xMax * scaleFactor,
        yMax = internalState.margins.yMax * scaleFactor;

    internalState.CC.beginPath();
    internalState.CC.moveTo(xMin, yMax);
    internalState.CC.lineTo(xMin, internalState.CC.canvas.height - yMin);
    internalState.CC.lineTo(internalState.CC.canvas.width - xMax, internalState.CC.canvas.height - yMin);
    internalState.CC.strokeStyle = "#dddddd";
    internalState.CC.stroke();

    return this;
}

function drawLabels() {
    debugger;

    return this;
}

function drawGrid() {
    return this;
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
    initiate,
};
