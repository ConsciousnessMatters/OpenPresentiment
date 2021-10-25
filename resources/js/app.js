// $variable (as opposed to variable) designates jQuery based module.

import {helpers} from './helpers';
import {fullScreenAlerts} from './$full-screen-alerts';
import {experiment1} from './$experiment1';
import {dataAnalysis} from './data-analysis';
import {serialDataService} from './serial-data-service';
import {graph} from './graph';
import {setup} from './setup';

helpers.initiate();
window.helpers = helpers;

document.addEventListener('DOMContentLoaded', () => {
    fullScreenAlerts.initiate();

    if (document.querySelector('#connect-to-gsr')) {
        serialDataService.initiate('#connect-to-gsr');
    }

    if (document.querySelectorAll('canvas.open-gsr').length) {
        graph.initiate('canvas.open-gsr');
        window.graph = graph;
    }

    if (document.body.classList.contains('experiment')) {
        experiment1.initiate();
    }

    if (document.body.classList.contains('data-analysis')) {
        dataAnalysis.initiate();
    }

    if (document.body.classList.contains('setup')) {
        setup.initiate();
    }

    window.experiment1 = experiment1;
});
