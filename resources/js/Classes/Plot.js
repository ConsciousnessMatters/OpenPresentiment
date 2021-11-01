export class Plot {
    #data;

    constructor(plotData) {
        this.#data = plotData ?? [];
    }

    data() {
        return this.#data;
    }

    length() {
        return this.#data.length;
    }

    forEach(callback, thisArg) {
        return this.#data.forEach(callback, thisArg);
    }

    reduce(callback, initialValue) {
        if (initialValue === undefined) {
            return this.#data.reduce(callback);
        } else {
            return this.#data.reduce(callback, initialValue);
        }
    }

    map(callback, thisArg) {
        return this.#data.map(callback, thisArg);
    }

    lowestValues() {
        return this.#data.reduce((previous, current) => {
            return {
                x: (previous.x < current.x) ? previous.x : current.x,
                y: (previous.y < current.y) ? previous.y : current.y,
            };
        });
    }

    highestValues() {
        return this.#data.reduce((previous, current) => {
            return {
                x: (previous.x > current.x) ? previous.x : current.x,
                y: (previous.y > current.y) ? previous.y : current.y,
            };
        });
    }

    addPoint(index, plotpoint) {
        this.#data[index] = plotpoint;
        return this;
    }

    startXFromZero() {
        let startTime = this.#data[0].x ?? 0;

        this.#data = this.#data.map((datapoint) => {
            return {
                x: datapoint.x - startTime,
                y: datapoint.y,
            };
        });

        return this;
    }

    filterDuplicateData() {
        let uKeys = [];

        this.#data = this.#data.filter((datapoint) => {
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
        this.#data = this.#data.slice(0, maxLength);

        return this;
    }

    trimPlotToTime(seconds) {
        const milliseconds = seconds * 1000;

        let trimmedPlot = [],
            startTime = null;

        this.#data.forEach((plot) => {
            if (startTime === null) {
                startTime = plot.x;
            }

            if (plot.x <= startTime + milliseconds) {
                trimmedPlot.push(plot);
            }
        });

        this.#data = trimmedPlot;

        return this;
    }

    averageTimingInterval() {
        let intervals = [],
            previousTime = null;

        this.#data.forEach((plot) => {
            const currentTime = plot.x;

            if (previousTime !== null) {
                intervals.push(plot.x - previousTime);
            }

            previousTime = currentTime;
        });

        return intervals.reduce((previousValue, currentValue) => previousValue + currentValue) / intervals.length;
    }

    latestRelativeTime() {
        let startTime = this.#data[0].x ?? 0,
            zeroStartPlot;

        zeroStartPlot = this.#data.map((datapoint) => {
            return datapoint.x - startTime;
        });

        return zeroStartPlot.pop();
    }
}
