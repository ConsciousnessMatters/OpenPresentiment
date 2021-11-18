import {Trial} from './Trial';
import {PlotSet} from './PlotSet';

export class Experiment {
    trialData;

    constructor(experimentData, gloabalDatasetRefference) {
        this.trialData = [];
        this.id = experimentData.id;
        this.op_type_number = experimentData.op_type_number;
        this.subject_user_id = experimentData.subject_user_id;
        this.subject_user = experimentData.subject_user;
        this.subject_agreement = experimentData.subject_agreement;
        this.created_at = experimentData.created_at;
        this.updated_at = experimentData.updated_at;
        this.parentGlobalDataSet = gloabalDatasetRefference;
        this.active = false;
        this.loaded = false; // ToDo: set ths depending on whether it's actually loaded or not.
        this.onload = () => {};
        this.ingestTrialData(experimentData.trials);
        this.started_at = this.trials()[0].eventData[0].jsTime;
    }

    ingestTrialData(trials) {
        let trialIdsPresent = [];

        this.trialData.forEach((trial) => {
            trialIdsPresent.push(trial.id);
        });

        this.trialData = trials.map((trialData) => {
            if (trialIdsPresent.includes(trialData.id)) {
                return this.trial(trialData.id).updateData(trialData);
            } else {
                return new Trial(trialData, this);
            }
        });
    }

    load(callback) {
        if (this.loaded) {
            this.active = true;
            this.dataLoaded([], callback);
        } else {
            helpers.ajaxGet(`/mylab/experiment/presentiment/1&2/get-experiment/${this.id}`, (data) => {

                this.dataLoaded(data, callback);
            }, this.dataLoadFailed);
        }
    }

    unload() {
        this.trialData.forEach((trial) => {
            trial.gsrData = [];
        });
        this.loaded = false;
        this.active = false;
    }

    deactivate() {
        this.active = false;
    }

    dataLoaded(data, callback) {
        if (!this.loaded) {
            let experimentData = data.experimentalData.filter((experiment) => experiment.id === this.id),
                trials = experimentData[0].trials;

            this.ingestTrialData(trials);
            this.loaded = true;
        }
        this.active = true;

        if (typeof callback === 'function') {
            callback(data);
        }

        if (typeof this.onload === 'function') {
            this.onload(data);
        }
    }

    dataLoadFailed() {
        debugger;
    }

    get data() {
        return this.trialData;
    }

    trial(id) {
        return this.trialData.filter((trial) => {
            return trial.id === id;
        })[0];
    }

    trials(idArray = null) {
        if (idArray === null) {
            return this.trialData;
        } else {
            return this.trialData.filter((trial) => {
                return idArray.includes(trial.id);
            });
        }
    }

    plotSet() {
        return new PlotSet(this.data.map((trial) => trial.plot()));
    }
}
