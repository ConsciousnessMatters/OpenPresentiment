// Temporary solution, even though I know how to write fine in vanilla JS, jQuery is just so damn quick to develop in.

document.addEventListener('DOMContentLoaded', () => {
    jQuerySetup();
});

function jQuerySetup() {
    console.debug('test');
    $('body').on('click', '.full-screen-alert-dismiss', function() {
        $(this).parents('.full-screen-alert').remove();
    });
}
