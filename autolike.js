// ==UserScript==
// @name         AutoLike
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Likes everything on Instagram
// @author       jamhed
// @match        https://www.instagram.com/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/jamhed/inst/master/autolike.js
// @grant        none
// ==/UserScript==
/* jshint -W097 */
'use strict';

var base = 'https://kv.jamhed.tk/key/730abe4f-3e7c-4062-99eb-05e6634d2b4a/';

function store(uid, value, button) {
    $.ajax({
        url: base + uid + '?ttl=keep',
        type: 'PUT',
        data: JSON.stringify({ date: Date.now(), counter: value }),
        contentType: "application/json",
        processData: false,
        success: function() {
            console.log("click", uid);
            $(button)[0].click();
        }
    });
}

function check(uid, button) {
    if ($(button).text() != "Like") {
        return;
    }
    console.log("check:" + uid);
    $.ajax({
        url: base + uid,
        type: 'GET',
        success: function(obj) {
            console.log("found", uid, obj);
            try {
                if  (obj && obj.value < 10 && Date.now() - obj.stamp > 86400) {
                    store(uid, obj.counter+1, button);
                }
            }
            catch(e) {
                console.log("ex", uid, e);
                store(uid, 1, button);
            }
        },
        error: function(result) {
            console.log("not_found", uid);
            store(uid, 1, button);
        }
    });
}

setTimeout(function() {
    var ids = $("article div section a").filter(function(i, a) { return $(a).attr("href") === "/"+$(a).html()+"/" });
    var buttons = $("article div section a[role='button']");
    ids.map(function (i, e) {
        check($(ids[i]).html(), buttons[i]);
    });
}, 3000);

setTimeout(function() { window.close() }, 16000);