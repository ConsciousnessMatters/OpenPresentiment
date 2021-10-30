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

    filter(callback) {
        this.filters.push(callback);
        return this;
    }

    actualiseData() {
        const sourceData = this.datasource.data(),
            filteredData = this.actualiseFilter(sourceData),
            flattenedData = this.flattenData(filteredData);

        this.#data = flattenedData;
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

    data() {
        if (! this.#data) {
            this.actualiseData();
        }
        return this.#data;
    }

    averagePlot() {
        if (this.datasource instanceof ExperimentalDataset) {
            return this.averagePlotFromExperimentalDataset();
        } else {
            console.error('Unfamiliar datasource provided.');
        }
    }

    averagePlotFromExperimentalDataset() {

        console.debug(this.data());
    }
}
