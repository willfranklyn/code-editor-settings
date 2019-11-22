# Skill Struck Code Page

## Assignment:
* Add a settings/configuration option for the code editor

## Description:
* We want to allow users to customize the settings to their preferences
* The most important setting we need is the option to enable/disable "autoCloseTags"
* Any other settings that may be useful to users should also be included
* The settings should be easily accessible (such as a settings icon in the nav bar)

## Starting Tips:
* The main files to look at will be: "skillstruck.htm" and "all_code.js"
* The code editor is initialized when the page loads, and is a global variable that can be modified
* The code editor has some default settings on line number 1106 of "all_code.js"
* The way to update preferences can be seen on line number 410 of "all_code.js" (using `editor.setOption`)
* Check the CodeMirror manual for configuration options that may be useful

## Resources:
* CodeMirror is the open source editor that we use: https://codemirror.net/doc/manual.html
* Bootstrap Modal: https://getbootstrap.com/docs/4.0/components/modal/
* jQuery: https://api.jquery.com/