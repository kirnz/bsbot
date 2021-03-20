// ==UserScript==
// @name           Dub+ (Temporary QueUp Fix by Mozzle)
// @namespace      https://github.com/DubPlus/DubPlus/
// @description    Autorun Dub+ (Mozzle Temp QueUp fix) on dubtrack.fm
// @author         MBSURFER, CISCOG, Mozzle (fix)
// @include        https://*.dubtrack.fm/*
// @version        1.3.1
// @grant          none
// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @require        https://www.dubtrack.fm/assets/js/plugins/fn.jquery.js
// @require        https://www.dubtrack.fm/assets/js/plugins/jquery.multisortable.js
// ==/UserScript==

setTimeout(function(){ 
    $.getScript('https://cdn.jsdelivr.net/gh/DubPlus/DubPlus/dubplus.min.js');
}, 1000);