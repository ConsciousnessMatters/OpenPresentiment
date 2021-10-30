export class TrialDataset {
    constructor(trialData) {
        this.data = trialData.gsr_data.split("\n").map((lineData) => {
            return lineData.split(",").map(this.numericParsing);
        });

        this.jsTimeField = 0;
        this.mcTimeField = 1;
        this.microvoltField = 2;

        this.image = trialData.image;
        this.id = trialData.id;

        // ToDo: think about implementing the line below in a better way.
        this.limit(20);
    }

    numericParsing(lineElement) {
        let integerVersion = parseInt(lineElement, 10),
            floatVersion = parseInt(lineElement, 10),
            number = integerVersion === floatVersion ? integerVersion : floatVersion;

        return isNaN(lineElement) ? lineElement : number;
    }

    limit(seconds = 20) {
        let earliestTime = null,
            millisecondLimit = seconds * 1000;

        this.data = this.data.filter((datapoint) => {
            let dataPointTime = parseInt(datapoint[this.mcTimeField], 10);

            if (earliestTime === null) {
                earliestTime = dataPointTime;
            }

            return dataPointTime <= earliestTime + millisecondLimit;
        });
    }

    plot() {
        const plotData = this.data.map((datapoint) => {
            return {
                x: parseInt(datapoint[this.mcTimeField], 10),
                y: parseInt(datapoint[this.microvoltField], 10),
            }
        });

        return new Plot(plotData);
    }

    yMinMax() {
        let min = null,
            max = null;

        this.plot().forEach((datapoint) => {
            if (datapoint.y < min || min === null) {
                min = datapoint.y;
            }

            if (datapoint.y > max || max === null) {
                max = datapoint.y;
            }
        });

        return {
            yMin: min,
            yMax: max,
        }
    }
}
