$(function () {
    $('.has-hamburger').click(function () {
        var hEl = $(this);
        var icon = $(this).find('.hamburger');
        icon.toggleClass('is-active');
    });
    $('.hamburger').click(function () {
        var hEl = $(this);
        var icon = $(this).find('hamburger');
        icon.toggleClass('is-active');
    });

    $(document).on('click', '.close-learn-burger', function () {
        // console.log('clicked!');
        $('.learn-burger').removeClass('is-active');
    });
});