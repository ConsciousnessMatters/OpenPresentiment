export class ExperimentalDataset {
    constructor(experimentData) {
        this.data = experimentData.trials.map((trialData) => {
            return new TrialDataset(trialData);
        });
        this.id = experimentData.id;
    }

    trial(id) {
        return this.data.filter((trial) => {
            return trial.id === id;
        })[0];
    }

    trials(idArray = null) {
        if (idArray === null) {
            return this.data;
        } else {
            return this.data.filter((trial) => {
                return idArray.includes(trial.id);
            });
        }
    }
}
