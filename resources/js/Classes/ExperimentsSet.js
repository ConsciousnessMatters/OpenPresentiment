import {DataSet} from "./DataSet";
import {PlotSet} from "./PlotSet";

export class ExperimentsSet extends DataSet {
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

    reduceToLoaded() {
        return new ExperimentsSet(
            this.privateData.filter((experiment) => {
                return experiment.loaded === true;
            })
        );
    }

    plotSet() {
        const plotSetData = [];

        this.privateData.forEach((experiment) => {
            experiment.trials().forEach((trial) => {
                plotSetData.push(trial.plot);
            });

            return experiment.loaded === true;
        });

        return new PlotSet(plotSetData);
    }
}