var mw = 36;
var btnw = 16;

function panes() {
    var btn, w, wl, ww, wh, plen, nlen, wt, maxForward, maxBackward, drag, n, p;
    var dir = 'vertical';
    drag = false;
    $('.mp-wrapper > .mp-btn').on('mousedown', function () {
        // disable the iframe
        $("#cover_iframe").show();
        drag = 'ew';
        if ($(this).parent().hasClass('vertical') === true) {
            dir = 'vertical';

        } else {
            dir = 'horizontal';
        }
        w = $(this).parent();
        wl = w.offset().left;
        wt = w.offset().top;
        ww = w.width();
        wh = w.height();
        var nid = $(this).next().attr('id');
        n = $('#' + nid);
        var pid = $(this).prev().attr('id');
        p = $('#' + pid);
        var nall = $(this).nextAll();
        var pall = $(this).prevAll();
        var nplen = 0;
        var nblen = 0;
        var pplen = 0;
        var pblen = 0;
        nall.each(function () {
            if ($(this).hasClass('btn') === true) {
                nblen += btnw;
            } else {
                nplen += mw;
            }
        });
        pall.each(function () {
            if ($(this).hasClass('btn') === true) {
                pblen += btnw;
            } else {
                pplen += mw;
            }
        });
        maxForward = nplen + nblen;
        maxBackward = pplen + pblen;
    });

    const throttle = (func, limit) => {
        let inThrottle
        return function () {
            const args = arguments
            const context = this
            if (!inThrottle) {
                func.apply(context, args)
                inThrottle = true
                setTimeout(() => inThrottle = false, limit)
            }
        }
    }

    $(document).on('mousemove', throttle(function (e) {
        if (!drag) {
            return false;
        } else {

            var ml = Math.min(Math.max(Number(e.clientX - wl - 8), maxBackward), Number(ww - maxForward));
            var mt = Math.min(Math.max(Number(e.clientY - wt - 8), maxBackward), Number(wh - maxForward));
            var nh = n.height();
            var toth = n.height() + p.height() + btnw;
            var nw = n.width();
            var totw = n.width() + p.width() + btnw;
            var ppos = p.position();
            var npos = n.position();
            var prh = mt - ppos.top;
            var nrh = toth - prh - btnw;
            var prw = ml - ppos.left;
            var nrw = totw - prw - btnw;
            var cknw = nrw < mw;
            var ckpw = prw < mw;
            var cknh = nrh < mw;
            var ckph = prh < mw;
            p.height(prh);
            n.height(nrh);
            p.width(prw);
            n.width(nrw);
            var nni = 0;
            if (cknh === true && dir === 'vertical') {
                n.nextAll('.mp-pane').each(function () {
                    var e = $(this);
                    var str = e.attr('id');
                    var strp = parseInt(str.charAt(str.length - 1)) - 1;
                    var prvel = e.parent().children('#' + 'pane-' + strp);
                    var tw = e.height();
                    if (prvel.height() <= mw && e.height() > mw) {
                        nni += 1 * mw;
                        e.height(toth - prh + tw - nni - btnw);
                    }
                });
            }
            if (ckph === true && dir === 'vertical') {
                n.prevAll('.mp-pane').each(function () {
                    var e = $(this);
                    var str = e.attr('id');
                    var strp = parseInt(str.charAt(str.length - 1)) + 1;
                    var prvel = e.parent().children('#' + 'pane-' + strp);
                    var tw = e.height();
                    if (prvel.height() <= mw && e.height() > mw) {
                        nni += 1 * mw;
                        e.height(toth - nrh + tw - nni - btnw);
                    }
                });
            }
            if (cknw === true && dir === 'horizontal') {
                n.nextAll('.mp-pane').each(function () {
                    var e = $(this);
                    var str = e.attr('id');
                    var strp = parseInt(str.charAt(str.length - 1)) - 1;
                    var prvel = e.parent().children('#' + 'pane-' + strp);
                    var tw = e.width();
                    if (prvel.width() <= mw && e.width() > mw) {
                        nni += 1 * mw;
                        e.width(totw - prw + tw - nni - btnw);
                    }
                });
            }
            if (ckpw === true && dir === 'horizontal') {
                n.prevAll('.mp-pane').each(function () {
                    var e = $(this);
                    var str = e.attr('id');
                    var strp = parseInt(str.charAt(str.length - 1)) + 1;
                    var prvel = e.parent().children('#' + 'pane-' + strp);
                    var tw = e.width();
                    if (prvel.width() <= mw && e.width() > mw) {
                        nni += 1 * mw;
                        e.width(totw - nrw + tw - nni - btnw);
                    }
                });
            }
        }
    }, 15));

    $(document).mouseup(function () {
        drag = false;
        // enable the iframe
        $("#cover_iframe").hide();
    });
}

$(function () {
    function setupHoriz() {
        var w = $('.mp-wrapper.horizontal');
        var p = $('.mp-wrapper.horizontal > .mp-pane');
        var b = $('.mp-wrapper.horizontal > .mp-btn');
        var pl = p.length;
        var bl = b.length;
        var bw = bl * btnw / pl;
        var pw = w.width() / pl - bw;
        p.attr('style', 'width:' + pw + 'px');
    }

    function setupVert() {
        var w = $('.mp-wrapper.vertical');
        var p = $('.mp-wrapper.vertical > .mp-pane');
        var b = $('.mp-wrapper.vertical > .mp-btn');
        var pl = p.length;
        var bl = b.length;
        var bw = bl * btnw / pl;
        var pw = w.height() / pl - bw;
        p.attr('style', 'height:' + pw + 'px');
    }
    setupHoriz();
    setupVert();

    panes();
});