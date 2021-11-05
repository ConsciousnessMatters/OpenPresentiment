import {Plot} from './Plot';

export class TrialDataset {
    constructor(trialData) {
        this.jsTimeField = 0;
        this.mcTimeField = 1;
        this.microvoltField = 2;
        this.partContainingField = 1;
        this.trialContainingField = 1;
        this.image = trialData.image;
        this.id = trialData.id;
        this.number = null;

        this.ingestGsrData(trialData);
        this.ingestEventData(trialData);
        this.addExperimentalTime();
    }

    ingestGsrData(trialData) {
        this.gsrData = trialData.gsr_data.split("\n").map((lineData) => {
            const lineDataItems = lineData.split(",").map(this.numericParsing);

            return {
                mcTime: parseInt(lineDataItems[this.mcTimeField],10),
                jsTime: parseInt(lineDataItems[this.jsTimeField],10),
                microVolts: parseInt(lineDataItems[this.microvoltField],10),
            }
        });
    }

    ingestEventData(trialData) {
        let eventProcessing = trialData.event_data.split("\n").map((lineData) => {
            const lineDataItems = lineData.split(",").map(this.numericParsing),
                part = lineDataItems[this.partContainingField].match(/P([\d|E])+/),
                trial = lineDataItems[this.trialContainingField ].match(/T(\d)+/),
                time = lineDataItems[this.jsTimeField];

            if (this.number === null) {
                this.number = parseInt(trial[1],10);
            }

            if (part !== null && trial !== null && time !== null) {
                return {
                    part: isNaN(part[1]) ? part[1] : parseInt(part[1],10),
                    jsTime: time,
                }
            } else {
                return null;
            }
        });

        this.eventData = eventProcessing.filter((event) => event !== null);
    }

    addExperimentalTime() {
        this.gsrData = this.gsrData.map((datapoint) => {
            let timeZeroEvent = this.eventData.filter((event) => event.part == 3)[0],
                timeZero = timeZeroEvent.jsTime;

            return {
                ...datapoint,
                experimentalTime: datapoint.jsTime - timeZero
            };
        });

        this.eventData = this.eventData.map((datapoint) => {
            let timeZeroEvent = this.eventData.filter((event) => event.part == 3)[0],
                timeZero = timeZeroEvent.jsTime;

            return {
                ...datapoint,
                experimentalTime: datapoint.jsTime - timeZero
            };
        });

        return this;
    }

    numericParsing(lineElement) {
        let integerVersion = parseInt(lineElement, 10),
            floatVersion = parseInt(lineElement, 10),
            number = integerVersion === floatVersion ? integerVersion : floatVersion;

        return isNaN(lineElement) ? lineElement : number;
    }

    plot() {
        const plotData = this.gsrData.map((datapoint) => {
            return {
                x: datapoint.experimentalTime,
                y: datapoint.microVolts,
            }
        });

        return new Plot(plotData, this.eventData);
    }
}
