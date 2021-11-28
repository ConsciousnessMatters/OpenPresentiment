import {PlotSet} from "./PlotSet";

export class TrialSet {
    constructor(trialData = []) {
        this.trialData = trialData;
        this.averageData = { peaceful: [], emotional: [] };
    }

    reduceToActiveTrials() {
        return new TrialSet(
            this.trialData.filter((trial) => {
                return trial.active === true;
            })
        );
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
            return new TrialSet(
                this.trialData.filter((trial) => {
                    return idArray.includes(trial.id);
                })
            )
        }
    }

    reduceToPeaceful() {
        return new TrialSet(
            this.trialData.filter((trial) => {
                return trial.image.type.name === 'Peaceful';
            })
        );
    }

    reduceToEmotional() {
        return new TrialSet(
            this.trialData.filter((trial) => {
                return trial.image.type.name === 'Emotional';
            })
        );
    }

    plotSet() {
        const plotSetData = [];

        this.trialData.forEach((trial) => {
            plotSetData.push(trial.plot());
        });

        return new PlotSet(plotSetData);
    }

    calculateAverageData(minMax, millisecondsInterval) {
        if (this.trialData.length === 0) {
            return;
        }

        const min = helpers.roundUpToInterval(minMax.highestMin, millisecondsInterval),
            max = helpers.roundDownToInterval(minMax.lowestMax, millisecondsInterval);

        const averageData = [];

        for (let t = min; t <= max; t = t + millisecondsInterval) {
            const valuesAtTime = this.trialData.map((trial) => trial.virtualMicroVoltsAtExperimentalTime(t)),
                averageMicroVoltsAtTime = valuesAtTime.reduce((a, b) => (a + b)) / valuesAtTime.length;

            averageData.push({
                experimentalTime: t,
                microVolts: averageMicroVoltsAtTime,
            });
        }

        return averageData;
    }
}
