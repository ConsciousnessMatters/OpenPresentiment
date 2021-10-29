export class Dataset {
    constructor(CSV) {
        this.rawData = CSV.split("\n").map((lineData) => {
            return lineData.split(",");
        });

        this.jsTimeField = 0;
        this.mcTimeField = 1;
        this.microvoltField = 2;
    }

    limit(seconds = 20) {
        let earliestTime = null,
            millisecondLimit = seconds * 1000;

        this.rawData = this.rawData.filter((datapoint) => {
            let dataPointTime = parseInt(datapoint[this.mcTimeField], 10);

            if (earliestTime === null) {
                earliestTime = dataPointTime;
            }

            return dataPointTime <= earliestTime + millisecondLimit;
        });
    }

    getPlot() {
        return this.rawData.map((datapoint) => {
            return {
                x: parseInt(datapoint[this.mcTimeField], 10),
                y: parseInt(datapoint[this.microvoltField], 10),
            }
        });
    }
}
