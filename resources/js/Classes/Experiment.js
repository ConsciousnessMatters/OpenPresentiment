import {Trial} from './Trial';
import {PlotSet} from './PlotSet';
import {Plot} from "./Plot";
import {DataSet} from "./DataSet";

export class Experiment extends DataSet {
    trialData;

    constructor(experimentData, gloabalDatasetReference) {
        super();
        this.trialData = [];
        this.averageData = { peaceful: [], emotional: [] };
        this.id = experimentData.id;
        this.op_type_number = experimentData.op_type_number;
        this.subject_user_id = experimentData.subject_user_id;
        this.subject_user = experimentData.subject_user;
        this.subject_agreement = experimentData.subject_agreement;
        this.created_at = experimentData.created_at;
        this.updated_at = experimentData.updated_at;
        this.parentGlobalDataSet = gloabalDatasetReference;
        this.trialsActive = false;
        this.averageActive = false;
        this.loaded = false; // ToDo: set ths depending on whether it's actually loaded or not.
        this.onload = () => {};
        this.ingestTrialData(experimentData.trials);
        this.started_at = this.trials()[0].eventData[0].jsTime
        this.peacefulPlotColour = '#ff00ff';
        this.emotionalPlotColour = '#00FF00';
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

    calculateAverageData() {
        // ToDo: MVP1: Finish off function, dependencies and test. TrialSets!!!
        // TrialSets need completion first before continuing. This means pointers in this file that use static
        // methods in the TrialSet because an Experiment is basically a TrialSet with extra bits.

        const millisecondsInterval = 10,
            minMax = this.resolveLowestCommonDenominatorTrialRange();

        this.averageData.peaceful = this.reduceToPeaceful().averageData(minMax, millisecondsInterval);
        this.averageData.emotional = this.reduceToEmotional().averageData(minMax, millisecondsInterval);
    }

    resolveLowestCommonDenominatorTrialRange() {
        // ToDo: MVP1: Write this!

        return {
        }
    }

    load(callback) {
        if (this.loaded) {
            this.trialsActive = true;
            this.dataLoaded(false, callback);
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
        this.trialsActive = false;
    }

    dataLoaded(data, callback) {
        if (!this.loaded) {
            let experimentData = data.experimentalData.filter((experiment) => experiment.id === this.id),
                trials = experimentData[0].trials;

            this.ingestTrialData(trials);
            this.loaded = true;
        }

        if (typeof callback === 'function') {
            callback(data, this);
        }

        if (typeof this.onload === 'function') {
            this.onload(data);
        }
    }

    dataLoadFailed() {
        debugger;
    }

    activateTrials() {
        this.trialsActive = true;
    }

    deactivateTrials() {
        this.trialsActive = false;
    }

    activateAverage() {
        if (this.averageData.peaceful.length === 0 && this.averageData.emotional.length === 0) {
            this.calculateAverageData();
        }
        this.averageActive = true;
    }

    deactivateAverage() {
        this.averageActive = false;
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

    reduceToPeaceful() {
        // ToDo: MVP1: Write this!
    }

    reduceToEmotional() {
        // ToDo: MVP1: Write this!
    }

    setPeacefulPlotColour(colour) {
        this.peacefulPlotColour = colour;
    }

    setEmotionalPlotColour(colour) {
        this.emotionalPlotColour = colour;
    }

    plotSet() {
        return new PlotSet(this.data.map((trial) => {
            const plot = trial.plot();

            switch (trial.image.type.name) {
                case 'Peaceful':
                    plot.colour(this.peacefulPlotColour);
                    break;
                case 'Emotional':
                    plot.colour(this.emotionalPlotColour);
                    break;
                default:
                    debugger;
            }

            return plot;
        }));
    }

    averagePlotSet() {
        return new PlotSet([this.averageData.peaceful, this.averageData.emotional]);
    }
}
