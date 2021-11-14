export class DataSet {
    constructor(dataArray) {
        this.privateData = dataArray ?? [];
    }

    forEach(callback, thisArg) {
        return this.privateData.forEach(callback, thisArg);
    }

    reduce(callback, initialValue) {
        if (initialValue === undefined) {
            return this.privateData.reduce(callback);
        } else {
            return this.privateData.reduce(callback, initialValue);
        }
    }

    map(callback, thisArg) {
        return this.privateData.map(callback, thisArg);
    }


    filter(callback) {
        this.privateData = this.privateData = this.privateData.filter(callback);
        return this;
    }
}
