const trialTimeSetting = -7000,
    totalTrials = 2;

let intervalTimer = null,
    trialTime,
    randomDelay,
    trials,
    gsrData = [],
    eventData = [];

function setupTrial() {
    trialTime = trialTimeSetting;
    randomDelay = Math.floor(Math.random() * 5) * 1000;
    clearInterval(intervalTimer);
}

function setupPartNavigation() {
    const availableParts = getAvailableParts(),
        $experimentPartSections = $('.experiment section.part'),
        $experimentPartMap = $('.experiment .experiment-structure .part');

    $experimentPartMap.on('click', function() {
        const $mainParent = $(this).parents('main')

        $mainParent.removeClass(availableParts.join(' '));
        availableParts.forEach((availablePart) => {
            const part = availablePart.split('-')[1];

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
    $('button#connect-to-gsr').on('click', () => {
        $(document).on('GSRDataPoint.$e1', () => {
            const $something = $('button#begin-trials');

            $something.removeClass('neutral');
            $something.on('click.$e2', () => {
                $('#trials-container').removeClass('hidden');
                trials = 0;
                setupTrialFlow();
                if (window.graph !== undefined) {
                    window.graph.stop();
                }

                $(document).off('click.$e2', "**");
            });

            $(document).off('GSRDataPoint.$e1', "**");
        });
    });
}

function setupTrialTrigger() {
    $('button#begin-trials').on('click', () => {
        $('#trials-container').removeClass('hidden');
        trials = 0;
        setupTrialFlow();
    });
}

function setupTrialFlow() {
    $('button#goto-phase-2').on('click', initiatePhase2);
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

    $(document).on('GSRDataPoint', logDataPoint);
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
    logEvent(`PE-T${trials + 1}`);
    trials++;

    if (trials < totalTrials) {
        initiatePhase1();
    } else {
        let report = JSON.stringify({
            'gsrData': JSON.stringify(gsrData),
            'eventData': JSON.stringify(eventData),
        });

        // $.ajax({
        //     url: '/mylab/experiment/presentiment/1',
        //     type: 'POST',
        //     data: report,
        //     contentType: 'application/json; charset=utf-8',
        //     dataType: 'json',
        //     async: false,
        //     success: (message) => {
        //         console.log(message);
        //         console.log(report);
        //     },
        // }).fail((message) => {
        //     console.log(message);
        //     console.log(report);
        // });

        let xhr = new XMLHttpRequest(),
            url = '/mylab/experiment/presentiment/1';

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                console.log(report);
            } else if (xhr.readyState === 4) {
                console.log(xhr.responseText);
                console.log(report);
            }
        };
        xhr.send(report);

        $('.phase').addClass('hidden');
        $('#end').removeClass('hidden');
        $('#goto-part-5').on('click', () => {
            $('#trials-container').addClass('hidden');
            $('.experiment-structure .part-5').click();
        });

        if (window.graph !== undefined) {
            window.graph.resume();
        }
    }
}

function initiate() {
    setupGsrTrigger();
    setupTrialTrigger();
    setupPartNavigation();
}

export const experiment1 = {
    initiate
};
