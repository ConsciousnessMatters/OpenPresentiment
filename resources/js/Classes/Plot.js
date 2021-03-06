export class Plot {
    plotData;
    eventData;
    lineColour;

    constructor(plotData, eventData) {
        this.plotData = plotData ?? [];
        this.eventData = eventData ?? [];
        this.lineColour = '#00FF00';
    }

    get data() {
        return this.plotData;
    }

    get hasData() {
        return this.plotData.length > 0;
    }

    index(index, setValue = null) {
        if (setValue === null) {
            return this.plotData[index];
        } else {
            this.plotData[index] = setValue;
        }
    }

    length() {
        return this.plotData.length;
    }

    forEach(callback, thisArg) {
        return this.plotData.forEach(callback, thisArg);
    }

    reduce(callback, initialValue) {
        if (initialValue === undefined) {
            return this.plotData.reduce(callback);
        } else {
            return this.plotData.reduce(callback, initialValue);
        }
    }

    map(callback, thisArg) {
        return this.plotData.map(callback, thisArg);
    }

    virtualYfromX(x) {
        let belowX = null,
            aboveX = null,
            xScale, xFloor, xVirtualPosition, scaleProportion, yScale, yFloor, yVirtualPosition, y;

        this.plotData.forEach((datapoint) => {
            if (belowX === null) {
                belowX = datapoint;
            } else {
                let beforeXtest = (datapoint.x > belowX.x && datapoint.x < x);

                if (beforeXtest) {
                    belowX = datapoint;
                } else if (beforeXtest || aboveX === null) {
                    aboveX = datapoint;
                }
            }
        });

        if (aboveX !== null && belowX !== null) {
            xScale = aboveX.x - belowX.x;

            xFloor = belowX.x;
            xVirtualPosition = x - xFloor;
            scaleProportion = (xScale === 0) ? 0 : xVirtualPosition / xScale;
            yScale = aboveX.y - belowX.y;
            yFloor = belowX.y;
            yVirtualPosition = yScale * scaleProportion;
            y = yFloor + yVirtualPosition;

            if (y === Infinity) {
                debugger;
            }

            return y;
        }
    }

    lowestValues() {
        let lowestValues = this.plotData.reduce((previous, current) => {
            return {
                x: (previous.x < current.x) ? previous.x : current.x,
                y: (previous.y < current.y) ? previous.y : current.y,
            };
        });

        if (lowestValues.x !== Infinity || lowestValues.y !== Infinity) {
            return lowestValues;
        } else {
            debugger;
        }
    }

    highestValues() {
        let highestValues = this.plotData.reduce((previous, current) => {
            return {
                x: (previous.x > current.x) ? previous.x : current.x,
                y: (previous.y > current.y) ? previous.y : current.y,
            };
        });

        if (highestValues.x !== Infinity, highestValues.y !== Infinity) {
            return highestValues;
        } else {
            debugger;
        }
    }

    startXFromZero() {
        let startTime = this.plotData[0].x ?? 0;

        this.plotData = this.plotData.map((datapoint) => {
            return {
                x: datapoint.x - startTime,
                y: datapoint.y,
            };
        });

        return this;
    }

    trimPlotTime(preZero = 7000, postZero = 10000) {
        this.plotData = this.plotData.filter((datapoint) => {
            return datapoint.x > -1 * preZero && datapoint.x < postZero;
        });

        return this;
    }

    averageTimingInterval() {
        let intervals = [],
            previousTime = null;

        this.plotData.forEach((plot) => {
            const currentTime = plot.x;

            if (previousTime !== null) {
                intervals.push(plot.x - previousTime);
            }

            previousTime = currentTime;
        });

        return intervals.reduce((previousValue, currentValue) => previousValue + currentValue) / intervals.length;
    }

    latestRelativeTime() {
        let startTime = this.plotData[0].x ?? 0,
            zeroStartPlot;

        zeroStartPlot = this.plotData.map((datapoint) => {
            return datapoint.x - startTime;
        });

        return zeroStartPlot.pop();
    }

    yMinMax() {
        if (this.plotData.length === 0) {
            return false;
        }

        const minMax = helpers.twoDimensionalMinMx(this.plotData, 'x', 'y');

        return {
            yMin: minMax.min.y,
            yMax: minMax.max.y,
        }
    }

    setStartingYToZero() {
        let startY = this.plotData[0] !== undefined ? this.plotData[0].y : 0;

        this.plotData = this.plotData.map((datapoint) => {
            return {
                x: datapoint.x,
                y: datapoint.y - startY,
            };
        });

        return this;
    }

    colour(value = null) {
        if (value === null) {
            return this.lineColour;
        } else {
            this.lineColour = value;
        }
    }
}
