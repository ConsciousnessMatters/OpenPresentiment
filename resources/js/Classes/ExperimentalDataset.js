import {TrialDataset} from './TrialDataset';
import {Plotset} from './Plotset';
import {Plot} from './Plot';

export class ExperimentalDataset {
    #data;

    constructor(experimentData) {
        this.#data = experimentData.trials.map((trialData) => {
            return new TrialDataset(trialData);
        });
        this.id = experimentData.id;
    }

    data() {
        return this.#data;
    }

    trial(id) {
        return this.#data.filter((trial) => {
            return trial.id === id;
        })[0];
    }

    trials(idArray = null) {
        if (idArray === null) {
            return this.#data;
        } else {
            return this.#data.filter((trial) => {
                return idArray.includes(trial.id);
            });
        }
    }

    plotset() {
        return new Plotset(this);
    }

    yMinMax() {
        let min = null,
            max = null;

        this.#data.forEach((trial) => {
            const yMinMaxForTrial = trial.yMinMax();

            if (yMinMaxForTrial.yMin < min || min === null) {
                min = yMinMaxForTrial.yMin;
            }

            if (yMinMaxForTrial.yMax > max || max === null) {
                max = yMinMaxForTrial.yMax;
            }
        });

        return {
            yMin: min,
            yMax: max,
        }
    }

    averagePlotDataForEmotionalImages() {
        return this.averagePlotDataForFilter((trial) => {
            return trial.image.type.name === 'Emotional';
        });
    }

    averagePlotDataForPeacefulImages() {
        return this.averagePlotDataForFilter((trial) => {
            return trial.image.type.name === 'Peaceful';
        });
    }

    // ToDo: Think about how to compensate for timing anomalies. We're just assuming correct timing to do this average.

    averagePlotDataForFilter(filterFunction) {
        let filteredTrials = this.#data.filter(filterFunction),
            assumedTiming = [],
            summedPlot = [],
            averagePlot = new Plot();

        assumedTiming = filteredTrials[0].plot().map((datapoint) => {
            return datapoint.x;
        });

        filteredTrials.forEach((trial) => {
            trial.plot().forEach((datapoint, index) => {
                const summedY = summedPlot[index] ?? 0;

                summedPlot[index] = summedY + datapoint.y;
            });
        });

        summedPlot.forEach((summedValue, index) => {
            if (assumedTiming[index] !== undefined) {
                averagePlot.addPoint(index, {
                    x: assumedTiming[index],
                    y: summedValue / filteredTrials.length,
                });
            }
        });

        return averagePlot;
    }
}
