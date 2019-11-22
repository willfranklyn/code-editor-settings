// global variables
let autoCheck = false;
// HIDE DARK COVER ON CLICK
$(document).on("click", ".dark-cover", function () {
    $('.centered').fadeOut();
    $('.dark-cover').fadeOut();
});

// GET LAST PROJECT WHEN CLICK ON FILE
$(document).on("click", "#nav_code", function () {
    event.preventDefault();
    let getCookie = function (name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    let id = getCookie("folder");
    if (id) {
        document.cookie = "folder=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
        window.location.href = "/student/code/" + id + "/";
    } else {
        window.location.href = "/student/code/";
    }
});

let hide = function (id) {
    let el = document.getElementById(id);
    $(el).slideUp();
};

// get the token to log in to firebase live chat
let live_chat = function (token) {
    console.log(token);
};

// show the help section
let show_help = function () {
    // load the help content
    let el = document.getElementById("help_section_content");
    let container = document.getElementById("help_section");
    if (!el.innerHTML.length) {
        $(el).html('Loading . . .');
        // $(el).load('/student/partial.question/', function () {
        $(el).load('/account/support/', function () {
            el.scrollTop = el.scrollHeight;
        });
        $(container).slideDown();
        // add live chat
        $.get('/account/token.access/', function (token) {
            live_chat(token);
        });
    } else {
        $(container).slideDown();
    }
};

$(document).on("click", "#submit_help_form", function () {
    let form = document.getElementById("help_form");
    let message = document.getElementById("id_help_question").value;
    let email = document.getElementById("id_help_email");
    $.ajax({
        type: "POST",
        url: "/student/help/",
        data: $(form).serialize(), // serializes the form's elements.
        success: function (data) {
            if (data.startsWith("success")) {
                $('#help_section_content').append('<li class="sent">' + message + '</li>');
                autoCheck = true;
            } else {
                $('#help_section_content').append('<li>' + data + '</li>');
            }
            document.getElementById("id_help_question").value = "";
            if (email) {
                document.getElementById("user_email").innerHTML = "<p>Your Email: " + email.value + "</p>";
            }
        }
    });
});

// hide message when clicked
$(document).on("click", ".message", function () {
    $(this).fadeOut();
});

if (document.getElementById("message_container")) {
    setTimeout(() => {
        $('#message_container li:not(.info)').fadeOut();
    }, 4000);
}

// auto resize textarea
$('textarea').each(function () {
    this.setAttribute('style', 'height:60px;overflow-y:hidden;');
}).on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// function to periodically check for updates
setInterval(() => {
    if (autoCheck) {
        $.get("/account/updates/", function (data) {
            if (data) {
                for (var i = 0; i < data.length; i++) {
                    $('#help_section_content').append('<li class="received">' + data[i]['message'] + '</li>');
                }
                let object = document.getElementById("help_section_content");
                object.scrollTop = object.scrollHeight;
            }
        });
    }
}, 15000);