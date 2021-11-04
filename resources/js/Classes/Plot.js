export class Plot {
    plotData;
    eventData;

    constructor(plotData, eventData) {
        this.plotData = plotData ?? [];
        this.eventData = eventData ?? [];
    }

    data() {
        return this.plotData;
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
            aboveX = null;

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
            let xscale = aboveX.x - belowX.x,
                xfloor = belowX.x,
                xVirtualPosition = x - xfloor,
                scaleProportion = xVirtualPosition / xscale,
                yScale = aboveX.y - belowX.y,
                yfloor = belowX.y,
                yVirtualPosition = yScale * scaleProportion,
                y = yfloor + yVirtualPosition;

            return y;
        }
    }

    lowestValues() {
        return this.plotData.reduce((previous, current) => {
            return {
                x: (previous.x < current.x) ? previous.x : current.x,
                y: (previous.y < current.y) ? previous.y : current.y,
            };
        });
    }

    highestValues() {
        return this.plotData.reduce((previous, current) => {
            return {
                x: (previous.x > current.x) ? previous.x : current.x,
                y: (previous.y > current.y) ? previous.y : current.y,
            };
        });
    }

    addPoint(index, plotpoint) {
        this.plotData[index] = plotpoint;
        return this;
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

    filterDuplicateData() {
        let uKeys = [];

        this.plotData = this.plotData.filter((datapoint) => {
            const uKey = `x_${datapoint.x} y_${datapoint.y}`,
                uKeyNew = ! uKeys.includes(uKey);

            if (uKeyNew) {
                uKeys.push(uKey);
            }

            return uKeyNew;
        });

        return this;
    }

    trimPlotQuantity(maxLength) {
        this.plotData = this.plotData.slice(0, maxLength);

        return this;
    }

    trimPlotToTime(seconds) {
        const milliseconds = seconds * 1000;

        let trimmedPlot = [],
            startTime = null;

        this.plotData.forEach((plot) => {
            if (startTime === null) {
                startTime = plot.x;
            }

            if (plot.x <= startTime + milliseconds) {
                trimmedPlot.push(plot);
            }
        });

        this.plotData = trimmedPlot;

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
}
