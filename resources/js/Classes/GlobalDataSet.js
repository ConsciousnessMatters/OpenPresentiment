import {Experiment} from './Experiment';
import {PlotSet} from "./PlotSet";
import {ExperimentsSet} from "./ExperimentsSet";

export class GlobalDataSet {
    constructor(rawData) {
        this.privateData = rawData.experimentalData.map((experimentData) => {
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

    get flattenedData() {
        let plots = [];

        this.privateData.forEach((experiment) => {
            experiment.forEach((trial) => {
                plots.push(trial.plot());
            });
        });

        return plots;
    }

    plotSet() {
        return new PlotSet(this.flattenedData);
    }
}
