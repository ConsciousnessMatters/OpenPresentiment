import {PlotSet} from "./PlotSet";

export class ExperimentsSet {
    constructor(experimentsArray = null) {
        if (experimentsArray !== null) {
            this.privateData = experimentsArray;
        }
    }

    forEach(callback, thisArg) {
        return this.privateData.forEach(callback, thisArg);
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

    reduceToLoaded() {
        return new ExperimentsSet(
            this.privateData.filter((experiment) => {
                return experiment.loaded === true;
            })
        );
    }

    reduceToActiveTrials() {
        return new ExperimentsSet(
            this.privateData.filter((experiment) => {
                return experiment.trialsActive === true;
            })
        );
    }

    reduceToActiveAverages() {
        return new ExperimentsSet(
            this.privateData.filter((experiment) => {
                return experiment.averageActive === true;
            })
        );
    }

    plotSet() {
        const plotSetData = [];

        this.privateData.forEach((experiment) => {
            experiment.trials().forEach((trial) => {
                plotSetData.push(trial.plot());
            });
        });

        return new PlotSet(plotSetData);
    }

    averagePlotSet() {
        const plotSetData = [];

        this.privateData.forEach((experiment) => {
            plotSetData.push(...experiment.averagePlotSet().data);
        });

        return new PlotSet(plotSetData);
    }
}
