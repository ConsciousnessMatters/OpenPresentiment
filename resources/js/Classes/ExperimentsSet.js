import {DataSet} from "./DataSet";
import {PlotSet} from "./PlotSet";

export class ExperimentsSet extends DataSet {
    static experiment(experimentsArray, id) {
        return experimentsArray.filter((experiment) => {
            return experiment.id === id;
        })[0];
    }

    experiment(id) {
        return ExperimentsSet.experiment(this.privateData, id);
    }

    static experiments(experimentsArray, idArray = null) {
        if (idArray === null) {
            return new ExperimentsSet(experimentsArray);
        } else {
            return new ExperimentsSet(
                experimentsArray.filter((experiment) => {
                    return idArray.includes(experiment.id);
                })
            );
        }
    }

    experiments(idArray = null) {
        return ExperimentsSet.experiments(this.privateData, idArray);
    }

    static reduceToLoaded(experimentsArray) {
        return new ExperimentsSet(
            experimentsArray.filter((experiment) => {
                return experiment.loaded === true;
            })
        );
    }

    reduceToLoaded() {
        return ExperimentsSet.reduceToLoaded(this.privateData);
    }

    static plotSet(experimentsArray) {
        const plotSetData = [];

        experimentsArray.forEach((experiment) => {
            experiment.trials().forEach((trial) => {
                plotSetData.push(trial.plot());
            });

            return experiment.loaded === true;
        });

        return new PlotSet(plotSetData);
    }

    plotSet() {
        return ExperimentsSet.plotSet(this.privateData);
    }
}
