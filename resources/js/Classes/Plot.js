export class Plot {
    constructor(plotData) {
        this.data = plotData ?? [];
    }

    forEach(callback, thisArg) {
        return this.data.forEach(callback, thisArg);
    }

    reduce(callback, initialValue) {
        if (initialValue === undefined) {
            return this.data.reduce(callback);
        } else {
            return this.data.reduce(callback, initialValue);
        }
    }

    map(callback, thisArg) {
        return this.data.map(callback, thisArg);
    }

    lowestValues() {
        return this.data.reduce((previous, current) => {
            return {
                x: (previous.x < current.x) ? previous.x : current.x,
                y: (previous.y < current.y) ? previous.y : current.y,
            };
        });
    }

    highestValues() {
        return this.data.reduce((previous, current) => {
            return {
                x: (previous.x > current.x) ? previous.x : current.x,
                y: (previous.y > current.y) ? previous.y : current.y,
            };
        });
    }

    addPoint(index, plotpoint) {
        this.data[index] = plotpoint;
    }
}
