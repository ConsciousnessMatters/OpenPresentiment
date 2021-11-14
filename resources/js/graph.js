const scaleFactor = window.devicePixelRatio || 1,
    preZeroTime = 7000,
    postZeroTime = 10000;

let internalState = {
    dataset: null,
    margins: {
        xMin: 100,
        yMin: 100,
        xMax: 50,
        yMax: 100,
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

function clearCanvas() {
    internalState.CC.clearRect(0, 0, internalState.CC.canvas.width, internalState.CC.canvas.height);
}

function plotToDrawAreaConverter(plot = null, yMinMax = null) {
    const daXMin = internalState.margins.xMin * scaleFactor,
        daXMax = internalState.CC.canvas.width - internalState.margins.xMax * scaleFactor,
        daYMin = internalState.margins.yMin * scaleFactor,
        daYMax = internalState.CC.canvas.height - internalState.margins.yMax * scaleFactor,
        plXMin = (-1 * preZeroTime),
        plXMax = (postZeroTime),
        plYMin = yMinMax?.yMin ?? plot.lowestValues().y,
        plYMax = yMinMax?.yMax ?? plot.highestValues().y;

    return {
        plot: {
            xMin: plXMin,
            xMax: plXMax,
            yMin: plYMin,
            yMax: plYMax,
            width: plXMax - plXMin,
            height: plYMax - plYMin,
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
    // ToDo: finish this function and clean up.

    const plotToDraw = plotToDrawAreaConverter(null, yMinMax);

    let fontsize = 16 * scaleFactor,
        fontXOffset = 0 * scaleFactor,
        fontYOffset = -20 * scaleFactor;

    internalState.CC.font = fontsize + 'px Open Sans';
    internalState.CC.fillStyle = "#dddddd";
    internalState.CC.textAlign = "center";
    internalState.CC.fillText(
        'Experiment Time (seconds)',
        (internalState.CC.canvas.width / 2) + fontXOffset,
        flipYValue((plotToDraw.draw.yMin / 2) + fontYOffset)
    );

    fontsize = 14 * scaleFactor;
    fontXOffset = 50 * scaleFactor;
    fontYOffset = 385 * scaleFactor;

    internalState.CC.rotate(Math.PI / -2);
    internalState.CC.font = fontsize + 'px Open Sans';
    internalState.CC.fillText(
        'Skin Conductance (mv conductance change)',
        (internalState.CC.canvas.width / 2),
        flipYValue(internalState.CC.canvas.height / 2)
    );
    internalState.CC.rotate(Math.PI / 2);
    // internalState.CC.translate(internalState.CC.canvas.width / 2, internalState.CC.canvas.height / 2);
    // internalState.CC.translate(- (internalState.CC.canvas.width / 2) - fontXOffset, - (internalState.CC.canvas.height / 2) - fontYOffset);
    //
    //
    //
    //
    // internalState.CC.translate(- (internalState.CC.canvas.width / 2) + fontXOffset, - (internalState.CC.canvas.height / 2));

    return this;
}

function drawGrid(yMinMax) {
    renderScaleX(yMinMax);
    renderScaleY(yMinMax);

    return this;
}

function renderScaleX(yMinMax) {
    const plotToDraw = plotToDrawAreaConverter(null, yMinMax);

    const intervalX = 1000,
        timeMin = preZeroTime * -1,
        timeMax = postZeroTime;

    for (let calculatedInterval = timeMin; calculatedInterval <= timeMax; calculatedInterval += intervalX) {
        let scaledTimeValue = scaleValue(calculatedInterval, timeMin, timeMax, plotToDraw.draw.width),
            fontsize = 14 * scaleFactor,
            fontXOffset = 0 * scaleFactor,
            fontYOffset = -20 * scaleFactor;

        if (calculatedInterval === 0) {
            internalState.CC.globalAlpha = 0.4;
        } else {
            internalState.CC.globalAlpha = 0.1;
        }

        internalState.CC.beginPath();
        internalState.CC.moveTo(plotToDraw.draw.xMin + scaledTimeValue, flipYValue(plotToDraw.draw.yMin));
        internalState.CC.lineTo(plotToDraw.draw.xMin + scaledTimeValue, flipYValue(plotToDraw.draw.yMax));
        internalState.CC.strokeStyle = "#dddddd";
        internalState.CC.stroke();
        internalState.CC.globalAlpha = 1;

        internalState.CC.beginPath();
        internalState.CC.moveTo(plotToDraw.draw.xMin + scaledTimeValue, flipYValue(plotToDraw.draw.yMin));
        internalState.CC.lineTo(plotToDraw.draw.xMin + scaledTimeValue, flipYValue(plotToDraw.draw.yMin / 1.2));
        internalState.CC.strokeStyle = "#dddddd";
        internalState.CC.stroke();

        internalState.CC.font = fontsize + 'px Open Sans';
        internalState.CC.fillStyle = "#dddddd";
        internalState.CC.textAlign = "center";
        internalState.CC.fillText(parseInt(calculatedInterval / 1000),
            plotToDraw.draw.xMin + scaledTimeValue + fontXOffset,
            flipYValue((plotToDraw.draw.yMin / 1.2) + fontYOffset)
        );
    }
}

function renderScaleY(yMinMax) {
    const plotToDraw = plotToDrawAreaConverter(null, yMinMax),
        scales = [100, 50, 10, 5, 1, 0.5, 0.1, 0.05, 0.01, 0.005, 0.001, 0.0005, 0.0001],
        requiredDivisions = 4,
        intervalY = scales.find((scale) => {
            return scale * requiredDivisions <= plotToDraw.plot.height;
        });

    let firstInterval;

    if (typeof intervalY === 'undefined') {
        return;
    }

    firstInterval = Math.ceil(plotToDraw.plot.yMin / intervalY) * intervalY;

    for (let calculatedInterval = firstInterval; calculatedInterval < plotToDraw.plot.height; calculatedInterval += intervalY) {

        let scaledMillivoltsValue = scaleValue(calculatedInterval, plotToDraw.plot.yMin, plotToDraw.plot.yMax, plotToDraw.draw.height),
            fontsize = 14 * scaleFactor,
            fontXOffset = -8 * scaleFactor,
            fontYOffset = -4 * scaleFactor;

        if (calculatedInterval === 0) {
            internalState.CC.globalAlpha = 0.4;
        } else {
            internalState.CC.globalAlpha = 0.1;
        }

        let y = plotToDraw.draw.yMin + scaledMillivoltsValue,
            yMax = plotToDraw.draw.yMax;

        if (y <= yMax) {
            internalState.CC.beginPath();
            internalState.CC.moveTo(plotToDraw.draw.xMin, flipYValue(plotToDraw.draw.yMin + scaledMillivoltsValue));
            internalState.CC.lineTo(plotToDraw.draw.xMax, flipYValue(plotToDraw.draw.yMin + scaledMillivoltsValue));
            internalState.CC.strokeStyle = "#dddddd";
            internalState.CC.stroke();
            internalState.CC.globalAlpha = 1;

            internalState.CC.beginPath();
            internalState.CC.moveTo(plotToDraw.draw.xMin, flipYValue(plotToDraw.draw.yMin + scaledMillivoltsValue));
            internalState.CC.lineTo(plotToDraw.draw.xMin / 1.2, flipYValue(plotToDraw.draw.yMin + scaledMillivoltsValue));
            internalState.CC.strokeStyle = "#dddddd";
            internalState.CC.stroke();

            internalState.CC.font = fontsize + 'px Open Sans';
            internalState.CC.fillStyle = "#dddddd";
            internalState.CC.textAlign = "right";
            internalState.CC.fillText(
                formatNumberForYAxis(calculatedInterval, intervalY),
                (plotToDraw.draw.xMin / 1.2) + fontXOffset,
                flipYValue(plotToDraw.draw.yMin + scaledMillivoltsValue + fontYOffset)
            );
        }
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
    clearCanvas,
};
