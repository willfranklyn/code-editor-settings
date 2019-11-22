// 'use strict';

// //@prepros-append scripts/partials/functions.js
// //@prepros-append scripts/partials/side-nav.js
// //@prepros-append scripts/partials/post-interaction.js


// // common constants
// var profileNav = document.getElementById('profile-nav');
// var rnavBtn = document.querySelector('.right-nav-activate');
// var bodyEl = document.querySelector('body');
// var htmlEl = document.querySelector('html');
// var navToggle = document.querySelector('.navbar-toggler');

// // common variables
// var clientwidth = window.innerWidth;
// var bs_brkPnts = [320, 576, 768, 992, 1200];
// var bs_brkPntActive;

// // -- Common functions (CFn) -- //

// // CFn - add class to element
// function aclass(el, cls) {

//     $(el).addClass(cls);

//     // console.log(cls + ' class added to '+ el);
// }

// function rclass(el, cls) {

//     $(el).removeClass(cls);

//     // console.log(cls + ' class removed from '+ el);
// }

// function tclass(el, cls) {

//     $(el).toggleClass(cls);

//     // console.log(cls + ' class removed from '+ el);
// }

// // VJS - Check if touch device, addclass if touch
// function checkIfTouchEnabled() {
//     var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
//     var mq = function mq(query) {
//         return window.matchMedia(query).matches;
//     };

//     if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
//         aclass('html', 'touch');
//         rclass('html', 'no-touch');
//         return true;
//     }

//     // include the 'heartz' as a way to have a non matching MQ to help terminate the join
//     // https://git.io/vznFH
//     var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
//     return mq(query);
// }
// checkIfTouchEnabled();

// // VJS - Match client width with bootstrap grid breakpoint, add class to html
// function gridClass(w, a) {

//     if (w >= a[0] && w < a[1]) {
//         bs_brkPntActive = 'xs';
//     } else if (w >= a[1] && w < a[2]) {
//         bs_brkPntActive = 'sm';
//     } else if (w >= a[2] && w < a[3]) {
//         bs_brkPntActive = 'md';
//     } else if (w >= a[3] && w < a[4]) {
//         bs_brkPntActive = 'lg';
//     } else if (w >= a[4]) {
//         bs_brkPntActive = 'xl';
//     }
//     console.log(bs_brkPntActive);
//     aclass('html', 'bs-grid-' + bs_brkPntActive);
// }

// gridClass(clientwidth, bs_brkPnts);

// var profileNav = document.getElementById('profile-nav');
// var rnavBtn = document.querySelector('.right-nav-activate');
// var bodyEl = document.querySelector('body');
// var htmlEl = document.querySelector('html');
// var navToggle = document.querySelector('.navbar-toggler');

// function profileNavToggle() {
//     // console.log('profile nav button clicked');
//     tclass(profileNav, 'open');
//     tclass(rnavBtn, 'open');
//     tclass(bodyEl, 'overlay-active');
//     tclass(htmlEl, 'overlay-active');
// }

// function profileNavOpen() {
//     aclass(profileNav, 'open');
//     aclass(rnavBtn, 'open');
//     aclass(bodyEl, 'overlay-active');
//     aclass(htmlEl, 'overlay-active');
// }

// function profileNavclose() {
//     rclass(profileNav, 'open');
//     rclass(rnavBtn, 'open');
//     rclass(bodyEl, 'overlay-active');
//     rclass(htmlEl, 'overlay-active');
// }

// function profileNavChecks() {
//     if (clientwidth >= 992) {
//         profileNavOpen();
//     } else {
//         profileNavclose();
//     }
// }
// rnavBtn.addEventListener('click', profileNavToggle);
// navToggle.addEventListener('click', function () {
//     if (clientwidth <= 992) {
//         profileNavclose();
//     }
// });
// // }

// // show the profile nav on any page with open_nav
// if (document.getElementById("open_nav")) {
//     profileNavOpen();
// }

// // activate a tab
// let choose_tab = function (id) {
//     let el = document.getElementById(id);
//     $('.nav-item').removeClass("active");
//     $(el).addClass("active");
// };


'use strict';

//@prepros-append scripts/partials/functions.js
//@prepros-append scripts/partials/side-nav.js
//@prepros-append scripts/partials/feedPosts.js


// common constants
var profileNav = document.getElementById('profile-nav');
var rnavBtn = document.querySelector('.right-nav-activate');
var bodyEl = document.querySelector('body');
var htmlEl = document.querySelector('html');
var navToggle = document.querySelector('.navbar-toggler');

// common variables
var clientwidth = window.innerWidth;
var bs_brkPnts = [320, 576, 768, 992, 1200];
var bs_brkPntActive;

// -- Common functions (CFn) -- //

// CFn - add class to element
function aclass(el, cls) {

    $(el).addClass(cls);

    // console.log(cls + ' class added to '+ el);
}

function rclass(el, cls) {

    $(el).removeClass(cls);

    // console.log(cls + ' class removed from '+ el);
}

function tclass(el, cls) {

    $(el).toggleClass(cls);

    // console.log(cls + ' class removed from '+ el);
}

// VJS - Check if touch device, addclass if touch
function checkIfTouchEnabled() {
    var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
    var mq = function mq(query) {
        return window.matchMedia(query).matches;
    };

    if ('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch) {
        aclass('html', 'touch');
        rclass('html', 'no-touch');
        return true;
    }

    // include the 'heartz' as a way to have a non matching MQ to help terminate the join
    // https://git.io/vznFH
    var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
    return mq(query);
}
checkIfTouchEnabled();

// VJS - Match client width with bootstrap grid breakpoint, add class to html
function gridClass(w, a) {

    if (w >= a[0] && w < a[1]) {
        bs_brkPntActive = 'xs';
    } else if (w >= a[1] && w < a[2]) {
        bs_brkPntActive = 'sm';
    } else if (w >= a[2] && w < a[3]) {
        bs_brkPntActive = 'md';
    } else if (w >= a[3] && w < a[4]) {
        bs_brkPntActive = 'lg';
    } else if (w >= a[4]) {
        bs_brkPntActive = 'xl';
    }
    // console.log(bs_brkPntActive);
    aclass('html', 'bs-grid-' + bs_brkPntActive);
}

gridClass(clientwidth, bs_brkPnts);

var profileNav = document.getElementById('profile-nav');
var rnavBtn = document.querySelector('.right-nav-activate');
var bodyEl = document.querySelector('body');
var htmlEl = document.querySelector('html');
var navToggle = document.querySelector('.navbar-toggler');

function profileNavToggle() {
    // console.log('profile nav button clicked');
    tclass(profileNav, 'open');
    tclass(rnavBtn, 'open');
    tclass(bodyEl, 'overlay-active');
    tclass(htmlEl, 'overlay-active');
}

function profileNavOpen() {
    aclass(profileNav, 'open');
    aclass(rnavBtn, 'open');
    aclass(bodyEl, 'overlay-active');
    aclass(htmlEl, 'overlay-active');
}

function profileNavclose() {
    rclass(profileNav, 'open');
    rclass(rnavBtn, 'open');
    rclass(bodyEl, 'overlay-active');
    rclass(htmlEl, 'overlay-active');
}

function profileNavChecks() {
    if (clientwidth >= 992) {
        profileNavOpen();
    } else {
        profileNavclose();
    }
}
rnavBtn.addEventListener('click', profileNavToggle);
navToggle.addEventListener('click', function () {
    if (clientwidth <= 992) {
        profileNavclose();
    }
});
// }

// show the profile nav on any page with open_nav
if (document.getElementById("open_nav")) {
    profileNavOpen();
}

// activate a tab
let choose_tab = function choose_tab(id) {
    let el = document.getElementById(id);
    $('.nav-item').removeClass("active");
    $(el).addClass("active");
};

function feedInteractions() {
    var likeBtn = '.like-btn';

    $(likeBtn).click(function () {
        // tclass(likeBtn,'liked');
        $(this).toggleClass('liked');
    });

    // comments and overlay
    var actOverEl = $('.activate--to-overlay');
    var endEl = $('.deactivate-overlay');
    var overDuration = 300;
    var cssWait = 200;
    var overWait = 50;

    function endOverlay() {
        var el = $('.to-overlay');
        el.removeClass('activating-overlay active-overlay');
        el.css({
            'z-index': '1',
            'height': 'auto'
        });
        // el.css({'position':'relative','overflow-y':'hidden'});
        $('body').removeClass('modal-open custom-overlay-active');
        // setTimeout(function(){
        //     $([document.documentElement, document.body]).animate({
        //         scrollTop: el.offset().top
        //     }, overDuration);
        // },cssWait);
    }

    function postOverlayActivate() {
        var el = $('.activating-overlay');
        var elw = el.width() + 'px';
        var elh = el.height() + 'px';
        el.css({
            'z-index': '1050',
            'height': elh
        });

        setTimeout(function () {
            $('body').addClass('modal-open custom-overlay-active');

            el.addClass('active-overlay');
        }, 200);
    }
    endEl.click(function () {
        endOverlay();
    });
    actOverEl.click(function () {
        var p = $(this).parents('.to-overlay');
        p.addClass('activating-overlay');
        postOverlayActivate();
    });
    $('.comment-btn').click(function () {
        var f = $(this).parents('.to-overlay').find('.post-reply-form textarea');
        var fS = $(this).parents('.to-overlay').find('.post-reply-form button');
        f.focus();
    });

    // comment replies and cancel
    var cR = '.reply';
    var cRc = '.reply-cancel';
    var cF = '.comment-form';
    var cFS = '.comment-form-submit';
    $(cR).click(function () {
        //hide other comment forms

        $('.commentCard ' + cR).show();
        $('.commentCard ' + cRc).hide();
        $('.commentCard ' + cF).hide();
        $('.commentCard ' + cFS).hide();

        // show this comment form
        $(this).hide();
        $(this).parents('form').find(cRc).show();
        $(this).parents('form').find(cF).show();
        $(this).parents('form').find(cFS).show();
        $(this).parents('form').find('textarea').focus();
    });
    $(cRc).click(function () {
        $(this).hide();
        $(this).parents('form').find(cR).show();
        $(this).parents('form').find(cF).hide();
        $(this).parents('form').find(cFS).hide();
    });
}
feedInteractions();
//# sourceMappingURL=main--to-student-dist.js.map