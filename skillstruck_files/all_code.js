/* CODE */
const FILE_BUTTON = '<button class="file_options list-item-btn list-item-btn-icon" title="Edit or delete replace_name" data-value="replace_id"><i aria-hidden="true" class="fal fa-ellipsis-v"></i><span class="sr-only">File options</span></button>';
const CODE_BOX = '<textarea class="codeBox" id="filetype" style="display: none;"></textarea>';
const CHECKPOINT = '<button data-checkpoint="checkpoint_id" class="btn btn-primary show_checkpoint">Start Checkpoint</button><div style="display:none;" id=check_checkpoint_id class="checkpoint_section mb-5 replace_complete"><hr><h1>Checkpoint</h1><h2>checkpoint_name</h2><div>checkpoint_description</div><br><p>Requirements:<ul class="list-unstyled requirements">replace_requirements</ul><button class="btn check_code replace_compiled"id=grade_replace_kind>Check My Code</button><div id=grade_response></div>quiz_button</div>';
const REQUIREMENT = '<li id="req_requirement_id" class="requirement check_checkpoint_id card p-2">replace_text</li>';
const QUIZ_BUTTON = '<button id="quiz_lesson_id" class="show_quiz quiz_button btn mt-3 mb-1">Take the Quiz</button>';
const LINK_REG = /<link.+?href.+?["'](.+?)["'].*?>/gm;
const SCRIPT_REG = /<script.+?src.+?["'](.+?)["'].*?t>/g;
const ANCHOR_REG = /<a.+?(href.+?['"](.+?htm.+?)['"])/g;
const LOADING = '<h2 class="h2 text-center">Loading . . .</h2>';
// globals
var frame;
var editor;
var editjs;
var extra_blocks;
var details;
let changed = false;
var timer_active = true;
var debug;
var activity_data = {
    "lesson": null,
    "checkpoint": null,
    "question": null,
    "page": null,
    "csrfmiddlewaretoken": document.getElementById("csrf").value
};

window.onbeforeunload = function () {
    if (changed) {
        return "You have unsaved changes. Are you sure you want to leave?";
    }
    send_updates();
};

// cookies
let getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};
let setCookie = function (name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
};
let eraseCookie = function (name) {
    document.cookie = name + '=; Max-Age=-99999999;';
};

///////////////////////////////////// LIVE PREVIEW

let check_link = function (link) {
    let regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:com|org|io|gov|co|net|us|ca|edu)/;
    if (regex.match(link)) {
        event.preventDefault();
        load_preview(page);
    }
};

$(document).on("click", "#preview a", function () {
    let link = $(this).attr("href");
    check_link(link);
});

let absolute_path = function (file, link) {
    if (!file.indexOf("/") == -1) {
        return link;
    }
    parts = file.split("/");
    end = parts.pop();
    // go back as many directories as needed
    let re = /\.\.\//g;
    back = ((link || '').match(re) || []).length
    for (var i = 0; i < back; i++) {
        parts.pop();
        link = link.replace("../", "");
    }
    path = parts.join("/");
    return path + link;
};

let build_js = function (id) {
    let container = document.getElementById("frame_container");
    let content = document.getElementById(id).value;;
    pause_editor(true);
    container.innerHTML = LOADING;
    $("#preview").remove();
    $("#frame_container").html(frame);
    let doc = document.getElementById("preview").contentWindow.document;
    let js = '<body><div style="font-family: monospace; border-bottom: 1px solid lightgray;" id="console_div"></div><script type="text/javascript">';
    // js += 'console.log=(function (o, n) {return function (e) {o(e);let p = document.createElement("p");p.innerHTML = e;n.appendChild(p)};}(console.log.bind(console), document.getElementById("console_div")));';
    js += 'var log = document.querySelector("#console_div");["log", "warn", "error"].forEach(function (verb) {console[verb] = (function (method, verb, log) {return function (text) {method(text);let msg = document.createElement("p");msg.classList.add(verb);msg.textContent = text;log.appendChild(msg);};})(console[verb].bind(console), verb, log);});';
    js += '</script><script type="text/javascript">' + content + '</script></body>';
    doc.open();
    doc.write(js);
    doc.close();
};

let build_preview = function (id) {
    let container = document.getElementById("frame_container");
    pause_editor(true);
    container.innerHTML = "Loading . . .";
    let data = {
        'csrfmiddlewaretoken': document.getElementById("csrf").value,
        'code': editor.getValue()
    };
    $.ajax({
        type: "POST",
        url: "/student/build/",
        data: data,
        success: function (response) {
            if (response != "error") {
                container.innerHTML = response;
            } else {
                container.innerHTML = "An error occurred";
            }
            document.getElementById("save_button").disabled = false;
            pause_editor(false);
        }
    });
};

let load_preview = function (page) {
    let output = "";
    refresh_editor();
    let id = document.getElementsByClassName("codeBox active")[0].id;
    if (page) {
        page = page.replace(".", ":");
        let el = document.getElementById(page);
        if (el) {
            id = el.id;
        } else {
            id = page;
            // return false;
        }
    }
    if (id.endsWith("py")) {
        build_preview(id);
        return;
    }
    if (id.endsWith("js")) {
        build_js(id);
        return;
    }
    // load the html file
    if (!id.endsWith("html")) {
        id = id.split(":")[0] + ":html";
    }
    if (!document.getElementById(id)) {
        console.log("Improper file");
        alert("Cannot run a CSS file, try choosing an HTML file");
        return false;
    }
    // reset the container
    $("#preview").remove();
    $("#frame_container").html(frame);
    let doc = document.getElementById('preview').contentWindow.document;
    let html = document.getElementById(id).value;
    let css = "";
    let js = "";
    // get the linked files
    let match;
    let str = html;

    while ((match = LINK_REG.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (match.index === LINK_REG.lastIndex) {
            LINK_REG.lastIndex++;
        }
        let link = match[0];
        let path = absolute_path(id, match[1]);
        let file = document.getElementById(path.replace(".", ":"));
        if (file) {
            css += file.value;
            html = html.replace(link, "");
        }
    }
    str = html;
    while ((match = SCRIPT_REG.exec(str)) !== null) {
        let link = match[0];
        let path = absolute_path(id, match[1]);
        let file = document.getElementById(path.replace(".", ":"));
        if (file) {
            js += file.value;
            html = html.replace(link, "");
        }
    }
    // replace all self linking anchor tags
    while ((match = ANCHOR_REG.exec(str)) !== null) {
        let link = match[1];
        let path = absolute_path(id, match[2]);
        let destination = 'href="#" onclick="parent.load_preview(\'' + path + '\');"';
        html = html.replace(match[1], destination);
    }
    let style = "<style>" + css + "</style>";
    let script = '<script type="text/javascript">' + js + '</script>';
    let h = html.search("</head>") - 1;
    if (h > 0) {
        output = html.slice(0, h) + style + script + html.slice(h);
    } else {
        output = style + script + html;
    }
    doc.open();
    doc.write(output);
    doc.close();
    return output;
};

window.load_preview = load_preview;

///////////////////////////////////// FILE MANAGEMENT

let pause_editor = function (pause) {
    if (pause) {
        $("#pause").show();
    } else {
        $("#pause").hide();
    }
};

let save_all = function () {
    // refresh first, then save all
    refresh_editor(function () {
        let files = {
            'csrfmiddlewaretoken': document.getElementById("csrf").value,
            'id_folder': document.getElementById("id_folder").value
        };
        $('#sources textarea').each(function (i, source) {
            files[source.id] = source.value;
        });
        document.getElementById("save_button").disabled = true;
        document.getElementById("status").innerHTML = "<em>Saving . . .</em>";
        let url = "/account/files.save/";
        $.ajax({
            type: "POST",
            url: url,
            data: files,
            success: function (response) {
                if (response == "saved") {
                    document.getElementById("status").innerHTML = "<em>Saved</em>";
                } else {
                    document.getElementById("status").innerHTML = "<em>An error occurred</em>";
                }
                setTimeout(() => {
                    document.getElementById("status").innerHTML = "Save";
                }, 3000);
                // enable the save button
                document.getElementById("save_button").disabled = false;
                pause_editor(false);
            }
        });
        changed = false;
    });
};

$(document).on("click", "#new_file", function () {
    document.getElementById("id_filename").value = "";
    $('#add_file-modal').modal('show');
    setTimeout(() => {
        document.getElementById("id_filename").focus();
    }, 500);
});

$(document).on("click", "#submit_file", function () {
    // check the filename
    let filename = document.getElementById("id_filename").value;
    let filetype = document.getElementById("id_filetype").value;
    let ext;
    let re = /[a-zA-Z0-9\/]/g;
    filename = filename.replace(":", "").replace("-", "");
    if (!filename || !filetype) {
        alert("Please enter a file name");
        return false;
    } else if (filename.includes(".")) {
        ext = filename.split(".")[1];
        filename = filename.split(".")[0];
        if (['html', 'css', 'js', 'py'].includes(ext)) {
            filetype = ext;
        }
    }
    filename = (filename.match(re) || []).join('');
    if (filename.indexOf("/") !== -1) {
        let parts = filename.split("/");
        short = parts.pop();
    }
    let name = filename + "." + filetype;
    let id = filename + ":" + filetype;
    // check for duplicates
    if (document.getElementById(id)) {
        alert("File already exists");
        document.getElementById("id_filename").select();
        return false;
    }
    // add the file to the page
    refresh_editor(function () {
        add_file(name, id);
        $('#dynamic_directory').html('');
        build_directory(function () {
            $('.file[data-file="' + id + '"]').click();
            save_all();
        });
        $('#add_file-modal').modal('hide');
    });
});

$("#file_option_form").submit(function () {
    if (isNaN(document.getElementById("id_page").value)) {
        event.preventDefault();
        alert("Please save and refresh before changing the file");
        return false;
    }
});

$(document).on("click", ".folder", function () {
    $(this).toggleClass("closed"); // hide or show folder contents
});

let add_file = function (name, id) {
    let html = CODE_BOX.replace("filetype", id);
    $('#sources').append(html);
};

let build_directory = function (callback) {
    let main = document.getElementById("dynamic_directory");
    let current = main;
    $('.codeBox').each(function (i, source) {
        let id = source.dataset.value;
        let name = source.id;
        let filename = name.replace(':', '.');
        let file_options = FILE_BUTTON.replace('replace_name', filename);
        let folders = filename.split("/");
        let levels = folders.length;
        for (var x = 0; x < levels; x++) {
            if (x == levels - 1) { // file
                let file_btn = file_options.replace("replace_id", id);
                let li = '<li class="d-flex p-0"><button class="list-item-btn file" title="View ' + filename + ' file in editor" data-file="' + name + '">' + folders[x] + '</button>' + file_btn + '</li>';
                $(current).append(li);
            } else { // folder
                let exists = $(current).children('li[data-folder=' + folders[x] + ']')[0];
                if (!exists) {
                    let li = $('<li class="folder-container" data-folder="' + folders[x] + '"><button  type="button" class="folder btn btn-outline-light btn-sm text-left closed">' + folders[x] + '</button><ul class="contents"></ul></li>');
                    $(current).prepend(li);
                    current = li;
                } else {
                    current = exists;
                }
                // move current to the next list
                current = $(current).children('.contents').first();
            }
        }
        current = main;
    });
    if (callback) {
        callback();
    }
};

let new_tab = function () {
    let html = load_preview();
    let w = window.open("about:blank");
    w.document.open();
    w.document.write(html);
    w.document.close();
};

let refresh_editor = function (callback) {
    pause_editor(true);
    let id = $('#dynamic_directory li.active .file').first().data("file");
    if (id) {
        let current = editor.getValue();
        if (current != "loading") {
            document.getElementById(id).value = current;
        }
    }
    pause_editor(false);
    if (callback) {
        callback();
    }
};

let update_editor = function (id, callback) {
    let el = document.getElementById(id);
    if (!el) {
        return false;
    }
    refresh_editor(function () {
        let ext = id.split(":")[1];
        let type;
        let spaces = 2;
        if (ext == "html") {
            type = "htmlmixed";
        } else if (ext == "js") {
            type = "javascript";
        } else if (ext == "py") {
            type = "python";
            spaces = 4;
        } else {
            type = ext;
        }
        editor.getDoc().setValue(el.value);
        editor.setOption("mode", type);
        editor.setOption("indentUnit", spaces);
        // editor.setOption("autoCloseTags", false);
        $('.codeBox').removeClass('active');
        el.classList.add('active');
        if (callback) {
            callback();
        }
    });
};

$(document).on("click", "#submit_editor_settings", function () {
    // grab the settings values
    let autoCloseTags = document.getElementsByName("autoCloseTags")[0].checked;
    let autoCloseBrackets = document.getElementsByName("autoCloseBrackets")[0].checked;
    let lineWrapping = document.getElementsByName("lineWrapping")[0].checked;
    let theme = document.getElementById("themeSelect").value;

    // set values
    editor.setOption("autoCloseTags", autoCloseTags);
    editor.setOption("autoCloseBrackets", autoCloseBrackets);
    editor.setOption("lineWrapping", lineWrapping);
    editor.setOption("theme", theme);

    $('#editorSettings-modal').modal('hide');
});



// show file when clicked
$(document).on("click", ".file", function () {
    // update the dynamic directory
    let id = this.dataset.file;
    let el = this;
    let name = id.replace(':', '.');
    // update the editor
    let updated = changed;
    update_editor(id, function () {
        changed = updated;
        $('#dynamic_directory li').removeClass("active");
        $(el).parent().addClass("active");
        document.getElementsByClassName("active-file-name")[0].innerHTML = name;
        document.getElementById("fileSettings-modal-btn").title = 'Edit or delete ' + name;
    });
    setCookie("working_file", id);
});

$(document).on("click", ".file_options", function () {
    let id = this.dataset.value;
    let el = this.previousElementSibling;
    let name = $(el).text().replace(/\s/g, '');
    // show the options
    $('#id_page').val(id);
    $('#id_page_name').val(name);
    $('#delete-file-input').val('Delete ' + name);
    $('#fileSettings-modal .replace-file-name').html(name);
    $('#fileSettings-modal').modal('show', function () {
        $('#id_page_name').focus();
    });
});

////////////////////////////////////// ANALYTICS DATA

var update_data = function (item, callback) {
    let time = item + "_time";
    let seconds = item + "_seconds";
    let data = {};
    let element;
    if (item == "lesson") {
        element = "cms_editor";
    } else {
        element = item
    }
    TimeMe.stopTimer(element);
    data["csrfmiddlewaretoken"] = activity_data["csrfmiddlewaretoken"];
    data[item] = activity_data[item];
    data[time] = activity_data[time];
    data[seconds] = Math.round(TimeMe.getTimeOnPageInSeconds(element)) || 0;
    TimeMe.resetRecordedPageTime(element);
    // console.log('Sending data to CMS:', item, data[item], data[time], data[seconds])
    $.post("/account/data.update/", data);
    if (callback) {
        callback();
    }
};

var add_data = function (id, item) {
    console.log('Starting timer for', item);
    let time = item + "_time";
    activity_data[item] = id;
    activity_data[time] = Math.round(Date.now() / 1000);
    if (item == "lesson") {
        TimeMe.trackTimeOnElement("cms_editor");
    } else {
        TimeMe.startTimer(item);
    }
};

var update_duration = function (id, item) {
    if (!timer_active) {
        return false;
    }
    if (activity_data[item]) {
        update_data(item, function () {
            if (id) {
                add_data(id, item);
            } else { // reset the tracking
                activity_data[item] = null;
            }
        });
    } else {
        if (id) {
            add_data(id, item);
        }
    }
};

var stop_timers = function (callback) {
    if (activity_data["page"]) {
        activity_data["page_seconds"] = Math.round(TimeMe.getTimeOnPageInSeconds("page")) || 0;
    }
    if (activity_data["lesson"]) {
        activity_data["lesson_seconds"] = Math.round(TimeMe.getTimeOnPageInSeconds("cms_editor")) || 0;
    }
    if (activity_data["checkpoint"]) {
        activity_data["checkpoint_seconds"] = Math.round(TimeMe.getTimeOnPageInSeconds("checkpoint")) || 0;
    }
    if (activity_data["question"]) {
        activity_data["question_seconds"] = Math.round(TimeMe.getTimeOnPageInSeconds("question")) || 0;
    }
    if (callback) {
        callback();
    }
};

var send_updates = function () {
    stop_timers(function () {
        let form = new FormData();
        for (var key in activity_data) {
            let data = activity_data[key];
            if (data) {
                form.append(key, data);
            }
        }
        navigator.sendBeacon("/account/data.update_all/", form);
    });
};

///////////////////////////////////// CURRICULUM SECTION

$(document).on("change", "#select_course", function () {
    remember_course();
});

let remember_course = function (lesson) {
    let id;
    if (lesson && document.getElementById("checkpoint_" + lesson)) {
        id = $('#checkpoint_' + lesson).data("course");
        document.getElementById("select_course").value = id;
    } else {
        id = document.getElementById("select_course").value;
    }
    $('.accordion_container').hide();
    $('#accordion_' + id).show();
};

let show_courses = function (callback) {
    let el = document.getElementById("curriculum_sections");
    $('#challenges').hide();
    $(el).show();
    if (el && !el.innerHTML) {
        $('#build_curriculum').hide();
        el.innerHTML = LOADING;
        $(el).load('/library/partial.get_units/', function () {
            let lesson = getCookie("lesson");
            remember_course(lesson);
            if (callback) {
                callback();
            }
        });
    } else if (el) {
        $('#build_curriculum').hide();
        $(el).show();
        if (callback) {
            callback();
        }
    }
};

let grade_code = function (data) {
    let url;
    if (data["kind"] == "py") {
        url = "/account/grade.python/";
    } else if (data["kind"] == "js") {
        url = "/account/grade.javascript/";
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response) {
            if (response == "complete") {
                // everything is done
            } else {
                document.getElementById("grade_response").innerHTML = response;
            }
        }
    });
};

// show the checkpoint
$(document).on("click", ".show_checkpoint", function () {
    let el = this.nextSibling;
    $(this).remove();
    $(el).slideDown();
    $('#curriculum_content').animate({
        scrollTop: el.offsetTop - 75
    }, 500);
    let id = this.dataset.checkpoint;
    update_duration(id, "checkpoint");
});

// grade the checkpoint
$(document).on("click", ".check_code", function () {
    let container = $(this).closest('.checkpoint_section')[0];
    let id = container.id.split("_")[1];
    let kind = this.id.split("_")[1];
    let url = "/account/grade.checkpoint_new/" + id + "/";
    let code = "";
    if ($(this).hasClass("compiled")) {
        code = load_preview();
    } else {
        code = editor.getValue();
    }
    let button = this;
    let html = button.innerHTML;
    button.style.width = "100%";
    button.innerHTML = "Checking...";
    button.disabled = true;
    data = {
        csrfmiddlewaretoken: document.getElementById("csrf").value,
        code: code
    }
    // check for grader type
    if (kind !== "regex") {
        data["id"] = id;
        data["kind"] = kind;
        grade_code(data);
        return;
    }
    $.ajax({
        type: "POST",
        url: url,
        data: data,
        success: function (response) {
            if (typeof response == 'string') {
                alert("Try Again")
            } else if (response['status'] == "complete" || response['status'] == "all") {
                $('.check_' + id).addClass('complete');
                $('.requirement').addClass("complete");
                update_duration(0, "checkpoint");
                if (response['status'] == "complete") {
                    alert("Congrats! You passed all requirements and earned " + response['lesson_points'] + " points!");
                    // update points on the page
                    let currentScore = document.getElementsByClassName("profile-points")[0];
                    let total_points = parseInt(currentScore.innerHTML) + parseInt(response['lesson_points']);
                    if (response['unit_complete'] == true) {
                        alert("Wahoo! All of your hard work paid off and you earned " + response['unit_points'] + " extra points for completing a unit!");
                        total_points += parseInt(response['unit_points']);
                    }
                    currentScore.innerHTML = total_points;
                } else {
                    alert("Nice! You passed all requirements again! Practice makes perfect.");
                }
                $('#grade_response').hide();
                document.getElementById("grade_response").innerHTML = '';
                $('.next').removeAttr('disabled');
                $('.show_quiz').removeAttr('disabled');
                button.classList.add("btn-outline-success");
                button.innerHTML = "Complete!";
            } else {
                $('.requirement').removeClass("complete");
                let hint = response['hint'];
                response = response['passed'];
                for (var i = 0; i < response.length; i++) {
                    $('#req_' + response[i]).addClass("complete");
                }
                $('#grade_response').addClass('alert alert-warning');
                $('#grade_response').show();
                document.getElementById("grade_response").innerHTML = hint;
                button.classList.add("btn-outline-danger");
                button.innerHTML = "Check Requirements and Try Again";
            }
            setTimeout(() => {
                if (button.innerHTML != "Complete!") {
                    button.style.width = "auto";
                    button.classList.remove("btn-outline-danger");
                    button.disabled = false;
                    button.innerHTML = html;
                }
            }, 4000);
        }
    });
});

$(document).on("click", ".show_quiz", function () {
    let id = this.id.split("_")[1];
    let container = $('#build_curriculum');
    $(container).slideUp();
    $('#curriculum_quiz').html(LOADING);
    $('#curriculum_quiz').show();
    $.get('/library/quiz.show/' + id + '/', function (response) {
        if (response == "checkpoint") {
            $('#curriculum_quiz').html('');
            alert("You must complete the checkpoint first");
            $(container).slideDown(function () {
                container.scrollTop = container.scrollHeight;
            });
        } else if (response == "locked") {
            alert("You have not unlocked this section yet");
        } else if (response == "done") {
            $('#curriculum_quiz').html('');
            next_section();
        } else {
            $('#curriculum_quiz').html(response);
            if (document.getElementById("debugging_section")) {
                init_debug();
            }
            let question = document.getElementById("question_text");
            if (question) {
                let question_id = question.dataset.question;
                update_duration(question_id, "question");
            }
        }
    });
});

let init_debug = function () {
    let debug_code = document.getElementById("debug_code");
    debug = CodeMirror.fromTextArea(debug_code, {
        lineNumbers: true,
        lineWrapping: true,
        mode: "htmlmixed",
        theme: "neo",
        autoCloseTags: true
    });
};

$(document).on("click", "#reset_debug", function () {
    let original_code = document.getElementById("debug_code").value;
    debug.setValue(original_code);
});

$(document).on("submit", "#quiz_form", function () {
    let id = document.getElementById("id_question").value;
    event.preventDefault();
    let button = document.getElementById("submit_quiz");
    let feedback = document.getElementById("quiz_feedback");
    let next_step = document.getElementById("next_step");
    button.disabled = true;
    // add debug if exists
    let debug_code = document.getElementById("debug_code");
    if (debug_code) {
        debug_code.value = debug.getValue();
    }
    let form = document.getElementById("quiz_form");
    $('#quiz_form input[name=csrfmiddlewaretoken]').val(document.getElementById("csrf").value);
    $.ajax({
        type: "POST",
        url: "/account/grade.quiz_new/",
        data: $(form).serialize(),
        success: function (response) {
            if (response == "correct") {
                feedback.innerHTML = "Correct!";
                next_step.innerHTML = "Next Question";
                $(next_step).show();
                update_duration(id, "question");
            } else if (response == "complete") {
                feedback.innerHTML = "Correct! You've finished the quiz.";
                next_step.innerHTML = "Next Section";
                $(next_step).show();
                document.getElementsByClassName("show_quiz")[0].disabled = true;
                $('.checkpoint.active').addClass("complete");
                update_duration(id, "question");
            } else {
                feedback.innerHTML = "<em style='color: red;'>Incorrect. Try again.</em>";
                button.disabled = false;
            }
        } // end success
    });
});

$(document).on("click", "#next_step", function () {
    if (this.innerHTML == "Next Section") {
        document.getElementById("curriculum_quiz").innerHTML = "";
        next_section();
    } else {
        $('.quiz_section').remove();
        $('.show_quiz').trigger("click");
    }
});

let next_section = function () {
    let id = document.getElementById("cms_editor").dataset.lesson;
    show_courses(function () {
        let el = document.getElementById("checkpoint_" + id);
        if (el && el.nextElementSibling) {
            $(el.nextElementSibling).trigger("click");
        } else {
            el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }
    });
};

let prev_section = function () {
    let id = document.getElementById("cms_editor").dataset.lesson;
    show_courses(function () {
        let el = document.getElementById("checkpoint_" + id);
        if (el && el.previousElementSibling) {
            $(el.previousElementSibling).trigger("click");
        } else {
            el.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        }
    });
};

$(document).on("click", ".checkpoint", function () {
    let id = this.id.split("_")[1];
    setCookie("lesson", id);
    $('.checkpoint').removeClass("active");
    $('#show_options').removeClass("opened");
    $(this).addClass("active");
    $('#curriculum_sections').hide();
    get_lesson(id);
    $('#build_curriculum').show();
});

// show the extra material
$(document).on("click", "#show_extra", function () {
    this.remove();
    let data = editjs.configuration.data;
    data.blocks = data.blocks.concat(extra_blocks);
    extra_blocks = undefined;
    editjs.clear();
    editjs.render(data);
});

let build_details = function (data) {
    $('#lesson_checkpoint').show();
    if (!data || !data.hasOwnProperty("checkpoint") || !data.checkpoint.hasOwnProperty("requirements")) {
        document.getElementById("lesson_checkpoint").innerHTML = "<p class='text-center'>Checkpoint Not Available</p>";
        return;
    }
    let reqs = '';
    let quiz = '';
    let req;
    // check for quiz
    if (data["quiz"]) {
        quiz = QUIZ_BUTTON.replace("lesson_id", data["lesson_id"]);
    }
    // build requirements list
    let requirements = data["checkpoint"]["requirements"];
    for (var i = 0; i < requirements.length; i++) {
        req = REQUIREMENT.replace("requirement_id", requirements[i]["id"]);
        req = req.replace("checkpoint_id", data["checkpoint"]["id"]);
        req = req.replace('replace_text', requirements[i]["text"]);
        reqs += req;
    }
    let html = "";
    // add "READ MORE" to page if exists
    if (extra_blocks !== undefined) {
        html += '<div class="text-center"><button id="show_extra" class="btn btn-link pb-4">Read More</button></div>';
    }
    html += CHECKPOINT;
    html = html.replace(/checkpoint_id/g, data["checkpoint"]["id"]);
    html = html.replace(/replace_complete/g, "");
    html = html.replace(/checkpoint_name/g, data["checkpoint"]["name"]);
    html = html.replace(/checkpoint_description/g, data["checkpoint"]["description"]);
    html = html.replace(/replace_requirements/g, reqs);
    html = html.replace(/replace_kind/g, data["checkpoint"]["kind"]);
    html = html.replace(/replace_compiled/g, data["checkpoint"]["compiled"]);
    html = html.replace("quiz_button", quiz);
    document.getElementById("lesson_checkpoint").innerHTML = html;
};

let read_only = function () {
    let el = document.querySelectorAll('[contenteditable=true]');
    for (var i = 0; i < el.length; i++) {
        $(el[i]).attr('contenteditable', 'false');
    }
    $('.ce-toolbar').remove();
    $('.ce-inline-toolbar').remove();
    $('.ce-conversion-toolbar').remove();
};

$(document).on("keydown", "#cms_editor", function () {
    event.preventDefault();
    return false;
});

var update_tags = function () {
    $('.ce-code__textarea').each(function (i, item) {
        item.value = item.value.replace(/&lt/g, '<').replace(/&gt/g, '>');
    });
};

let show_options = function () {
    let el = $('.option.active')[0];
    show_courses();
};

$(document).on("click", "#show_options", function () {
    $('#curriculum_quiz').hide();
    // update the quiz
    update_duration(0, "question");
    if ($(this).hasClass("opened")) {
        $("#curriculum_sections").hide();
        $("#options").hide();
        $("#build_curriculum").slideDown();
        $(this).removeClass("opened");
    } else if ($("#options").is(":visible")) {
        this.click();
    } else {
        show_options();
        $(this).addClass("opened");
    }
});

let load_lesson = function (data, callback) {
    extra_blocks = undefined;
    if (!data) {
        $('#show_options').trigger('click');
        return false;
    }
    if (data.hasOwnProperty("details")) {
        details = data["details"];
        delete data["details"];
    }
    for (var i = 0; i < data["blocks"].length; i++) {
        if (data["blocks"][i]["type"] == "delimiter") {
            extra_blocks = data["blocks"].splice(i);
            break;
        }
    }
    if (editjs) {
        editjs.render(data);
    } else {
        editjs = new EditorJS({
            holder: 'cms_editor',
            tools: {
                header: {
                    class: Header,
                    inlineToolbar: ['link'],
                    config: {
                        placeholder: 'Header'
                    },
                    shortcut: 'CMD+SHIFT+H'
                },
                image: {
                    class: SimpleImage,
                    inlineToolbar: ['link'],
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                    shortcut: 'CMD+SHIFT+L'
                },
                checklist: {
                    class: Checklist,
                    inlineToolbar: true,
                },
                quote: {
                    class: Quote,
                    inlineToolbar: true,
                    config: {
                        quotePlaceholder: 'Enter a quote',
                        captionPlaceholder: 'Quote\'s author',
                    },
                    shortcut: 'CMD+SHIFT+O'
                },
                warning: Warning,
                marker: {
                    class: Marker,
                    shortcut: 'CMD+SHIFT+M'
                },
                code: {
                    class: CodeTool,
                    shortcut: 'CMD+SHIFT+C'
                },
                delimiter: Delimiter,
                inlineCode: {
                    class: InlineCode,
                    shortcut: 'CMD+SHIFT+C'
                },
                linkTool: LinkTool,
                embed: Embed,
                table: {
                    class: Table,
                    inlineToolbar: true,
                    shortcut: 'CMD+ALT+T'
                },
            },
            data: data,
            // initialBlock: 'paragraph',
            onReady: function () {
                build_details(details);
                $('#curriculum_nav').show();
                read_only();
                update_tags();
                glossary_links();
                if (callback) {
                    callback();
                }
            },
            onChange: function () {
                build_details(details);
                $('#curriculum_nav').show();
                read_only();
                update_tags();
                glossary_links();
            }
        });
    }
};

let get_lesson = function (id, callback) {
    id = id || getCookie("lesson");
    if (!id) {
        show_courses();
        return false;
    }
    $('#lesson_checkpoint').hide();
    $('#curriculum_nav').hide();
    $('#options').hide();
    if (editjs) {
        editjs.clear();
    }
    $.get('/library/lesson/' + id + '/', function (data) {
        load_lesson(data, callback);
    });
    document.getElementById("cms_editor").dataset.lesson = id;
    gtag('event', 'lesson_dimension', {
        'lesson': id
    });
    update_duration(id, "lesson");
    update_duration(0, "checkpoint");
}

// glossary tooltip
$(document).on("mouseenter", "a[href*='#']", function () {
    let hash = this.href;
    hash = hash.split('#')[1];
    if (glossary && hash in glossary) {
        var tip = tippy(this, {
            content: glossary[hash].definition,
            // placement: 'right',
            animation: 'shift-away',
            theme: 'skillstruck',
            arrow: tippy.roundArrow,
            trigger: 'manual'
        });
        let hover;
        this.addEventListener("click", function () {
            if (tip) {
                tip.show();
            }
            hover = false;
        });
        this.addEventListener("mouseenter", function () {
            if (tip) {
                tip.show();
            }
            hover = true;
        });
        this.addEventListener("mouseleave", function () {
            if (tip && hover === true) {
                tip.hide();
            }
        });
        // for accessibility
        this.addEventListener("focus", function () {
            if (tip) {
                tip.show();
            }
            hover = false;
        });
        this.addEventListener("blur", function () {
            if (tip) {
                tip.hide();
            }
        });
    }
});

let glossary_links = function () {
    $('a[href*="#"]').css("text-decoration", "none");
};

// runs when the page is loaded
$(document).ready(function () {
    // load the curriculum
    get_lesson(initial_lesson);
    // update the frame
    frame = document.getElementById("frame_container").innerHTML;
    // initialize the editor
    let code = document.getElementById("main_editor");
    editor = CodeMirror.fromTextArea(code, {
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: false,
        mode: "htmlmixed",
        theme: "default",
        autoCloseTags: true
    });
    editor.on("change", function () {
        changed = true;
    });
    editor.on("focus", function () {
        let el = document.getElementById("files-menu-btn");
        if (!$(el).hasClass("collapsed")) {
            el.click();
        }
    });
    // build the file directory
    build_directory(function () {
        // load the first file into the editor
        let file = getCookie("working_file");
        if (file && document.getElementById(file)) {
            $('.file[data-file="' + file + '"]').click();
        } else if ($('.file[data-file*="html"]')) {
            $('.file[data-file*="html"]').click();
        } else {
            document.getElementsByClassName("file")[0].click();
        }
        // load the preview of the first file
        load_preview();
    });
    // reset the initial changed value
    changed = false;
    // autosave
    setInterval(() => {
        if (changed) {
            save_all();
            changed = false;
        }
    }, 15000);
    // update the folder cookie
    let folder_id = document.getElementById("id_folder").value;
    setCookie("folder", folder_id);
    // initialize the timer
    try {
        TimeMe.initialize({
            currentPageName: "code-page",
            idleTimeoutInSeconds: 30
        });
    } catch {
        timer_active = false;
    }
    update_duration("code", "page");
});