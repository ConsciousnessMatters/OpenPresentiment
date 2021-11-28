import {Experiment} from './Experiment';
import {ExperimentsSet} from "./ExperimentsSet";

export class GlobalDataSet extends ExperimentsSet {
    constructor(jsonDataFromServer) {
        super();
        this.privateData = jsonDataFromServer.experimentalData.map((experimentData) => {
            return new Experiment(experimentData, this);
        });
    }

    get data() {
        return this.privateData;
    }
}
