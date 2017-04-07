// ==UserScript==
// @name         AutoLike
// @namespace    http://tampermonkey.net/
// @version      0.2.5
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
var cache = {};

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
    var Text = $(button).text();
    if (Text != "Like") {
        console.log("skip:", uid, Text);
        return;
    }
    console.log("request info:", uid);
    if (cache.uid) {
        console.log("already requested, skip:", uid);
    }
    cache.uid = true;
    $.ajax({
        url: base + uid,
        type: 'GET',
        success: function(obj) {
            console.log("found", uid, obj.counter, Date.now() - obj.date);
            try {
                if  (obj && (obj.counter < 10) && (Date.now() - obj.date > 86400000)) {
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
    var ids = $("section div div article header a").filter(function(i, a) { return $(a).attr("href") === "/"+$(a).html()+"/" });
    var buttons = $("article div section a[role='button']");
    ids.map(function (i, e) {
        check($(ids[i]).html(), buttons[i]);
    });
}, 3000);

setTimeout(function() { window.close() }, 16000);