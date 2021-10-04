'use strict';

let gsrData = [];

const datapointSpacing = 2;

document.addEventListener('GSRDataPoint', (event) => {
    gsrData.push(event);
});

function renderGraph() {
    // get canvas width
    // work out how many dataPoints for width
    // slice off required datapoints
    // draw from left to right
}
