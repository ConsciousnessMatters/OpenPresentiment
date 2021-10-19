const trialTimeSetting = -7000,
    totalTrials = 2;

let intervalTimer = null,
    trialTime,
    randomDelay,
    trials,
    gsrData = [],
    eventData = [],
    setupTrialTriggered = false;

function setupTrial() {
    trialTime = trialTimeSetting;
    randomDelay = Math.floor(Math.random() * 5) * 1000;
    clearInterval(intervalTimer);
}

function setupPartNavigation() {
    const availableParts = getAvailableParts(),
        $experimentPartSections = $('.experiment section.part'),
        $experimentPartMap = $('.experiment .experiment-structure .part');

    $experimentPartMap.off('click.e6', "**");
    $experimentPartMap.on('click.e6', function() {
        const $mainParent = $(this).parents('main')

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

function setupGsrTrigger() {
    const $buttonConnectToGSR = $('button#connect-to-gsr');

    $buttonConnectToGSR.off('click.e7', "**");
    $buttonConnectToGSR.on('click.e7', () => {
        $(document).on('GSRDataPoint.e1', () => {
            if (! setupTrialTriggered) {
                setupTrialTriggered = true;
                $buttonConnectToGSR.off('GSRDataPoint.e1', "**");
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
        setupTrialFlow();
    });
}

function setupTrialFlow() {
    const $buttonBeginPhase2 = $('button#goto-phase-2');

    $buttonBeginPhase2.off('click.e4', "**");
    $buttonBeginPhase2.on('click.e4', initiatePhase2);

    if (window.graph !== undefined) {
        window.graph.stop();
    }

    initiatePhase1();
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

function logDataPoint() {
    gsrData.push({
        ...event.detail,
        computerTime: Date.now(),
    });
}

function logEvent(event) {
    eventData.push({
        event: event,
        computerTime: Date.now(),
    });
}

function initiatePhase1() {
    logEvent(`P1-T${trials + 1}`);

    $(document).on('GSRDataPoint.e5', logDataPoint);
    $('.phase').addClass('hidden');
    $('#phase-1').removeClass('hidden');
    $('#phase-1 .trial-number').html(trials + 1);
    $('#phase-1 .trial-totals').html(totalTrials);
}

function initiatePhase2() {
    logEvent(`P2-T${trials + 1}`);

    $('.phase').addClass('hidden');
    $('#phase-2').removeClass('hidden');
    setupTrial();
    setIntervalTimer();
}

function stepPhase2() {
    $('.timer .value').html((trialTime / 1000).toFixed(1));
}

function initiatePhase3() {
    const theRandomDecision = Math.floor(Math.random() * 2);

    logEvent(`P3-T${trials + 1}`);

    if (theRandomDecision == 0) {
        $('#phase-3').addClass('calm');
    } else if (theRandomDecision == 1) {
        $('#phase-3').addClass('emotional');
    }

    $('.phase').addClass('hidden');
    $('#phase-3').removeClass('hidden');
}

function stepPhase3() {
    $('.timer .value').html((trialTime / 1000).toFixed(1));
}

function initiatePhase4() {
    logEvent(`P4-T${trials + 1}`);

    $('.phase').addClass('hidden');
    $('#phase-4').removeClass('hidden');
}

function stepPhase4() {
    $('.timer .value').html((trialTime / 1000).toFixed(1));
}

function endTrial() {
    const $gotoPart5 = $('#goto-part-5');

    logEvent(`PE-T${trials + 1}`);
    sendDataToServer();
    trials++;

    if (trials < totalTrials) {
        initiatePhase1();
    } else {
        $(document).off('GSRDataPoint.e5', "**");

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
    }
}

function sendDataToServer() {
    let xhr = new XMLHttpRequest(),
        formData = new FormData(),
        gsrData = formatGsrData(),
        eventData = formatEventData(),
        form = document.querySelector('[name="ajax-info"]'),
        url = form.action,
        csrfToken = form._token.value;

    formData.append("gsrData", gsrData);
    formData.append("eventData", eventData);
    xhr.open("POST", url, true);
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log(xhr.responseText);
            console.log(gsrData);
            console.log(eventData);
            console.log(csrfToken);
        } else if (xhr.readyState === 4) {
            console.log(xhr.responseText);
            console.log(gsrData);
            console.log(eventData);
            console.log(csrfToken);
        }
    };
    xhr.send(formData);
}

function formatGsrData() {
    let csvTypeData = '';

    gsrData.forEach((gsrDataPoint) => {
        const microvolts = Math.round(gsrDataPoint.millivolts * 1000);
        csvTypeData = csvTypeData + `${gsrDataPoint.computerTime},${gsrDataPoint.time},${microvolts}\n`;
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

function initiate() {
    setupGsrTrigger();
    setupPartNavigation();
}

export const experiment1 = {
    initiate,
    gsrData,
    eventData,
};
