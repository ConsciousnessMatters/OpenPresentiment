// $variable (as opposed to variable) designates jQuery based module.

import {helpers} from './helpers';
import {fullScreenAlerts} from './$full-screen-alerts';
import {experiment1} from './$experiment1';
import {dataAnalysis} from './data-analysis';
import {serialDataService} from './serial-data-service';
import {GlobalDataset} from './Classes/GlobalDataset';
import {graph} from './graph';
import {graphLive} from './graph-live';
import {setup} from './setup';

helpers.initiate();
window.GlobalDataset = GlobalDataset;
window.helpers = helpers;
window.graph = graph;

document.addEventListener('DOMContentLoaded', () => {
    fullScreenAlerts.initiate();

    if (document.querySelector('#connect-to-gsr')) {
        serialDataService.initiate('#connect-to-gsr');
    }

    if (document.querySelectorAll('canvas.open-gsr').length) {
        graphLive.initiate('canvas.open-gsr');
        window.graphLive = graphLive;
    }

    if (document.body.classList.contains('experiment')) {
        experiment1.initiate();
    }

    if (document.body.classList.contains('data-analysis')) {
        dataAnalysis.initiate();

        window.dataAnalysis = dataAnalysis;
    }

    if (document.body.classList.contains('setup')) {
        setup.initiate();
    }

    window.experiment1 = experiment1;
});
