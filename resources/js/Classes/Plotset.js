/*
 * A lazy loading Plotset data class.
 */

import {ExperimentalDataset} from './ExperimentalDataset';
import {Plot} from './Plot';

export class Plotset {
    plotData;
    preZeroTime = 7000;
    postZeroTime = 10000;

    constructor(datasource) {
        this.datasource = datasource ?? null;
        this.filters = [];
        this.plotData = false;
    }

    data() {
        if (! this.plotData) {
            this.actualiseData();
        }
        return this.plotData;
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


    filter(callback) {
        this.filters.push(callback);
        return this;
    }

    actualiseData() {
        const sourceData = this.datasource.data(),
            filteredData = this.actualiseFilter(sourceData),
            flattenedData = this.flattenData(filteredData);

        this.plotData = flattenedData;
    }

    actualiseFilter(sourceData) {
        if (this.filters.length > 0) {
            return sourceData.filter((dataItems) => {
                return this.filters.every((filter) => {
                    return filter(dataItems);
                });
            });
        } else {
            return sourceData;
        }
    }

    flattenData(dataItems) {
        return dataItems.map((dataItem) => {
            return dataItem.plot();
        });
    }

    averagePlot() {
        if (this.datasource instanceof ExperimentalDataset) {
            return this.averagePlotFromExperimentalDataset();
        } else {
            console.error('Unfamiliar datasource provided.');
        }

        return this;
    }

    startXFromZero() {
        this.plotData = this.data().map((plot) => {
            return plot.startXFromZero();
        });

        return this;
    }

    filterDuplicateData() {
        this.plotData = this.data().map((plot) => {
            return plot.filterDuplicateData();
        });

        return this;
    }

    averageTimingInterval() {
        // ToDo: Consider allowing different timing on different experiments via common denominators.

        const timingValues = this.data().map((plot) => {
            return plot.averageTimingInterval();
        });

        return timingValues.reduce((previousValue, currentValue) => previousValue + currentValue) / timingValues.length;
    }

    latestRelativeTime() {
        const latestRelativeTimes = this.data().map((plot) => {
            return plot.latestRelativeTime();
        });

        return latestRelativeTimes.reduce((previous, current) => {
            return previous > current ? previous : current;
        });
    }

    averagePlotFromExperimentalDataset() {
        const interval = 40,
            indexShift = 10000;

        let bucketsPlot = [],
            averagePlot;

        this.filterDuplicateData();

        this.data().forEach((plot) => {
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
        let min = null,
            max = null;

        this.data().forEach((plot) => {
            const yMinMaxes = plot.yMinMax();

            if (yMinMaxes.yMin < min || min === null) {
                min = yMinMaxes.yMin;
            }

            if (yMinMaxes.yMax > max || max === null) {
                max = yMinMaxes.yMax;
            }
        });

        return {
            yMin: min,
            yMax: max,
        }
    }

    setStartingYToZero() {
        this.plotData = this.data().map((plot) => {
            return plot.setStartingYToZero();
        });

        return this;
    }

    trimPlotTime() {
        this.plotData = this.data().map((plot) => {
            return plot.trimPlotTime();
        });

        return this;
    }
}
