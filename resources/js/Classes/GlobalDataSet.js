import {Experiment} from './Experiment';
import {ExperimentsSet} from "./ExperimentsSet";
import {DataSet} from "./DataSet";

export class GlobalDataSet extends DataSet {
    constructor(jsonDataFromServer) {
        super();
        this.privateData = jsonDataFromServer.experimentalData.map((experimentData) => {
            return new Experiment(experimentData, this);
        });
    }

    experiment(id) {
        return ExperimentsSet.experiment(this.data, id);
    }

    experiments(idArray = null) {
        return ExperimentsSet.experiments(this.data, idArray);
    }

    reduceToLoaded() {
        return ExperimentsSet.reduceToLoaded(this.data);
    }

    get data() {
        return this.privateData;
    }

    plotSet() {
        return ExperimentsSet.plotSet(this.data);
    }
}
