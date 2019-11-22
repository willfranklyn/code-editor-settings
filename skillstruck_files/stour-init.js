let codesteps = [{
        title: "Welcome!",
        content: "Hello! We are so glad you're here! Let's show you around.",
        element: "",
        position: "bottom",
        addCSS: " background: white; border-radius: 8px; list-style: none;",
        childCSS: ' border-color: #e83e8c;',
        position: 'centered',
        animation: false
    },
    {
        title: "Code &amp; Learn",
        content: "Welcome to the Code & Learn page, your dashboard homepage! Here, you can access learning materials, create and edit files with using a code editor, and preview your website.",
        element: "#nav_code",
        position: "bottom",
        addCSS: " background: white; border-radius: 8px; list-style: none;",
        childCSS: 'padding-right: 0.5rem; padding-left: 0.5rem;color: rgba(0, 0, 0, 0.9);font-weight: 700;text-align:center;',
        position: 'centered',
        animation: false
    },
    {
        title: "Learn panel",
        content: "Use the Learn panel to access your learning materials!",
        element: "#learn",
        position: "bottom",
        addCSS: "background: white; border-radius: 8px; margin-top: -8px;",
        childCSS: 'top: -17px;',
        position: 'centered',
        animation: false
    },
    {
        title: "Changing lessons",
        content: "Click the 'Change lessons' button to view available courses, units, and lessons.",
        element: "#lessonsMenu-header",
        addCSS: " ",
        childCSS: ' ',
        position: 'centered',
        animation: false
    },
    {
        title: "Checkpoints",
        content: "Each lesson has a checkpoint. Checkpoints will have different challenges, including quizzes. You must complete the checkpoint to continue to the next lesson. Each time you do, you earn more points!",
        element: ".checkpoint_section",
        addCSS: "background: white;margin: 0 !important;",
        childCSS: ' ',
        position: 'centered',
        animation: true
    },
    {
        title: "Code panel",
        content: "The code panel contains everything you need to build a website! You can add files, folders, switch between files, and code your site here.",
        element: "#code",
        addCSS: " ",
        childCSS: 'transition: all 1s;',
        position: 'left',
        animation: true
    },
    {
        title: "Files Navigation",
        content: "Click the file button in the code panel to view the files menu. The button has the name of the file you are currently editing.",
        element: "#filesMenu-header",
        addCSS: " ",
        childCSS: ' ;',
        position: 'left',
        animation: false
    },
    {
        title: "File options",
        content: "You can click on the file options button (three vertical dots) to edit or delete a file.",
        element: ".file_options-tour",
        addCSS: "height: 40px; width: 40px;min-height: 40px; min-width: 40px;max-height: 40px; max-width: 40px;",
        childCSS: ' ;',
        position: 'left',
        animation: false
    },
    {
        title: "File editor",
        content: "The code editor holds the code for your file. The file you are editing will load into the preview (the right panel).",
        element: ".CodeMirror-wrap",
        addCSS: " ",
        childCSS: '',
        position: 'left',
        animation: false
    },
    {
        title: "Run",
        content: "Click 'Run' to view your changes!",
        element: "#load_preview_button",
        addCSS: "",
        childCSS: '',
        position: 'centered',
        animation: false
    },
    {
        title: "Save",
        content: "Don't forget to save your work! An autosave feature is in place, but it is good to get in the habit of saving your work frequently. Good developers always save their work!",
        element: "#save_button",
        addCSS: "",
        childCSS: '',
        position: 'centered',
        animation: false
    },
    {
        title: "Open in new window",
        content: "Click 'Open in new window' to view your site in a new tab or window. This new preview will be a full-screen view of your project.",
        element: "#new_tab_button",
        addCSS: "",
        childCSS: '',
        position: 'centered',
        animation: false
    },
    {
        title: "panel adjustments",
        content: "If you want to keep using the editor but you need a bigger preview, you can use the layout resizers to change the width of each panel.",
        element: ".mp-btn-tour",
        addCSS: "",
        childCSS: '',
        position: 'centered',
        animation: false
    },
    {
        title: "Ready, Set, Go!",
        content: "Let's start coding!",
        element: "",
        addCSS: "",
        childCSS: '',
        position: 'Top Left',
        animation: false
    }
]

let pagetour = function (steps) {
    var i, w, wel, ns, ps, m, wf, wc, s, elc;
    var sl = steps.length;
    var static = $('#awsStaticLink').val();

    function closeTour() {
        var ta;
        $('body').removeClass('tour-body');
        if ($('.tour-active').length > -1) {
            ta = $('.tour-active');
            ta.attr('style', ta.attr('data-style'));
            ta.appendTo('.tour-wrap');
            ta.children().attr('style', '');
            ta.unwrap();
            ta.removeClass('tour-active');
        }
        if ($('.tour-fill').length > -1) {
            $('.tour-fill').remove();
        }
    }

    function getFill(obj) {
        // top:'+obj.top+';right:'+obj.top+';bottom:'+obj.top+';left:'+obj.top+';
        return '<div class="tour-fill" style="width:' + obj.ow + 'px;height:' + obj.oh + 'px;min-width:' + obj.ow + 'px;min-height:' + obj.oh + 'px;max-width:' + obj.ow + 'px;max-height:' + obj.oh + 'px;margin:' + obj.om + 'px;"></div>'
    }

    function highlight(elh) {
        closeTour();
        elh.addClass('tour-active');
        var o = elh.offset();
        var wh, ww;
        wh = $('body').height();
        ww = $('body').width();
        if (o) {
            var op = {
                ow: elh.width(),
                oh: elh.height(),
                ot: o.top,
                ol: o.left
            }
        } else {
            var op = {
                ow: elh.width(),
                oh: elh.height(),
                ot: null,
                ol: null
            }
        }

        op.om = elh.css('margin');
        op.or = op.ol + op.ow;
        op.ob = op.ot + op.oh;
        if (op.ot > wh) {
            console.log('top too much: ' + op.ot + ' bot: ' + op.ob);
            op.ot = 'auto',
                op.ob = 8;
        }
        var fill = getFill(op);

        function retDs(gel) {
            var ret;
            if (!gel.attr('style')) {
                ret = ' ';
            } else {
                ret = gel.attr('style');
            }
            return ret;
        }
        var ds = retDs(elh);
        elh.attr('data-style', ds);
        elh.wrap('<div class="tour-wrap"></div>');
        $('.tour-wrap').append(fill);
        elh.appendTo('.tour-modal');
        elh.attr('style', 'width:' + op.ow + 'px;height:' + op.oh + 'px;min-width:' + op.ow + 'px;min-height:' + op.oh + 'px;max-width:' + op.ow + 'px;max-height:' + op.oh + 'px;position: fixed;top:' + op.ot + 'px;right:' + op.or + 'px;bottom:' + op.ob + 'px;left:' + op.ol + 'px;' + s.addCSS + ' z-index: 1073;')
        var elhcs = s.childCSS;
        $('.tour-active').children().attr('style', elhcs);
    }

    function buildStep(i) {
        s = steps[i];
        i = parseInt(i);
        var elsel = s.element;
        el = $(elsel);
        $(w + ' .tour-title').html(s.title);
        $(w + ' .tour-body').html(s.content);
        var nsi = parseInt(i) + 1;
        var psi = parseInt(i) - 1;
        wel.attr('data-step', i);
        ns.attr('data-step', nsi);
        ps.attr('data-step', psi);
        if (i === 0) {
            ps.hide();
            wf.show();
            m.modal('show');
            $('.end-tour').hide();
        } else if (i >= sl) {
            ns.hide();
            wf.show();
            m.modal('hide');
            $('.end-tour').hide();
            closeTour();
        }
        if (i > 0) {
            ps.show();
            console.log('show previous button');
            $('.end-tour').hide();
        }
        if (i + 1 < sl) {
            ns.show();
            $('.end-tour').hide();

        }
        if (i + 1 === sl) {
            ns.hide();
            $('.end-tour').show();
            console.log('hide nav buttons on tour');
        }
        var md = m.find('.modal-dialog');
        md.removeClass('modal-x-left modal-x-centered modal-x-right');
        md.addClass('slide-left');
        var mdpos = s.position;
        md.addClass('modal-x-' + mdpos);
        highlight(el);
    }

    $.get(static + "plugins/tour/tour-template.html", function (data) {
        $('body').append('<div class="tourWrap" data-step="0"></div>');
        w = '.tourWrap';
        wel = $(w);
        $(w).html(data);
        ns = $(w + ' .next-step');
        ps = $(w + ' .prev-step');
        m = $(w + ' .modal');
        wf = $(w + ' .modal-footer');
        wc = $(w + ' .close');
        buildStep(0);
        ns.click(function () {
            var ti = $(this).attr('data-step');
            buildStep(ti);
        });
        ps.click(function () {
            var ti = $(this).attr('data-step');
            buildStep(ti);
        });
        m.on('hide.bs.modal', function () {
            console.log('tour closed')
            closeTour();
        });
    });

}
var wurl = window.location.href;

$(function () {
    if (wurl.indexOf('?tutorial=yes') > -1) {
        console.log('run tour');
        pagetour(codesteps);
    }
})