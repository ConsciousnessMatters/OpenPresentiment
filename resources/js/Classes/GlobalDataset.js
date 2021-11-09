import {ExperimentalDataset} from './ExperimentalDataset';

export class GlobalDataset {
    constructor(rawData) {
        this.data = rawData.experimentalData.map((experimentData) => {
            return new ExperimentalDataset(experimentData, this);
        });
    }

    experiment(id) {
        return this.data.filter((experiment) => {
            return experiment.id === id;
        })[0];
    }

    experiments(idArray = null) {
        if (idArray === null) {
            return this.data;
        } else {
            return this.data.filter((experiment) => {
                return idArray.includes(experiment.id);
            });
        }
    }

    experimentsLoaded() {
        return this.data.filter((experiment) => {
            return experiment.loaded === true;
        });
    }
}
