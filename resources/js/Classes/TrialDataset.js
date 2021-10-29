export class TrialDataset {
    constructor(trialData) {
        console.debug(trialData);

        this.data = trialData.gsr_data.split("\n").map((lineData) => {
            return lineData.split(",");
        });

        this.jsTimeField = 0;
        this.mcTimeField = 1;
        this.microvoltField = 2;

        this.image = trialData.image;
        this.id = trialData.id;
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

    getPlot() {
        return this.data.map((datapoint) => {
            return {
                x: parseInt(datapoint[this.mcTimeField], 10),
                y: parseInt(datapoint[this.microvoltField], 10),
            }
        });
    }
}
