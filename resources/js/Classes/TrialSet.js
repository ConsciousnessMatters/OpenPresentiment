import {DataSet} from "./DataSet";
import {PlotSet} from "./PlotSet";

export class TrialSet extends DataSet {
    static reduceToActiveTrials(trialsArray) {
        return new TrialSet(
            trialsArray.filter((trial) => {
                return trial.active === true;
            })
        );
    }

    reduceToActiveTrials() {
        return TrialSet.reduceToActiveTrials(this.privateData);
    }

    static plotSet(trialsArray) {
        const plotSetData = [];

        trialsArray.forEach((trial) => {
            plotSetData.push(trial.plot());
        });

        return new PlotSet(plotSetData);
    }

    plotSet() {
        return TrialSet.plotSet(this.privateData);
    }

    static averageData(trialsArray) {
        // ToDo: MVP1: Write this!
    }

    averageData() {
        return TrialSet.averageData(this.privateData);
    }
}
