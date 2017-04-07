// ==UserScript==
// @name         TagLike
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  AutoLike
// @author       jamhed
// @match        https://www.instagram.com/explore/tags/*/
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL  https://raw.githubusercontent.com/jamhed/inst/master/taglike.js
// @grant window.close
// ==/UserScript==
/* jshint -W097 */
'use strict';
setTimeout(window.close, 46000);

var base = 'https://kv.jamhed.tk/key/d30d0463-639e-42f5-93ed-cd126a179636/';
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
    $("article > div:last a > div:first").click();
    LikeNext(20);
}, 2000);

setTimeout(function() {
    $("button").filter(function(i, a) { return $(a).text() === 'Close' })[0].click();
}, 44000);

function LikeNext(N) {
    if (N <= 0) {
        return;
    } else {
        setTimeout(function() {
            if($("a:contains('#czechboy')")[0] ||
               $("a:contains('#polishgirl')")[0] || 
               $("div:contains('go to the site')")[0] || 
               $("a:contains('#recent4recent')")[0] ||
               $("a:contains('bored')")[0] ||
               $("span:contains('CLick')")[0] ||
               $("span:contains('Click')")[0] ||
               $("span:contains('click')")[0] ||
               $("div:contains(' slut')")[0] ||
               $("span:contains('CLICK')")[0]) {
                console.log("spammer");
            } else {
                var uid = $("article header div a").html();
                var like_button = $("a").filter(function(i, a) { return $(a).text() === 'Like' })[0];
                check(uid, like_button);
            }
        }, 2000);
        setTimeout(function() {
            $("a").filter(function(i, a) { return $(a).text() === 'Next' })[0].click()
            LikeNext(N-1);
        }, 3500);
    }
}