// Temporary solution, even though I know how to write fine in vanilla JS, jQuery is just so damn quick to develop in.

document.addEventListener('DOMContentLoaded', () => {
    jQuerySetup();
    fullScreenAlertCheck();
});

function jQuerySetup() {
    $('body').on('click', '.full-screen-alert-dismiss', function() {
        $(this).parents('.full-screen-alert:not(body)').remove();
        $('body').removeClass('full-screen-alert');
    });
}

function fullScreenAlertCheck() {
    if ($('.full-screen-alert:visible').length > 0) {
        $('body').addClass('full-screen-alert');
    }
}
