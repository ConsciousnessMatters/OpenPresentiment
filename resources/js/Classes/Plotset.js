/*
 * A lazy loading Plotset data class.
 */

export class Plotset {
    #data;

    constructor(datasource) {
        this.datasource = datasource ?? null;
        this.filters = [];
        this.#data = false;
    }

    data() {
        if (! this.#data) {
            this.#actualiseData();
        }
        return this.#data;
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


    filter(callback) {
        this.filters.push(callback);
        return this;
    }

    #actualiseData() {
        const sourceData = this.datasource.data(),
            filteredData = this.#actualiseFilter(sourceData),
            flattenedData = this.#flattenData(filteredData);

        this.#data = flattenedData;
    }

    #actualiseFilter(sourceData) {
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

    #flattenData(dataItems) {
        return dataItems.map((dataItem) => {
            return dataItem.plot();
        });
    }

    averagePlot() {
        if (this.datasource instanceof ExperimentalDataset) {
            return this.#averagePlotFromExperimentalDataset();
        } else {
            console.error('Unfamiliar datasource provided.');
        }

        return this;
    }

    startXFromZero() {
        this.#data = this.data().map((plot) => {
            return plot.startXFromZero();
        });

        return this;
    }

    filterDuplicateData() {
        this.#data = this.data().map((plot) => {
            return plot.filterDuplicateData();
        });

        return this;
    }

    trimPlotsToTime(seconds) {
        this.data().forEach((plot) => {
            plot.trimPlotToTime(seconds);
        });
    }

    trimPlotsetPlotQuantityToLowestCommonDenominator() {
        let lowestValue = null;

        this.data().forEach((plot) => {
            const plotLength = plot.length();

            if (plotLength < lowestValue || lowestValue === null) {
                lowestValue = plotLength;
            }
        });

        this.data().forEach((plot) => {
            plot.trimPlotQuantity(lowestValue);
        });

        return this;
    }

    averageTimingInterval() {
        // ToDo: Consider allowing different timing on different experiments via common denominators.

        const timingValues = this.data().map((plot) => {
            console.debug(plot.averageTimingInterval());
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

    #averagePlotFromExperimentalDataset() {
        let averageTimingInterval,
            halfTimingInterval,
            latestRelativeTime,
            timingBuckets = [],
            averagePlotData = [];

        this.startXFromZero();
        this.filterDuplicateData();
        this.trimPlotsToTime(20); // ToDo: This needs to be moved later.
        this.trimPlotsetPlotQuantityToLowestCommonDenominator();
        averageTimingInterval = this.averageTimingInterval();
        halfTimingInterval = averageTimingInterval / 2;
        latestRelativeTime = this.latestRelativeTime();

        console.debug({
            averageTimingInterval, latestRelativeTime
        });

        this.data().forEach((plot) => {
            plot.forEach((datapoint) => {
                let timeBucketBeginningThreshold,
                    timeBucketEndingThreshold,
                    t = 0,
                    i = 0;

                do {
                    if (timingBuckets[i] === undefined) {
                        timingBuckets[i] = [];
                    }

                    timeBucketBeginningThreshold = t - halfTimingInterval;
                    timeBucketEndingThreshold = t + halfTimingInterval;

                    if (datapoint.x >= timeBucketBeginningThreshold && datapoint.x < timeBucketEndingThreshold) {
                        timingBuckets[i].push(datapoint);
                    }

                    t = t + averageTimingInterval;
                    i++;
                } while (t < latestRelativeTime);
            });
        });

        averagePlotData = timingBuckets.map((timeBucket) => {
            let totalled = [],
                timeBucketLength = timeBucket.length;

            totalled = timeBucket.reduce((previousDatapoint, currentDatapoint) => {
                return {
                    x: previousDatapoint.x + currentDatapoint.x,
                    y: previousDatapoint.y + currentDatapoint.y,
                };
            }, {
                x: 0,
                y: 0,
            });

            return {
                x: totalled.x / timeBucketLength,
                y: totalled.y / timeBucketLength,
            }
        });

        console.debug(averagePlotData);

        return new Plot(averagePlotData);
    }
}
