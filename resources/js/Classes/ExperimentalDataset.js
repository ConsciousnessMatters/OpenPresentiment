import {TrialDataset} from './TrialDataset';
import {Plotset} from './Plotset';

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
}
