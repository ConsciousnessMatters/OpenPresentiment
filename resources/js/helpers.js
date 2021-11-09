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

export const helpers = {
    initiate,
    addAtemporalEventListener,
    ajaxForm,
    ajaxGet,
};
