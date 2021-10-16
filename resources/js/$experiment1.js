export default () => {

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

    setupPartNavigation();
};
