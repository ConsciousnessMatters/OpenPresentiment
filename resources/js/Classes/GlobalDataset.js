import {ExperimentalDataset} from './ExperimentalDataset';
import {Plotset} from "./Plotset";

export class GlobalDataset {
    constructor(rawData) {
        this.experimentData = rawData.experimentalData.map((experimentData) => {
            return new ExperimentalDataset(experimentData, this);
        });
    }

    experiment(id) {
        return this.experimentData.filter((experiment) => {
            return experiment.id === id;
        })[0];
    }

    experiments(idArray = null) {
        if (idArray === null) {
            return this.experimentData;
        } else {
            return this.experimentData.filter((experiment) => {
                return idArray.includes(experiment.id);
            });
        }
    }

    experimentsLoaded() {
        return this.experimentData.filter((experiment) => {
            return experiment.loaded === true;
        });
    }

    get data() {
        return this.experimentData;
    }

    get flattenedData() {
        let plots = [];

        this.experimentData.forEach((experiment) => {
            experiment.forEach((trial) => {
                plots.push(trial.plot());
            });
        });

        return plots;
    }

    plotSet() {
        return new Plotset(this.flattenedData);
    }
}
