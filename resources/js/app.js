// $variable (as opposed to variable) designates jQuery based module.

import $fullScreenAlerts from './$full-screen-alerts';
import $experiment1 from './$experiment1';

document.addEventListener('DOMContentLoaded', () => {
    $fullScreenAlerts();
    $experiment1();
});
