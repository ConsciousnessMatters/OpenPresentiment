// $variable (as opposed to variable) designates jQuery based module.

import {fullScreenAlerts} from './$full-screen-alerts';
import {experiment1} from './$experiment1';
import {serialDataHandler} from './serialDataHandler';
import {graph} from './graph';

document.addEventListener('DOMContentLoaded', () => {
    fullScreenAlerts.initiate();

    if (document.querySelectorAll('canvas.open-gsr').length) {
        serialDataHandler.initiate('#connect-to-gsr');
    }

    if (document.querySelectorAll('canvas.open-gsr').length) {
        graph.initiate('canvas.open-gsr');
        window.graph = graph;
    }

    if (document.body.classList.contains('experiment')) {
        experiment1.initiate();
    }

    window.experiment1 = experiment1;
});
