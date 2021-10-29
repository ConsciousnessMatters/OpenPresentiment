export class GlobalDataset {
    constructor(rawData) {

        console.debug(rawData);

        this.data = rawData.experimentalData.map((experimentData) => {
            return new ExperimentalDataset(experimentData);
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
}
