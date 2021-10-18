// $variable (as opposed to variable) designates jQuery based module.

import {fullScreenAlerts} from './$full-screen-alerts';
import {experiment1} from './$experiment1';
import {serialDataHandler} from './serialDataHandler';
import {graph} from './graph';

document.addEventListener('DOMContentLoaded', () => {
    fullScreenAlerts.initiate();
    experiment1.initiate();
    serialDataHandler.initiate('#connect-to-gsr');

    if ($('canvas.open-gsr').length) {
        graph.initiate('canvas.open-gsr');
        window.graph = graph;
    }

    window.experiment1 = experiment1;
});
