// ==UserScript==
// @name         AutoFollow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofollow user
// @author       jamhed
// @match        https://www.instagram.com/*/
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/jamhed/inst/master/autofollow.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
var req = 0;

function store(id, obj) {
    $.ajax({
        url: 'https://kv.jamhed.tk/key/9a7ae90c-5f73-4ca5-b848-4f3c78c423a4/' + id + '?ttl=keep',
        type: 'PUT',
        data: JSON.stringify(obj),
        contentType: "application/json",
        processData: false
    });
}

function save_result(state, data) {
    var is_private = window._sharedData.entry_data.ProfilePage[0].user.is_private;
    var uid = window._sharedData.entry_data.ProfilePage[0].user.id;
    store(uid, {state: state, data: data, private: is_private});
}

function onError(data, status, xhr) {
    save_result("error", data);
    $("button").parent().html("ERROR");
}

function onSuccess(data, status, xhr) {
    save_result("success", data);
    $("button").parent().html("SUCCESS");
}

function unfollow() {
    var Button = $("button:contains('Following')");
    if (Button.html() ===  "Following") {
        var Ajax = jQuery.ajax;
        jQuery.ajax = function (param) {
            if (param.url.search(/follow/) > 0) {
                param.success = onSuccess;
                param.error = onError;
                Ajax(param);
            } else {
                return Ajax.apply(this, arguments);
            }
        };
        Button.click();
    }
}

function follow() {
    var Button = $("button:contains('Follow')");
    if (Button.html() ===  "Follow") {
        var Ajax = jQuery.ajax;
        jQuery.ajax = function (param) {
            if (param.url.search(/follow/) > 0) {
                param.success = onSuccess;
                param.error = onError;
                Ajax(param);
            } else {
                return Ajax.apply(this, arguments);
            }
        };
        Button.click();
    }
    if ($("button:contains('Following')")) {
        save_result("success", "following");
    };
    if ($("button:contains('Requested')")) {
        save_result("success", "requested");
    };
}

setTimeout(function() {

}, 1000);

setTimeout(function() {
    window.close();
}, 8000);
