import {Trial} from './Trial';
import {PlotSet} from './PlotSet';
import {Plot} from "./Plot";

export class Experiment {
    trialData;

    constructor(experimentData, gloabalDatasetRefference) {
        this.trialData = [];
        this.averageData = [];
        this.id = experimentData.id;
        this.op_type_number = experimentData.op_type_number;
        this.subject_user_id = experimentData.subject_user_id;
        this.subject_user = experimentData.subject_user;
        this.subject_agreement = experimentData.subject_agreement;
        this.created_at = experimentData.created_at;
        this.updated_at = experimentData.updated_at;
        this.parentGlobalDataSet = gloabalDatasetRefference;
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
        const interval = 10;



        // Work out and exclusively use lowest common denominator timespan
        // Get copy of resampled trials for LCD timespan
        // Produce average from resample trials





        let bucketsPlot = [],
            averagePlot;

        this.data.forEach((plot) => {
            let lowestX = this.preZeroTime * -1,
                highestX = this.postZeroTime;

            for (let t = lowestX; t <= highestX; t = t + interval) {
                let i = t + indexShift;

                if (bucketsPlot[i] === undefined) {
                    bucketsPlot[i] = [];
                }

                let virtualPlot = plot.virtualYfromX(t)

                if (isNaN(virtualPlot)) {
                    debugger;
                } else {
                    bucketsPlot[i].push(virtualPlot);
                }
            }
        });

        averagePlot = bucketsPlot.map((bucket, index) => {
            let bucketSum = bucket.reduce((p, c) => p + c);
            return {
                x: index - indexShift,
                y: bucketSum / bucket.length,
            }
        });

        return new Plot(averagePlot);
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
        if (this.averageData.length === 0) {
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

    }
}
