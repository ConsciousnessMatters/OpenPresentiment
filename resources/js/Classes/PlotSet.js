import {Plot} from './Plot';

export class PlotSet {
    plotData;
    preZeroTime = 7000;
    postZeroTime = 10000;

    constructor(plotsArray) {
        if (! plotsArray.every((plot) => plot instanceof Plot)) {
            throw new Error('PlotSet constructor array must only consist of Plot objects.');
        }
        this.plotData = plotsArray;
    }

    get data() {
        return this.plotData;
    }

    forEach(callback, thisArg) {
        return this.data.forEach(callback, thisArg);
    }

    reduce(callback, initialValue) {
        if (initialValue === undefined) {
            return this.data.reduce(callback);
        } else {
            return this.data.reduce(callback, initialValue);
        }
    }

    map(callback, thisArg) {
        return this.data.map(callback, thisArg);
    }


    filter(callback) {
        this.plotData = this.data = this.data.filter(callback);
        return this;
    }

    startXFromZero() {
        this.plotData = this.data.map((plot) => {
            return plot.startXFromZero();
        });

        return this;
    }

    averageTimingInterval() {
        // ToDo: Consider allowing different timing on different experiments via common denominators.

        const timingValues = this.data.map((plot) => {
            return plot.averageTimingInterval();
        });

        return timingValues.reduce((previousValue, currentValue) => previousValue + currentValue) / timingValues.length;
    }

    latestRelativeTime() {
        const latestRelativeTimes = this.data.map((plot) => {
            return plot.latestRelativeTime();
        });

        return latestRelativeTimes.reduce((previous, current) => {
            return previous > current ? previous : current;
        });
    }

    averagePlot() {
        const interval = 40,
            indexShift = 10000;

        let bucketsPlot = [],
            averagePlot;

        this.data.forEach((plot) => {
            let lowestX = this.preZeroTime * -1,
                highestX = this.postZeroTime;

            for (let t = lowestX; t <= highestX; t = t + interval) {
                let i = t + indexShift;

                if (bucketsPlot[i] === undefined) {
                    bucketsPlot[i] = [];
                }

                let virtualPlot = plot.virtualYfromX(t)

                if (isNaN(virtualPlot)) {
                    debugger;
                } else {
                    bucketsPlot[i].push(virtualPlot);
                }
            }
        });

        averagePlot = bucketsPlot.map((bucket, index) => {
            let bucketSum = bucket.reduce((p, c) => p + c);
            return {
                x: index - indexShift,
                y: bucketSum / bucket.length,
            }
        });

        return new Plot(averagePlot);
    }

    yMinMax() {
        const plotMinMaxes = this.data.map((plot) => plot.yMinMax())

        return PlotSet.yMinMax(plotMinMaxes);
    }

    static yMinMax(plotMinMaxes) {
        // ToDo: There were issues using rest parameters here e.g. yMinMax(...plotMinMaxes), could do with investigation.

        let min = null,
            max = null;

        plotMinMaxes.forEach((yMinMaxes) => {

            if (yMinMaxes && yMinMaxes.yMin < min || min === null) {
                min = yMinMaxes.yMin;
            }

            if (yMinMaxes && yMinMaxes.yMax > max || max === null) {
                max = yMinMaxes.yMax;
            }
        });

        return {
            yMin: min,
            yMax: max,
        }
    }

    setStartingYToZero() {
        this.plotData = this.data.map((plot) => {
            return plot.setStartingYToZero();
        });

        return this;
    }

    trimPlotTime() {
        this.plotData = this.data.map((plot) => {
            return plot.trimPlotTime();
        });

        return this;
    }
}
