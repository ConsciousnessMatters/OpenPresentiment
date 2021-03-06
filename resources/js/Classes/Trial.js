import {Plot} from './Plot';

export class Trial {
    constructor(trialData, experimentReference = null) {
        this.jsTimeField = 0;
        this.mcTimeField = 1;
        this.microvoltField = 2;
        this.partContainingField = 1;
        this.trialContainingField = 1;
        this.image = trialData.image;
        this.id = trialData.id;
        this.control_number = trialData.control_number;
        this.created_at = trialData.control_number;
        this.updated_at = trialData.control_number;
        this.image = trialData.image;
        this.number = null;
        this.active = true;
        this.gsrData = [];
        this.eventData = [];
        this.parentExperiment = experimentReference;

        this.ingestEventData(trialData);
        this.addExperimentalTime();

        if (trialData.gsr_data !== undefined) {
            this.updateData(trialData);
        }
    }

    updateData(trialData) {
        this.ingestGsrData(trialData);
        this.addExperimentalTime();
        this.addTimingDriftAnalysisData();
        this.removeDuplicatedGsrDatapoints();

        return this;
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
        const firstDataPoint = this.gsrData[0] ?? null;

        if (firstDataPoint) {
            const timeZeroEvent = this.eventData.filter((event) => event.part == 3)[0],
                timeZero = timeZeroEvent.jsTime,
                mcJsOffset = firstDataPoint.jsTime - firstDataPoint.mcTime;

            this.gsrData = this.gsrData.map((datapoint) => {
                return {
                    ...datapoint,
                    experimentalTime: datapoint.mcTime + mcJsOffset - timeZero
                };
            });

            this.eventData = this.eventData.map((datapoint) => {
                return {
                    ...datapoint,
                    experimentalTime: datapoint.jsTime - timeZero
                };
            });
        }

        return this;
    }

    addTimingDriftAnalysisData() {
        const firstDataPoint = this.gsrData[0] ?? null;

        const timeZeroEvent = this.eventData.filter((event) => event.part == 3)[0],
            timeZero = timeZeroEvent.jsTime,
            mcJsOffset = firstDataPoint.jsTime - firstDataPoint.mcTime;

        this.gsrData = this.gsrData.map((datapoint) => {
            const virtualMcTime = datapoint.mcTime + mcJsOffset;

            return {
                ...datapoint,
                jsTimingDrift: virtualMcTime - datapoint.jsTime,
            };
        });
    }

    removeDuplicatedGsrDatapoints() {
        const uKeys = [];

        this.gsrData = this.gsrData.filter((datapoint) => {
            const uKey = `x_${datapoint.experimentalTime} y_${datapoint.microVolts}`,
                uKeyNew = ! uKeys.includes(uKey);

            if (uKeyNew) {
                uKeys.push(uKey);
            }

            return uKeyNew;
        });

        return this;
    }

    numericParsing(lineElement) {
        let integerVersion = parseInt(lineElement, 10),
            floatVersion = parseInt(lineElement, 10),
            number = integerVersion === floatVersion ? integerVersion : floatVersion;

        return isNaN(lineElement) ? lineElement : number;
    }

    minMaxData() {
        return helpers.twoDimensionalMinMx(this.gsrData, 'experimentalTime', 'microVolts');
    }

    virtualMicroVoltsAtExperimentalTime(experimentalTime) {
        const hitActual = this.gsrData.filter((datapoint) => datapoint.experimentalTime === experimentalTime);

        if (hitActual.length === 1) {
            return hitActual[0].microVolts;
        } else if (hitActual.length > 1) {
            console.error('Duplicate data detected.');
            return hitActual[0].microVolts;
        }

        const previousNeighbour = this.previousDatapoint(experimentalTime),
            nextNeighbour = this.nextDatapoint(experimentalTime);

        return helpers.getVirtualYFromX({
            x1: previousNeighbour.experimentalTime,
            y1: previousNeighbour.microVolts,
            x2: nextNeighbour.experimentalTime,
            y2: nextNeighbour.microVolts,
            xV: experimentalTime,
        });
    }

    previousDatapoint(experimentalTime) {
        let closestMatch = null;

        this.gsrData.forEach((datapoint) => {
            const datapointBeforeTime = datapoint.experimentalTime < experimentalTime;

            if (datapointBeforeTime && (closestMatch === null || datapoint.experimentalTime > closestMatch.experimentalTime)) {
                closestMatch = datapoint;
            }
        });

        return closestMatch;
    }

    nextDatapoint(experimentalTime) {
        let closestMatch = null;

        this.gsrData.forEach((datapoint) => {
            const datapointAfterTime = datapoint.experimentalTime > experimentalTime;

            if (datapointAfterTime && (closestMatch === null || datapoint.experimentalTime < closestMatch.experimentalTime)) {
                closestMatch = datapoint;
            }
        });

        return closestMatch;
    }

    plot() {
        return new Plot(this.gsrData.map(Trial.trialDataToPlotData), this.eventData);
    }

    timeJitterPlot() {
        return new Plot(this.gsrData.map(Trial.trialDataToTimeJitterPlotData), this.eventData);
    }

    static trialDataToPlotData(datapoint) {
        return {
            x: datapoint.experimentalTime,
            y: (datapoint.microVolts / 1000),
        }
    }

    static trialDataToTimeJitterPlotData(datapoint) {
        return {
            x: datapoint.experimentalTime,
            y: datapoint.jsTimingDrift,
        }
    }
}
