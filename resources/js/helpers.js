function initiate() {
}

function addAtemporalEventListener(eventName, callback) {
    let scopedSelectors;

    function querySelector(selectors) {
        scopedSelectors = selectors;
    };

    function manInTheMiddleCallback(event) {
        if (event.target.matches(scopedSelectors)) {
            callback(event);
        }
    }

    document.addEventListener(eventName, manInTheMiddleCallback)

    return {...document, querySelector};
}

function ajaxForm(form, successCallback, failureCallback) {
    let xhr = new XMLHttpRequest(),
        formData = new FormData(form),
        url = form.action;

    xhr.open("POST", url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else if (xhr.readyState === 4) {
            failureCallback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(formData);
}

function ajaxGet(url, successCallback, failureCallback) {
    let xhr = new XMLHttpRequest();

    xhr.open("GET", url, true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(JSON.parse(xhr.responseText));
        } else if (xhr.readyState === 4) {
            failureCallback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send();
}

function twoDimensionalMinMx(objectArray, propertyX, propertyY) {
    let propertyData = [propertyX, propertyY],
        min = {}, max = {};

    objectArray.forEach((object) => {
        propertyData.forEach((property) => {
            if (min[property] === undefined || object[property] < min[property]) {
                min[property] = object[property];
            }

            if (max[property] === undefined || object[property] > max[property]) {
                max[property] = object[property];
            }
        });
    });

    return {
        min,
        max
    }
}

function roundUpToInterval(value, interval) {
    return Math.ceil(value / interval) * interval;
}

function roundDownToInterval(value, interval) {
    return Math.floor(value / interval) * interval;
}

function getVirtualYFromX({x1, y1, x2, y2, xV}) {
    if (x1 === xV) {
        debugger;
        return y1;
    }

    if (x2 === xV) {
        debugger;
        return y2;
    }

    const xScale = x2 - x1,
        xVScale = xV - x1,
        scalingFactor = xVScale / xScale,
        yScale = y2 - y1,
        yVScale = yScale * scalingFactor;

    if (isNaN(yVScale + y1)) {
        debugger;
    }

    return yVScale + y1;
}

export const helpers = {
    initiate,
    addAtemporalEventListener,
    ajaxForm,
    ajaxGet,
    twoDimensionalMinMx,
    roundUpToInterval,
    roundDownToInterval,
    getVirtualYFromX,
};
