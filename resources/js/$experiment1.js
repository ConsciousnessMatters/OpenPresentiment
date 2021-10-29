const trialTimeSetting = -7000,
    totalTrials = 2,
    timerFontsize = '128px',
    scaleFactor = window.devicePixelRatio || 1,
    canvasSelector = 'canvas#experimental-core';

let intervalTimer = null,
    trialTime,
    randomDelay,
    trials,
    gsrData = [],
    eventData = [],
    setupTrialTriggered = false,
    emotionalImage,
    peacefulImage,
    emotionalImageId,
    peacefulImageId,
    eCC,
    chosenImageId = null,
    subjectUserId = null,
    subjectAgreement = null,
    controlMode = false,
    navigationOveride = true,
    controlNumber = '',
    experimentId = '',
    imageLoadEventHandlersRegistered = false;

function initiate() {
    setupPartNavigation();
    setupFormInteractions();
    setupGsrTrigger();
}

function setupPartNavigation() {
    const availableParts = getAvailableParts(),
        $experimentPartSections = $('.experiment section.part'),
        $experimentPartMap = $('.experiment .experiment-structure .part');

    $experimentPartMap.off('click.e6', "**");
    $experimentPartMap.on('click.e6', function() {
        const $mainParent = $(this).parents('main');

        if ((! $(this).hasClass('not-yet')) || navigationOveride) {
            $mainParent.removeClass(availableParts.join(' '));
            availableParts.forEach((availablePart) => {
                if ($(this).hasClass(availablePart)) {
                    $mainParent.addClass(availablePart);
                    $experimentPartSections.addClass('hidden');
                    $experimentPartSections.filter('.' + availablePart).removeClass('hidden');
                }
            });

            $experimentPartMap.removeClass('current');
            $(this).addClass('current');
        }
    });
}

function getAvailableParts() {
    const prefix = 'part-',
        uptoNumber = 5;

    let parts = [];
    for (let i = 1; i <= uptoNumber; i++) {
        parts.push(prefix + i);
    }

    return parts;
}

function setupFormInteractions() {
    helpers.addAtemporalEventListener('submit', searchUser).querySelector('[name="ajax-search-user"]');
    helpers.addAtemporalEventListener('click', subjectAgreementAccepted).querySelector('#subject-agreement-accepted');
    helpers.addAtemporalEventListener('click', subjectAgreementRejected).querySelector('#subject-agreement-rejected');
}

function searchUser(event) {
    const form = event.target;

    event.preventDefault();

    helpers.ajaxForm(form, (responseJson) => {
        if (responseJson.userId !== null) {
            subjectFound(responseJson, form);
        } else {
            subjectNotFound(responseJson, form);
        }
    }, (xhr) => {
        subjectNotFound(responseJson, form);
    });
}

function subjectFound(responseJson, form) {
    form.querySelectorAll('.message').forEach((spanElement) => {
        spanElement.classList.add('hidden');
    });
    form.querySelector('.success.message').classList.remove('hidden');
    form.querySelectorAll('.subject-number').forEach((spanElement) => {
        spanElement.innerHTML = responseJson.userId;
    });
    subjectUserId = responseJson.userId;
    $('.part-3').removeClass('not-yet');
}

function subjectNotFound(responseJson, form) {
    form.querySelector('.failure.message').classList.remove('hidden');
}

function subjectAgreementAccepted() {
    subjectAgreement = true;
    $('.part-4').removeClass('not-yet');
}

function subjectAgreementRejected() {
    subjectAgreement = false;
    $('.part-4').removeClass('not-yet');
}

function setupGsrTrigger() {
    const $buttonConnectToGSR = $('button#connect-to-gsr');

    $buttonConnectToGSR.off('click.e7', "**");
    $buttonConnectToGSR.on('click.e7', () => {
        $(document).on('SerialDataPoint.e1', () => {
            if (! setupTrialTriggered) {
                setupTrialTriggered = true;
                $buttonConnectToGSR.off('SerialDataPoint.e1', "**");
                $('.part-4').addClass('experiment-started');
                setupTrialTrigger();
            }
        });
    });
}

function setupTrialTrigger() {
    const $buttonBeginTrials = $('button#begin-trials');

    $buttonBeginTrials.removeClass('neutral').removeAttr('disabled');;
    $buttonBeginTrials.off('click.e3', "**");
    $buttonBeginTrials.on('click.e3', () => {
        $('#trials-container').removeClass('hidden');
        trials = 0;
        initiatePhase1();
    });
}

function initiatePhase1() {
    const $buttonBeginPhase2 = $('button#goto-phase-2');

    $buttonBeginPhase2.off('click.e4', "**");
    $buttonBeginPhase2.on('click.e4', initiatePhase2);

    if (window.graph !== undefined) {
        window.graph.stop();
    }

    logEvent(`P1-T${trials + 1}`);

    $(document).on('SerialDataPoint.e5', logDataPoint);
    $('#phase-2, #end').addClass('hidden');
    $('#phase-1').removeClass('hidden');
    $('#phase-1 .trial-number').html(trials + 1);
    $('#phase-1 .trial-totals').html(totalTrials);
}

function logEvent(event) {
    eventData.push({
        event: event,
        computerTime: Date.now(),
    });
}

function logDataPoint() {
    gsrData.push({
        ...event.detail,
        computerTime: Date.now(),
    });
}

function initiatePhase2() {
    logEvent(`P2-T${trials + 1}`);

    $('#phase-1, #end').addClass('hidden');
    $('#phase-2').removeClass('hidden');
    setupTrial();
}

function setupTrial() {
    trialTime = trialTimeSetting;
    randomDelay = Math.floor(Math.random() * 5) * 1000;

    stopIntervalProcessor();
    setIntervalTimer();
    getImagePairUrls();
    setupCanvas();
    drawTimerOnCanvas();
}

function stopIntervalProcessor() {
    clearInterval(intervalTimer);
}

function setIntervalTimer() {
    intervalTimer = setInterval(() => {
        intervalProcessor();
        trialTime = trialTime + 100;
    }, 100);
}

function intervalProcessor() {
    if (trialTime < 0) {
        stepPhase2();
    } else if (trialTime == 0) {
        initiatePhase3();
        stepPhase3();
    } else if (trialTime < 3000) {
        stepPhase3();
    } else if (trialTime == 3000) {
        initiatePhase4();
        stepPhase4();
    } else if (trialTime < 10000 + randomDelay) {
        stepPhase4();
    } else if (trialTime == 10000 + randomDelay) {
        endTrial();
    }
}

function getImagePairUrls() {
    let xhr = new XMLHttpRequest(),
        url = '/mylab/experiment/presentiment/1/getImages';

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            loadImagePair(xhr.responseText);
        } else if (xhr.readyState === 4) {
            console.log('Something went wrong trying to obtain images.');
        }
    };

    xhr.onerror = () => {
        console.log('Something went very wrong trying to obtain images.');
    };

    xhr.open('GET', url, true);
    xhr.send();
}

function loadImagePair(response) {
    let returnData = JSON.parse(response);

    emotionalImage = new Image();
    peacefulImage = new Image();
    emotionalImage.src = returnData.emotionalImageUrl;
    peacefulImage.src = returnData.peacefulImageUrl;
    emotionalImageId = returnData.emotionalImageId;
    peacefulImageId = returnData.peacefulImageId;
    if (! imageLoadEventHandlersRegistered) {
        emotionalImage.onload = () => {
            preDrawImageOnCanvas(emotionalImage)
            console.debug('Loaded emotional image');
        };
        peacefulImage.onload = () => {
            preDrawImageOnCanvas(peacefulImage)
            console.debug('Loaded peaceful image');
        };
        imageLoadEventHandlersRegistered = true;
    }
}

function setupCanvas() {
    eCC = document.querySelector(canvasSelector).getContext('2d');
    window.addEventListener('resize', () => {
        resizeCanvas();
    });
    resizeCanvas();
}

function resizeCanvas() {
    eCC.canvas.width = eCC.canvas.scrollWidth * scaleFactor;
    eCC.canvas.height = eCC.canvas.scrollHeight * scaleFactor;
}

function stepPhase2() {
    drawTimerOnCanvas();
}

function initiatePhase3() {
    const theRandomDecision = Math.floor(Math.random() * 2);

    logEvent(`P3-T${trials + 1}`);

    if (theRandomDecision == 0) {
        drawImageOnCanvas(peacefulImage);
        chosenImageId = peacefulImageId;
    } else if (theRandomDecision == 1) {
        drawImageOnCanvas(emotionalImage);
        chosenImageId = emotionalImageId;
    }
}

function stepPhase3() {
}

function initiatePhase4() {
    logEvent(`P4-T${trials + 1}`);

    drawTimerOnCanvas();
}

function stepPhase4() {
    drawTimerOnCanvas();
}

function endTrial() {
    const $gotoPart5 = $('#goto-part-5');

    logEvent(`PE-T${trials + 1}`);
    sendDataToServer();
    trials++;

    if (trials < totalTrials) {
        initiatePhase1();
    } else {
        $(document).off('SerialDataPoint.e5', "**");

        $('.phase').addClass('hidden');
        $('#end').removeClass('hidden');
        $gotoPart5.off('click.e8', "**");
        $gotoPart5.on('click.e8', () => {
            $('#trials-container').addClass('hidden');
            $('.experiment-structure .part-5').click();
        });

        if (window.graph !== undefined) {
            window.graph.resume();
        }

        experimentId = '';
        controlNumber = '';
        $('.part-5').removeClass('not-yet');
    }
}

function sendDataToServer() {
    let xhr = new XMLHttpRequest(),
        formData = new FormData(),
        gsrData = formatGsrData(),
        eventData = formatEventData(),
        form = document.querySelector('[name="ajax-info"]'),
        url = form.action,
        userId = form.user_id.value,
        csrfToken = form._token.value;

    formData.append("gsrData", gsrData);
    formData.append("eventData", eventData);
    formData.append("imageId", chosenImageId);
    formData.append("controlNumber", controlNumber);
    formData.append("userId", userId);
    formData.append("subjectUserId", subjectUserId);
    formData.append("experimentId", experimentId);
    formData.append("subjectAgreement", subjectAgreement ? 1 : 0);
    xhr.open("POST", url, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            successfullTrialSubmission(JSON.parse(xhr.responseText));
        } else if (xhr.readyState === 4) {
            console.log(xhr.responseText);
        }
    };
    xhr.send(formData);
}

function successfullTrialSubmission(jsonResponse) {
    experimentId = jsonResponse.experimentId;
}

function formatGsrData() {
    let csvTypeData = '';

    gsrData.forEach((SerialDataPoint) => {
        const microvolts = Math.round(SerialDataPoint.millivolts * 1000);
        csvTypeData = csvTypeData + `${SerialDataPoint.computerTime},${SerialDataPoint.time},${microvolts}\n`;
    });
    gsrData = [];

    return csvTypeData;
}

function formatEventData() {
    let csvTypeData = '';

    eventData.forEach((eventDataPoint) => {
        csvTypeData = csvTypeData + `${eventDataPoint.computerTime},${eventDataPoint.event}\n`;
    });
    eventData = [];

    return csvTypeData;
}

function drawTimerOnCanvas() {
    const currentTime = (trialTime / 1000).toFixed(1),
        sign = currentTime >= 0 ? '+' : '';

    eCC.clearRect(0, 0, eCC.canvas.width, eCC.canvas.height);
    eCC.font = `200 ${timerFontsize} "Open Sans"`;
    eCC.fillStyle = "#ffffff";
    eCC.textAlign = "center";
    eCC.fillText(`T${sign}${currentTime}`, eCC.canvas.width / 2, eCC.canvas.height / 2);
}

function preDrawImageOnCanvas(image) {
    eCC.globalAlpha = 0.01;
    eCC.drawImage(image, 0, 0, 0.1, 0.1);
    eCC.globalAlpha = 1;
}

function drawImageOnCanvas(image) {
    const originalWidth = image.naturalWidth,
        originalHeight = image.naturalHeight,
        imageWidthIfCanvasHeight = originalWidth * (eCC.canvas.height / originalHeight),
        imageHeightIfCanvasWidth = originalHeight * (eCC.canvas.width / originalWidth),
        constrainWidth = imageWidthIfCanvasHeight > eCC.canvas.width,
        calculatedWidth = constrainWidth ? eCC.canvas.width : imageWidthIfCanvasHeight,
        calculatedHeight = constrainWidth ? imageHeightIfCanvasWidth : eCC.canvas.height,
        imageLocationX = (eCC.canvas.width / 2) - (calculatedWidth / 2),
        imageLocationY = (eCC.canvas.height / 2) - (calculatedHeight / 2);

    logEvent(`BeforeImageDraw-T${trials + 1}`);

    eCC.clearRect(0, 0, eCC.canvas.width, eCC.canvas.height);
    eCC.drawImage(image, imageLocationX, imageLocationY, calculatedWidth, calculatedHeight);

    if (controlMode) {
        const red = Math.floor(Math.random() * 256),
            green = Math.floor(Math.random() * 256),
            blue = Math.floor(Math.random() * 256),
            redChannel = ((red + 1) * 65536) -1,
            greenChannel = ((green + 1) * 256) -1,
            blueChannel = ((blue + 1) * 1) - 1;

        controlNumber = redChannel + greenChannel + blueChannel;
        eCC.fillStyle = `rgb(${red}, ${green}, ${blue})`;
        eCC.fillRect(0.1, 0, eCC.canvas.width, eCC.canvas.height);
    }

    logEvent(`AfterImageDraw-T${trials + 1}`);
}

export const experiment1 = {
    initiate,
    gsrData,
    eventData,
    stopIntervalProcessor,
};
