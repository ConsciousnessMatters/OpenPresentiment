export default () => {

    function eventsSetup() {
        $('body').on('click', '.full-screen-alert-dismiss', function() {
            $(this).parents('.full-screen-alert:not(body)').remove();
            $('body').removeClass('full-screen-alert');
        });
    }

    function startingConditionCheck() {
        if ($('.full-screen-alert:visible').length > 0) {
            $('body').addClass('full-screen-alert');
        }
    }

    eventsSetup();
    startingConditionCheck();
};
