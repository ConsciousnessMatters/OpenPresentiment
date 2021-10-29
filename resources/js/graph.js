const scaleFactor = window.devicePixelRatio || 1;

let internalState = {
    dataset: null,
    margins: {
        xMin: 100,
        yMin: 100,
        xMax: 0,
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

function drawPlot(plot, hexColour = "#00ff00", yMinMax = null) {
    const xPlMin = plot.reduce(lowest).x,
        xPlMax = plot.reduce(highest).x,
        yPlMin = yMinMax.yMin ?? plot.reduce(lowest).y,
        yPlMax = yMinMax.yMax ?? plot.reduce(highest).y;

    const xDaMin = internalState.margins.xMin,
        xDaMax = internalState.CC.canvas.width - internalState.margins.xMax,
        yDaMin = internalState.margins.yMin,
        yDaMax = internalState.CC.canvas.height - internalState.margins.yMin,
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
    internalState.CC.stroke();

    return this;
}

function lowest(previous, current) {
    let x = (previous.x < current.x) ? previous.x : current.x;
    let y = (previous.y < current.y) ? previous.y : current.y;

    // debugger;

    return {
        x: (previous.x < current.x) ? previous.x : current.x,
        y: (previous.y < current.y) ? previous.y : current.y,
    };
}

function highest(previous, current) {
    return {
        x: (previous.x > current.x) ? previous.x : current.x,
        y: (previous.y > current.y) ? previous.y : current.y,
    };
}

function drawAxis() {
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
    initiate,
};
