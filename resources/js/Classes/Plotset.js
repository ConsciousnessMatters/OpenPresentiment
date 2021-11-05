/*
 * A lazy loading Plotset data class.
 */

import {ExperimentalDataset} from './ExperimentalDataset';
import {Plot} from './Plot';

export class Plotset {
    plotData;

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
        const interval = 40;

        let latestRelativeTime,
            bucketsPlot = [],
            averagePlot;

        this.filterDuplicateData();
        // this.trimPlotsToTime(20); // ToDo: This needs to be moved later.
        latestRelativeTime = this.latestRelativeTime();

        this.data().forEach((plot) => {
            // ToDo: Pay attention here and resolve issues.
            console.debug(plot.data()[0]);

            let highestX = plot.highestValues().x;

            for (let t = 0; t <= latestRelativeTime && t <= highestX; t = t + interval) {
                if (bucketsPlot[t] === undefined) {
                    bucketsPlot[t] = [];
                }

                let virtualPlot = plot.virtualYfromX(t)

                if (isNaN(virtualPlot)) {
                    debugger;
                } else {
                    bucketsPlot[t].push(virtualPlot);
                }
            }
        });

        averagePlot = bucketsPlot.map((bucket, index) => {
            let bucketSum = bucket.reduce((p, c) => p + c);
            return {
                x: index,
                y: bucketSum / bucket.length,
            }
        });

        console.debug(averagePlot);

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
}
