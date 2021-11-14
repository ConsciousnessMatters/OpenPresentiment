import {Experiment} from './Experiment';
import {PlotSet} from "./PlotSet";
import {ExperimentsSet} from "./ExperimentsSet";

export class GlobalDataSet {
    constructor(jsonDataFromServer) {
        this.privateData = jsonDataFromServer.experimentalData.map((experimentData) => {
            return new Experiment(experimentData, this);
        });
    }

    experiment(id) {
        return this.privateData.filter((experiment) => {
            return experiment.id === id;
        })[0];
    }

    experiments(idArray = null) {
        if (idArray === null) {
            return new ExperimentsSet(this.privateData);
        } else {
            return new ExperimentsSet(
                this.privateData.filter((experiment) => {
                    return idArray.includes(experiment.id);
                })
            );
        }
    }

    experimentsLoaded() {
        return new ExperimentsSet(this.privateData.filter((experiment) => {
                return experiment.loaded === true;
            })
        );
    }

    get data() {
        return this.privateData;
    }

    plotSet() {
        const plots = [];

        this.privateData.forEach((experiment) => {
            experiment.trials().forEach((trial) => {
                plots.push(trial.plot());
            });

            return experiment.loaded === true;
        });

        return new PlotSet(plots);
    }
}
