(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw ((f.code = "MODULE_NOT_FOUND"), f);
            }
            var l = (n[o] = { exports: {} });
            t[o][0].call(
                l.exports,
                function (e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                },
                l,
                l.exports,
                e,
                t,
                n,
                r
            );
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})(
    {
        1: [
            function (require, module, exports) {
                "use strict";
                var _waitFor = require("./utils/waitFor.js"),
                    _waitFor2 = _interopRequireDefault(_waitFor),
                    _preload = require("./utils/preload.js"),
                    _preload2 = _interopRequireDefault(_preload);
                function _interopRequireDefault(a) {
                    return a && a.__esModule ? a : { default: a };
                }
                var modal = require("./utils/modal.js"),
                    init = require("./lib/init.js"),
                    css = require("./utils/css.js");
                function errorModal(a) {
                    css.load("/css/dubplus.css"), modal.create({ title: "Dub+ Error", content: a });
                }
                if (!window.dubplus) {
                    (0, _preload2.default)();
                    var checkList = ["QueUp.session.id", "QueUp.room.chat", "QueUp.Events", "QueUp.room.player", "QueUp.helpers.cookie", "QueUp.room.model", "QueUp.room.users"],
                        _dubplusWaiting = new _waitFor2.default(checkList, { seconds: 10 });
                    _dubplusWaiting
                        .then(function () {
                            init(), $(".dubplus-waiting").remove();
                        })
                        .fail(function () {
                            QueUp.session.id ? $(".dubplus-waiting span").text("Something happed, refresh and try again") : errorModal("You're not logged in. Please login to use Dub+ (QueUp fix by Mozzle).");
                        });
                } else QueUp.session.id ? errorModal("Dub+ is already loaded") : errorModal("You're not logged in. Please login to use Dub+ (QueUp fix by Mozzle).");
            },
            { "./lib/init.js": 4, "./utils/css.js": 40, "./utils/modal.js": 42, "./utils/preload.js": 46, "./utils/waitFor.js": 47 },
        ],
        2: [
            function (require, module, exports) {
                "use strict";
                var GetJSON = require("../utils/getJSON.js"),
                    settings = require("../lib/settings.js");
                !(function () {
                    function a(g, h) {
                        return c
                            ? void (c.transaction("s").objectStore("s").get(g).onsuccess = function (i) {
                                  var j = (i.target.result && i.target.result.v) || null;
                                  h(j);
                              })
                            : void setTimeout(function () {
                                  a(g, h);
                              }, 100);
                    }
                    var b = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
                    if (!b) return void console.error("indexDB not supported");
                    var c,
                        d = { k: "", v: "" },
                        f = b.open("d2", 1);
                    (f.onsuccess = function () {
                        c = this.result;
                    }),
                        (f.onerror = function (g) {
                            console.error("indexedDB request error"), console.log(g);
                        }),
                        (f.onupgradeneeded = function (g) {
                            c = null;
                            var h = g.target.result.createObjectStore("s", { keyPath: "k" });
                            h.transaction.oncomplete = function (i) {
                                c = i.target.db;
                            };
                        }),
                        (window.ldb = {
                            get: a,
                            set: function set(g, h) {
                                (d.k = g), (d.v = h), c.transaction("s", "readwrite").objectStore("s").put(d);
                            },
                        });
                })();
                var prepEmoji = {};
                (prepEmoji.emoji = {
                    template: function template(a) {
                        return emojify.defaultConfig.img_dir + "/" + encodeURI(a) + ".png";
                    },
                }),
                    (prepEmoji.twitch = {
                        template: function template(a) {
                            return "//static-cdn.jtvnw.net/emoticons/v1/" + a + "/3.0";
                        },
                        specialEmotes: [],
                        emotes: {},
                        chatRegex: /:([-_a-z0-9]+):/gi,
                    }),
                    (prepEmoji.bttv = {
                        template: function template(a) {
                            return "//cdn.betterttv.net/emote/" + a + "/3x";
                        },
                        emotes: {},
                        chatRegex: /:([&!()\-_a-z0-9]+):/gi,
                    }),
                    (prepEmoji.tasty = {
                        template: function template(a) {
                            return this.emotes[a].url;
                        },
                        emotes: {},
                    }),
                    (prepEmoji.frankerFacez = {
                        template: function template(a) {
                            return "//cdn.frankerfacez.com/emoticon/" + a + "/1";
                        },
                        emotes: {},
                        chatRegex: /:([-_a-z0-9]+):/gi,
                    }),
                    (prepEmoji.shouldUpdateAPIs = function (a, b) {
                        ldb.get(a + "_api", function (d) {
                            if (d) {
                                var f = JSON.parse(d);
                                "undefined" != typeof f.error && b(!0);
                            }
                            var g = Date.now(),
                                h = parseInt(localStorage.getItem(a + "_api_timestamp"));
                            b(isNaN(h) || g - h > 5 * 8.64e7 || !d);
                        });
                    }),
                    (prepEmoji.loadTwitchEmotes = function () {
                        var a;
                        this.shouldUpdateAPIs("twitch", function (b) {
                            if (b) {
                                console.log("dub+", "twitch", "loading from api");
                                var c = new GetJSON("https://cors-anywhere.herokuapp.com/api.twitch.tv/kraken/chat/emoticon_images", "twitch:loaded", {
                                    Accept: "application/vnd.twitchtv.v5+json",
                                    "Client-ID": "z5bpa7x6y717dsw28qnmcooolzm2js",
                                });
                                c.done(function (d) {
                                    var f = JSON.parse(d),
                                        g = {};
                                    f.emoticons.forEach(function (h) {
                                        g[h.code] ? null === h.emoticon_set && (g[h.code] = h.id) : (g[h.code] = h.id);
                                    }),
                                        localStorage.setItem("twitch_api_timestamp", Date.now().toString()),
                                        ldb.set("twitch_api", JSON.stringify(g)),
                                        prepEmoji.processTwitchEmotes(g);
                                });
                            } else
                                ldb.get("twitch_api", function (d) {
                                    console.log("dub+", "twitch", "loading from IndexedDB"), (a = JSON.parse(d)), prepEmoji.processTwitchEmotes(a), (a = null);
                                    var f = new Event("twitch:loaded");
                                    window.dispatchEvent(f);
                                });
                        });
                    }),
                    (prepEmoji.loadBTTVEmotes = function () {
                        var a;
                        this.shouldUpdateAPIs("bttv", function (b) {
                            if (b) {
                                console.log("dub+", "bttv", "loading from api");
                                var c = new GetJSON("//api.betterttv.net/2/emotes", "bttv:loaded");
                                c.done(function (d) {
                                    var f = JSON.parse(d),
                                        g = {};
                                    f.emotes.forEach(function (h) {
                                        g[h.code] || (g[h.code] = h.id);
                                    }),
                                        localStorage.setItem("bttv_api_timestamp", Date.now().toString()),
                                        ldb.set("bttv_api", JSON.stringify(g)),
                                        prepEmoji.processBTTVEmotes(g);
                                });
                            } else
                                ldb.get("bttv_api", function (d) {
                                    console.log("dub+", "bttv", "loading from IndexedDB"), (a = JSON.parse(d)), prepEmoji.processBTTVEmotes(a), (a = null);
                                    var f = new Event("bttv:loaded");
                                    window.dispatchEvent(f);
                                });
                        });
                    }),
                    (prepEmoji.loadTastyEmotes = function () {
                        var a = this;
                        console.log("dub+", "tasty", "loading from api");
                        var b = new GetJSON(settings.srcRoot + "/emotes/tastyemotes.json", "tasty:loaded");
                        b.done(function (c) {
                            ldb.set("tasty_api", JSON.stringify(c)), a.processTastyEmotes(JSON.parse(c));
                        });
                    }),
                    (prepEmoji.loadFrankerFacez = function () {
                        var a;
                        this.shouldUpdateAPIs("frankerfacez", function (b) {
                            if (b) {
                                console.log("dub+", "frankerfacez", "loading from api");
                                var c = new GetJSON("//cdn.jsdelivr.net/gh/Jiiks/BetterDiscordApp/data/emotedata_ffz.json", "frankerfacez:loaded");
                                c.done(function (d) {
                                    var f = JSON.parse(d);
                                    localStorage.setItem("frankerfacez_api_timestamp", Date.now().toString()), ldb.set("frankerfacez_api", d), prepEmoji.processFrankerFacez(f);
                                });
                            } else
                                ldb.get("frankerfacez_api", function (d) {
                                    console.log("dub+", "frankerfacez", "loading from IndexedDB"), (a = JSON.parse(d)), prepEmoji.processFrankerFacez(a), (a = null);
                                    var f = new Event("frankerfacez:loaded");
                                    window.dispatchEvent(f);
                                });
                        });
                    }),
                    (prepEmoji.processTwitchEmotes = function (a) {
                        for (var b in a)
                            if (a.hasOwnProperty(b)) {
                                var c = b.toLowerCase();
                                if (0 <= b.indexOf("\\")) {
                                    this.twitch.specialEmotes.push([b, a[b]]);
                                    continue;
                                }
                                if (0 <= emojify.emojiNames.indexOf(c)) continue;
                                this.twitch.emotes[c] || (this.twitch.emotes[c] = a[b]);
                            }
                        (this.twitchJSONSLoaded = !0), (this.emojiEmotes = emojify.emojiNames.concat(Object.keys(this.twitch.emotes)));
                    }),
                    (prepEmoji.processBTTVEmotes = function (a) {
                        for (var b in a)
                            if (a.hasOwnProperty(b)) {
                                var c = b.toLowerCase();
                                if (0 <= b.indexOf(":")) continue;
                                if (0 <= emojify.emojiNames.indexOf(c)) continue;
                                0 <= b.indexOf("(") && (c = c.replace(/([()])/g, "")), (this.bttv.emotes[c] = a[b]);
                            }
                        (this.bttvJSONSLoaded = !0), (this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.bttv.emotes)));
                    }),
                    (prepEmoji.processTastyEmotes = function (a) {
                        (this.tasty.emotes = a.emotes), (this.tastyJSONLoaded = !0), (this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.tasty.emotes)));
                    }),
                    (prepEmoji.processFrankerFacez = function (a) {
                        for (var b in a)
                            if (a.hasOwnProperty(b)) {
                                var c = b.toLowerCase().replace("~", "-");
                                if (0 <= b.indexOf(":")) continue;
                                if (0 <= emojify.emojiNames.indexOf(c)) continue;
                                0 <= b.indexOf("(") && (c = c.replace(/([()])/g, "")), (this.frankerFacez.emotes[c] = a[b]);
                            }
                        (this.frankerfacezJSONLoaded = !0), (this.emojiEmotes = this.emojiEmotes.concat(Object.keys(this.frankerFacez.emotes)));
                    }),
                    (module.exports = prepEmoji);
            },
            { "../lib/settings.js": 8, "../utils/getJSON.js": 41 },
        ],
        3: [
            function (require, module, exports) {
                "use strict";
                var _createClass = (function () {
                    function a(b, c) {
                        for (var g, f = 0; f < c.length; f++) (g = c[f]), (g.enumerable = g.enumerable || !1), (g.configurable = !0), "value" in g && (g.writable = !0), Object.defineProperty(b, g.key, g);
                    }
                    return function (b, c, f) {
                        return c && a(b.prototype, c), f && a(b, f), b;
                    };
                })();
                Object.defineProperty(exports, "__esModule", { value: !0 });
                function _classCallCheck(a, b) {
                    if (!(a instanceof b)) throw new TypeError("Cannot call a class as a function");
                }
                var debugAC = !1;
                function log() {}
                var makeList = function (a) {
                    function b(l) {
                        var m = document.createElement("li");
                        return (m.className = l), m;
                    }
                    function c(l, m) {
                        var n = document.createElement("img");
                        (n.src = l), m && ((n.title = m), (n.alt = m));
                        var o = document.createElement("div");
                        return (o.className = "ac-image"), o.appendChild(n), o;
                    }
                    function f(l) {
                        var m = document.createElement("span");
                        return (m.textContent = l), (m.className = "ac-text"), m;
                    }
                    function g() {
                        var l = document.createElement("span");
                        return (l.textContent = "press enter to select"), (l.className = "ac-list-press-enter"), l;
                    }
                    function h(l, m) {
                        var p,
                            n = b("preview-item " + l.cn + "-previews"),
                            o = f(l.text);
                        return (p = l.alt ? c(l.src, l.alt) : c(l.src)), n.appendChild(p), n.appendChild(o), 0 === m && (n.appendChild(g()), n.classList.add("selected")), (n.tabIndex = -1), n;
                    }
                    var j = document.getElementById("autocomplete-preview");
                    j.innerHTML = "";
                    var k = document.createDocumentFragment();
                    a.forEach(function (l, m) {
                        k.appendChild(h(l, m));
                    }),
                        j.appendChild(k),
                        j.classList.add("ac-show");
                };
                function isElementInView(a, b) {
                    var c = a.getBoundingClientRect(),
                        f = b.getBoundingClientRect();
                    return c.top >= f.top && c.bottom <= f.bottom;
                }
                var PreviewListManager = (function () {
                    function a(b) {
                        _classCallCheck(this, a), (this._data = b || { start: 0, end: 0, selected: "" });
                    }
                    return (
                        _createClass(a, [
                            {
                                key: "repl",
                                value: function repl(b, c, f, g) {
                                    return b.substring(0, c - 1) + g + b.substring(f);
                                },
                            },
                            {
                                key: "updateChatInput",
                                value: function updateChatInput() {
                                    log("inUpdate", this._data);
                                    var b = $("#chat-txt-message").val(),
                                        c = this.repl(b, this._data.start, this._data.end, this._data.selected) + " ";
                                    $("#autocomplete-preview").empty().removeClass("ac-show"), $("#chat-txt-message").val(c).focus();
                                },
                            },
                            {
                                key: "doNavigate",
                                value: function doNavigate(b) {
                                    var c = $(".preview-item.selected").index();
                                    c += b;
                                    var f = $(".ac-show li");
                                    $(".ac-list-press-enter").remove(), c >= f.length && (c = 0), 0 > c && (c = f.length - 1);
                                    var g = "selected";
                                    f.removeClass(g).eq(c).addClass(g).append('<span class="ac-list-press-enter">press enter or tab to select</span>');
                                    var j = document.querySelector(".preview-item.selected"),
                                        k = document.querySelector("#autocomplete-preview"),
                                        l = isElementInView(j, k);
                                    log("isInView", l);
                                    l || j.scrollIntoView(1 !== b);
                                },
                            },
                            {
                                key: "updater",
                                value: function updater(b) {
                                    log(b.target, b), (this._data.selected = $(b.target).find(".ac-text").text()), this.updateChatInput();
                                },
                            },
                            {
                                key: "init",
                                value: function init() {
                                    var b = this,
                                        c = document.createElement("ul");
                                    (c.id = "autocomplete-preview"),
                                        $(".pusher-chat-widget-input").prepend(c),
                                        $(document.body).on("click", ".preview-item", function (f) {
                                            return b.updater(f);
                                        });
                                },
                            },
                            {
                                key: "stop",
                                value: function stop() {
                                    $("#autocomplete-preview").remove();
                                },
                            },
                            {
                                key: "data",
                                get: function get() {
                                    return this._data;
                                },
                                set: function set(b) {
                                    b && (this._data = b);
                                },
                            },
                            {
                                key: "selected",
                                set: function set(b) {
                                    b && (this._data.selected = b);
                                },
                            },
                        ]),
                        a
                    );
                })();
                (exports.PreviewListManager = PreviewListManager), (exports.makeList = makeList);
            },
            {},
        ],
        4: [
            function (require, module, exports) {
                (function (PKGINFO) {
                    "use strict";
                    var _loadModules = require("./loadModules.js"),
                        _loadModules2 = _interopRequireDefault(_loadModules),
                        _snooze = require("../modules/snooze.js"),
                        _snooze2 = _interopRequireDefault(_snooze),
                        _eta = require("../modules/eta.js"),
                        _eta2 = _interopRequireDefault(_eta);
                    function _interopRequireDefault(a) {
                        return a && a.__esModule ? a : { default: a };
                    }
                    var css = require("../utils/css.js"),
                        menu = require("./menu.js");
                    module.exports = function () {
                        (window.dubplus = JSON.parse(PKGINFO)), css.load("/css/dubplus.css"), $("html").addClass("dubplus");
                        var a = menu.beginMenu(),
                            b = (0, _loadModules2.default)();
                        menu.finishMenu(b, a), (0, _snooze2.default)(), (0, _eta2.default)();
                    };
                }.call(this, '{"name":"DubPlus","version":"0.2.0","description":"Dub+ (Temp QueUp fix by Mozzle) - A simple script/extension for QueUp.net.","author":"DubPlus","license":"MIT","homepage":"https://dub.plus"}'));
            },
            { "../modules/eta.js": 22, "../modules/snooze.js": 34, "../utils/css.js": 40, "./loadModules.js": 5, "./menu.js": 7 },
        ],
        5: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                var options = require("../utils/options.js"),
                    dubPlus_modules = require("../modules/index.js"),
                    settings = require("../lib/settings.js"),
                    menu = require("../lib/menu.js"),
                    menuObj = { General: "", "User Interface": "", Settings: "", Customize: "" },
                    loadAllModules = function () {
                        return (
                            dubPlus_modules.forEach(function (a) {
                                (window.dubplus[a.id] = a),
                                    (window.dubplus[a.id].toggleAndSave = options.toggleAndSave),
                                    (a.optionState = settings.options[a.id] || !1),
                                    "function" == typeof a.init && a.init.call(a),
                                    a.optionState && "function" == typeof a.turnOn && a.turnOn.call(a);
                                var b = null;
                                "function" != typeof a.extra || a.extraIcon || (b = "pencil"),
                                    (menuObj[a.category] += menu.makeOptionMenu(a.moduleName, {
                                        id: a.id,
                                        desc: a.description,
                                        state: a.optionState,
                                        extraIcon: a.extraIcon || b,
                                        cssClass: a.menuCssClass || "",
                                        altIcon: a.altIcon || null,
                                    }));
                            }),
                            menuObj
                        );
                    };
                exports.default = loadAllModules;
            },
            { "../lib/menu.js": 7, "../lib/settings.js": 8, "../modules/index.js": 29, "../utils/options.js": 45 },
        ],
        6: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                var options = require("../utils/options.js"),
                    toggleMenuSection = function (a) {
                        var b = a.nextElementSibling,
                            c = a.children[0],
                            d = a.textContent.trim().replace(" ", "-").toLowerCase(),
                            e = "dubplus-menu-section-closed",
                            f = $(b).toggleClass(e).hasClass(e);
                        f
                            ? ($(c).removeClass("fa-angle-down"), $(c).addClass("fa-angle-right"), options.saveOption("menu", d, "closed"))
                            : ($(c).removeClass("fa-angle-right"), $(c).addClass("fa-angle-down"), options.saveOption("menu", d, "open"));
                    },
                    traverseMenuDOM = function (a) {
                        if (!a || $(a).hasClass("dubplus-menu")) return null;
                        if ($(a).hasClass("dubplus-menu-section-header")) return toggleMenuSection(a), null;
                        var b = window.dubplus[a.id];
                        return b ? b : traverseMenuDOM(a.parentElement);
                    },
                    menuDelegator = function (a) {
                        var b = traverseMenuDOM(a.target);
                        if (b) {
                            if ($(a.target).hasClass("extra-icon") && b.extra) return void b.extra.call(b);
                            if (b.turnOn && b.turnOff) {
                                var c;
                                return b.optionState ? ((c = !1), b.turnOff.call(b)) : ((c = !0), b.turnOn.call(b)), (b.optionState = c), void options.toggleAndSave(b.id, c);
                            }
                            b.go && b.go.call(b);
                        }
                    };
                exports.default = function () {
                    var a = document.querySelector(".dubplus-menu");
                    a.addEventListener("click", menuDelegator),
                        document.querySelector(".dubplus-icon").addEventListener("click", function () {
                            $(a).toggleClass("dubplus-menu-open");
                        });
                };
            },
            { "../utils/options.js": 45 },
        ],
        7: [
            function (require, module, exports) {
                "use strict";
                var _menuEvents = require("./menu-events.js"),
                    _menuEvents2 = _interopRequireDefault(_menuEvents);
                function _interopRequireDefault(a) {
                    return a && a.__esModule ? a : { default: a };
                }
                var settings = require("./settings.js"),
                    css = require("../utils/css.js"),
                    arrow = "down",
                    isClosedClass = "";
                "closed" === settings.menu.contact && ((isClosedClass = "dubplus-menu-section-closed"), (arrow = "right"));
                var contactSection =
                    '\n  <div id="dubplus-contact" class="dubplus-menu-section-header">\n      <span class="fa fa-angle-' +
                    arrow +
                    '"></span>\n      <p>Contact</p>\n    </div>\n    <ul class="dubplus-menu-section ' +
                    isClosedClass +
                    '">\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-bug"></span>\n        <a href="https://discord.gg/XUkG3Qy" class="dubplus-menu-label" target="_blank">Report bugs on Discord</a>\n      </li>\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-reddit-alien"></span>\n        <a href="https://www.reddit.com/r/DubPlus/" class="dubplus-menu-label"  target="_blank">Reddit</a>\n      </li>\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-facebook"></span>\n        <a href="https://facebook.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Facebook</a>\n      </li>\n      <li class="dubplus-menu-icon">\n        <span class="fa fa-twitter"></span>\n        <a href="https://twitter.com/DubPlusScript" class="dubplus-menu-label"  target="_blank">Twitter</a>\n      </li>\n    </ul>';
                module.exports = {
                    beginMenu: function beginMenu() {
                        css.loadExternal("https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
                        var a = '<div class="dubplus-icon"><img src="' + settings.srcRoot + '/images/dubplus.svg" alt=""></div>';
                        document.querySelector(".header-right-navigation").insertAdjacentHTML("beforeend", a);
                        return '\n      <section class="dubplus-menu">\n          <p class="dubplus-menu-header">Dub+ Options</p>';
                    },
                    finishMenu: function finishMenu(a, b) {
                        for (var c in a) {
                            var d = c.replace(" ", "-").toLowerCase(),
                                e = settings.menu[d],
                                g = "down",
                                h = "";
                            "closed" === e && ((h = "dubplus-menu-section-closed"), (g = "right")),
                                (b +=
                                    '\n        <div id="' +
                                    ("dubplus-" + d) +
                                    '" class="dubplus-menu-section-header">\n          <span class="fa fa-angle-' +
                                    g +
                                    '"></span>\n          <p>' +
                                    c +
                                    '</p>\n        </div>\n        <ul class="dubplus-menu-section ' +
                                    h +
                                    '">'),
                                (b += a[c]),
                                (b += "</ul>");
                        }
                        (b += contactSection), (b += "</section>"), document.body.insertAdjacentHTML("beforeend", b), (0, _menuEvents2.default)();
                    },
                    makeOptionMenu: function makeOptionMenu(a, b) {
                        var d = Object.assign({}, { id: "", desc: "", state: !1, extraIcon: null, cssClass: "", altIcon: null }, b),
                            e = "",
                            f = d.state ? "dubplus-switch-on" : "";
                        d.extraIcon && (e = '<span class="fa fa-' + d.extraIcon + ' extra-icon"></span>');
                        var g = "dubplus-switch",
                            h = '\n        <div class="dubplus-switch-bg">\n          <div class="dubplus-switcher"></div>\n        </div>';
                        return (
                            d.altIcon && ((g = "dubplus-menu-icon"), (h = '<span class="fa fa-' + d.altIcon + '"></span>')),
                            '\n      <li id="' + d.id + '" class="' + g + " " + f + " " + d.cssClass + ' title="' + d.desc + '">\n        ' + e + "\n        " + h + '\n        <span class="dubplus-menu-label">' + a + "</span>\n      </li>"
                        );
                    },
                };
            },
            { "../utils/css.js": 40, "./menu-events.js": 6, "./settings.js": 8 },
        ],
        8: [
            function (require, module, exports) {
                (function (_RESOURCE_SRC_) {
                    "use strict";
                    var defaults = { options: {}, menu: { general: "open", "user-interface": "open", settings: "open", customize: "open", contact: "open" }, custom: {} },
                        savedSettings = {},
                        _storageRaw = localStorage.getItem("dubplusUserSettings");
                    _storageRaw && (savedSettings = JSON.parse(_storageRaw));
                    var exportSettings = $.extend({}, defaults, savedSettings);
                    (exportSettings.srcRoot = _RESOURCE_SRC_), (module.exports = exportSettings);
                }.call(this, "https://cdn.jsdelivr.net/gh/DubPlus/DubPlus"));
            },
            {},
        ],
        9: [
            function (require, module, exports) {
                "use strict";
                var modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    settings = require("../lib/settings.js"),
                    afk_module = {};
                (afk_module.id = "dubplus-afk"), (afk_module.moduleName = "AFK Auto-respond"), (afk_module.description = "Toggle Away from Keyboard and customize AFK message."), (afk_module.category = "General"), (afk_module.canSend = !0);
                var afk_chat_respond = function (a) {
                    if (afk_module.canSend) {
                        var b = a.message,
                            c = QueUp.session.get("username");
                        -1 < b.indexOf("@" + c) &&
                            QueUp.session.id !== a.user.userInfo.userid &&
                            (settings.custom.customAfkMessage ? $("#chat-txt-message").val("[AFK] " + settings.custom.customAfkMessage) : $("#chat-txt-message").val("[AFK] I'm not here right now."),
                            QueUp.room.chat.sendMessage(),
                            (afk_module.canSend = !1),
                            setTimeout(function () {
                                afk_module.canSend = !0;
                            }, 3e4));
                    }
                };
                (afk_module.turnOn = function () {
                    QueUp.Events.bind("realtime:chat-message", afk_chat_respond);
                }),
                    (afk_module.turnOff = function () {
                        QueUp.Events.unbind("realtime:chat-message", afk_chat_respond);
                    });
                var saveAFKmessage = function () {
                    var a = $(".dp-modal textarea").val();
                    "" !== a && options.saveOption("custom", "customAfkMessage", a);
                };
                (afk_module.extra = function () {
                    modal.create({
                        title: "Custom AFK Message",
                        content: "Enter a custom Away From Keyboard [AFK] message here",
                        value: settings.custom.customAfkMessage || "",
                        placeholder: "Be right back!",
                        maxlength: "255",
                        confirmCallback: saveAFKmessage,
                    });
                }),
                    (module.exports = afk_module);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        10: [
            function (require, module, exports) {
                "use strict";
                var _previewList = require("../emojiUtils/previewList.js"),
                    settings = require("../lib/settings.js"),
                    prepEmjoji = require("../emojiUtils/prepEmoji.js"),
                    debugAC = !1;
                function log() {}
                var myModule = { id: "dubplus-autocomplete", moduleName: "Autocomplete Emoji", description: "Toggle autocompleting emojis and emotes.  Shows a preview box in the chat", category: "General" },
                    KEYS = { up: 38, down: 40, left: 37, right: 39, enter: 13, esc: 27, tab: 9, shiftKey: 16, backspace: 8, del: 46, space: 32, ctrl: 17 },
                    keyCharMin = 3,
                    inputRegex = /(:)([&!()\+\-_a-z0-9]+)($|\s)/gi,
                    emojiUtils = {
                        createPreviewObj: function createPreviewObj(a, b, c) {
                            return { src: prepEmjoji[a].template(b), text: ":" + c + ":", alt: c, cn: a };
                        },
                        addToPreviewList: function addToPreviewList(a) {
                            var b = this,
                                c = [],
                                d;
                            a.forEach(function (f) {
                                (d = f.toLowerCase()),
                                    "undefined" != typeof prepEmjoji.twitch.emotes[d] && c.push(b.createPreviewObj("twitch", prepEmjoji.twitch.emotes[d], f)),
                                    "undefined" != typeof prepEmjoji.bttv.emotes[d] && c.push(b.createPreviewObj("bttv", prepEmjoji.bttv.emotes[d], f)),
                                    "undefined" != typeof prepEmjoji.tasty.emotes[d] && c.push(b.createPreviewObj("tasty", d, f)),
                                    "undefined" != typeof prepEmjoji.frankerFacez.emotes[d] && c.push(b.createPreviewObj("frankerFacez", prepEmjoji.frankerFacez.emotes[d], f)),
                                    0 <= emojify.emojiNames.indexOf(d) && c.push(b.createPreviewObj("emoji", f, f));
                            }),
                                (0, _previewList.makeList)(c);
                        },
                        filterEmoji: function filterEmoji(a) {
                            var b = a.replace(/([+()])/, "\\$1"),
                                c = new RegExp("^" + b, "i"),
                                d = emojify.emojiNames || [];
                            return (
                                settings.options["dubplus-emotes"] && (d = prepEmjoji.emojiEmotes || []),
                                d.filter(function (f) {
                                    return c.test(f);
                                })
                            );
                        },
                    },
                    previewList = new _previewList.PreviewListManager(),
                    shouldClearPreview = function (a, b, c, d) {
                        var f = c.charAt(c.length - 1);
                        return (b.length < d || ":" === f || " " === f || "" === c) && ((b = ""), (a.innerHTML = ""), (a.className = "")), b;
                    },
                    handleMatch = function (a, b, c, d) {
                        var f = a.length - 1,
                            g = a[f].trim(),
                            h = g.charAt(0);
                        g = g.substring(1);
                        var i = b.lastIndexOf(g),
                            j = i + g.length;
                        return log("cursorPos", c), c >= i && c <= j && g && g.length >= d && ":" === h && emojiUtils.addToPreviewList(emojiUtils.filterEmoji(g)), log("match", a, i, j), { start: i, end: j, currentMatch: g };
                    },
                    chatInputKeyupFunc = function (a) {
                        var b = document.querySelector("#autocomplete-preview"),
                            c = 0 < b.children.length;
                        if (a.keyCode !== KEYS.enter || c) {
                            if (a.keyCode === KEYS.up && c) return a.preventDefault(), void previewList.doNavigate(-1);
                            if (a.keyCode === KEYS.down && c) return a.preventDefault(), void previewList.doNavigate(1);
                            if ((a.keyCode === KEYS.enter || a.keyCode === KEYS.tab) && c) return a.preventDefault(), (previewList.selected = $(".preview-item.selected").find(".ac-text").text()), previewList.updateChatInput(), !1;
                            var d = this.value,
                                f = $(this).get(0).selectionStart,
                                g = d.match(inputRegex),
                                h = "";
                            if (g && 0 < g.length) {
                                var i = handleMatch(g, d, f, keyCharMin);
                                (h = i.currentMatch), (previewList.data = i);
                            }
                            log("inKeyup", previewList.data), shouldClearPreview(b, h, d, keyCharMin);
                        }
                    },
                    chatInputKeydownFunc = function (a) {
                        var b = 0 >= document.querySelector("#autocomplete-preview").children.length,
                            c = _.includes([KEYS.tab, KEYS.enter, KEYS.up, KEYS.down, KEYS.left, KEYS.right], a.keyCode);
                        return c && b ? QueUp.room.chat.ncKeyDown({ which: a.keyCode }) : void (c && !b && a.preventDefault());
                    };
                (myModule.turnOn = function () {
                    previewList.init(),
                        QueUp.room.chat.delegateEvents(_.omit(QueUp.room.chat.events, ["keydown #chat-txt-message"])),
                        $(document.body).on("keydown", "#chat-txt-message", chatInputKeydownFunc),
                        $(document.body).on("keyup", "#chat-txt-message", chatInputKeyupFunc);
                }),
                    (myModule.turnOff = function () {
                        previewList.stop(),
                            QueUp.room.chat.delegateEvents(QueUp.room.chat.events),
                            $(document.body).off("keydown", "#chat-txt-message", chatInputKeydownFunc),
                            $(document.body).off("keyup", "#chat-txt-message", chatInputKeyupFunc);
                    }),
                    (module.exports = myModule);
            },
            { "../emojiUtils/prepEmoji.js": 2, "../emojiUtils/previewList.js": 3, "../lib/settings.js": 8 },
        ],
        11: [
            function (require, module, exports) {
                "use strict";
                var autovote = { id: "dubplus-autovote", moduleName: "Autovote", description: "Toggles auto upvoting for every song", category: "General" },
                    advance_vote = function () {
                        QueUp && QueUp.playerController && QueUp.playerController.voteUp && (console.log("voting"), QueUp.playerController.voteUp.click());
                    },
                    voteCheck = function (a) {
                        2 > a.startTime && advance_vote();
                    };
                (autovote.turnOff = function () {
                    QueUp.Events.unbind("realtime:room_playlist-update", voteCheck);
                }),
                    (autovote.turnOn = function () {
                        var a = QueUp.room.player.activeSong.get("song"),
                            b = QueUp.helpers.cookie.get("dub-" + QueUp.room.model.get("_id")),
                            c = QueUp.helpers.cookie.get("dub-song");
                        (QueUp.room && a && a.songid === c) || (b = !1), $(".dubup, .dubdown").hasClass("voted") || b || advance_vote(), QueUp.Events.bind("realtime:room_playlist-update", voteCheck);
                    }),
                    (module.exports = autovote);
            },
            {},
        ],
        12: [
            function (require, module, exports) {
                "use strict";
                var settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    myModule = {};
                (myModule.id = "chat-cleaner"),
                    (myModule.moduleName = "Chat Cleaner"),
                    (myModule.description = "Automatically only keep a designated chatItems of chat items while clearing older ones, keeping CPU stress down"),
                    (myModule.category = "General"),
                    (myModule.extraIcon = "pencil");
                var saveAmount = function () {
                    var a = parseInt($(".dp-modal textarea").val());
                    isNaN(a) ? options.saveOption("custom", "chat_cleaner", 500) : options.saveOption("custom", "chat_cleaner", a);
                };
                (myModule.chatCleanerCheck = function () {
                    var b = $("ul.chat-main > li").length;
                    isNaN(b) || isNaN(settings.custom.chat_cleaner) || b < settings.custom.chat_cleaner || $("ul.chat-main > li:lt(" + ($("ul.chat-main > li").length - settings.custom.chat_cleaner) + ")").remove();
                }),
                    (myModule.turnOn = function () {
                        QueUp.Events.bind("realtime:chat-message", this.chatCleanerCheck);
                    }),
                    (myModule.extra = function () {
                        modal.create({
                            title: "Chat Cleaner",
                            content: "Please specify the number of most recent chat items that will remain in your chat history",
                            value: settings.custom.chat_cleaner || "",
                            placeholder: "500",
                            maxlength: "5",
                            confirmCallback: saveAmount,
                        });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:chat-message", this.chatCleanerCheck);
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        13: [
            function (require, module, exports) {
                "use strict";
                var _notify = require("../utils/notify.js"),
                    settings = require("../lib/settings.js"),
                    myModule = {};
                (myModule.id = "mention_notifications"),
                    (myModule.moduleName = "Notification on Mentions"),
                    (myModule.description = "Enable desktop notifications when a user mentions you in chat"),
                    (myModule.category = "General"),
                    (myModule.notifyOnMention = function (a) {
                        var b = a.message,
                            c = QueUp.session.get("username").toLowerCase(),
                            d = ["@" + c];
                        settings.options.custom_mentions && settings.custom.custom_mentions && (d = d.concat(settings.custom.custom_mentions.split(",")));
                        var f = d.some(function (g) {
                            var h = new RegExp("\\b" + g.trim() + "\\b", "i");
                            return h.test(b);
                        });
                        f && !this.isActiveTab && QueUp.session.id !== a.user.userInfo.userid && (0, _notify.showNotification)({ title: "Message from " + a.user.username, content: b });
                    }),
                    (myModule.turnOn = function () {
                        var a = this;
                        (0, _notify.notifyCheckPermission)(function (b) {
                            !0 === b ? QueUp.Events.bind("realtime:chat-message", a.notifyOnMention) : a.toggleAndSave(a.id, !1);
                        });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:chat-message", this.notifyOnMention);
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/notify.js": 44 },
        ],
        14: [
            function (require, module, exports) {
                "use strict";
                var css = require("../utils/css.js"),
                    myModule = {};
                (myModule.id = "dubplus-comm-theme"),
                    (myModule.moduleName = "Community Theme"),
                    (myModule.description = "Toggle Community CSS theme."),
                    (myModule.category = "Customize"),
                    (myModule.turnOn = function () {
                        var a = QueUp.room.model.get("roomUrl");
                        $.ajax({ type: "GET", url: "https://api.QueUp.net/room/" + a }).done(function (b) {
                            var c = b.data.description,
                                d = new RegExp(/(@dub(x|plus|\+)=)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/, "i"),
                                f = null;
                            c.replace(d, function (g, h, i, j) {
                                console.log("loading community css theme:", j), (f = j);
                            });
                            f && css.loadExternal(f, "dubplus-comm-theme");
                        });
                    }),
                    (myModule.turnOff = function () {
                        $(".dubplus-comm-theme").remove();
                    }),
                    (module.exports = myModule);
            },
            { "../utils/css.js": 40 },
        ],
        15: [
            function (require, module, exports) {
                "use strict";
                var settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    myModule = {};
                (myModule.id = "dubplus-custom-bg"), (myModule.moduleName = "Custom Background"), (myModule.description = "Add your own custom background."), (myModule.category = "Customize"), (myModule.extraIcon = "pencil");
                var makeBGdiv = function (a) {
                        return '<div class="dubplus-custom-bg" style="background-image: url(' + a + ');"></div>';
                    },
                    saveCustomBG = function () {
                        var a = $(".dp-modal textarea").val();
                        return "" !== a && a
                            ? void ($(".dubplus-custom-bg").length ? $(".dubplus-custom-bg").css("background-image", "url(" + a + ")") : $("body").append(makeBGdiv(a)), options.saveOption("custom", "bg", a))
                            : ($(".dubplus-custom-bg").remove(), void options.saveOption("custom", "bg", ""));
                    };
                (myModule.extra = function () {
                    modal.create({
                        title: "Custom Background Image",
                        content: "Enter the full URL of an image. We recommend using a .jpg file. Leave blank to remove the current background image",
                        value: settings.custom.bg || "",
                        placeholder: "https://example.com/big-image.jpg",
                        maxlength: "500",
                        confirmCallback: saveCustomBG,
                    });
                }),
                    (myModule.turnOn = function () {
                        settings.custom.bg && "" !== settings.custom.bg ? $("body").append(makeBGdiv(settings.custom.bg)) : this.extra();
                    }),
                    (myModule.turnOff = function () {
                        $(".dubplus-custom-bg").remove();
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        16: [
            function (require, module, exports) {
                "use strict";
                var css = require("../utils/css.js"),
                    settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    myModule = {};
                (myModule.id = "dubplus-custom-css"), (myModule.moduleName = "Custom CSS"), (myModule.description = "Add your own custom CSS."), (myModule.category = "Customize"), (myModule.extraIcon = "pencil");
                var css_import = function () {
                    $(".dubplus-custom-css").remove();
                    var a = $(".dp-modal textarea").val();
                    options.saveOption("custom", "css", a), a && "" !== a && css.loadExternal(a, "dubplus-custom-css");
                };
                (myModule.extra = function () {
                    modal.create({ title: "Custom CSS", content: "Enter a url location for your custom css", value: settings.custom.css || "", placeholder: "https://example.com/example.css", maxlength: "500", confirmCallback: css_import });
                }),
                    (myModule.turnOn = function () {
                        settings.custom.css && "" !== settings.custom.css ? css.loadExternal(settings.custom.css, "dubplus-custom-css") : this.extra();
                    }),
                    (myModule.turnOff = function () {
                        $(".dubplus-custom-css").remove();
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/css.js": 40, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        17: [
            function (require, module, exports) {
                "use strict";
                var settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    myModule = {};
                (myModule.id = "custom_mentions"),
                    (myModule.moduleName = "Custom Mentions"),
                    (myModule.description = "Toggle using custom mentions to trigger sounds in chat"),
                    (myModule.category = "General"),
                    (myModule.extraIcon = "pencil");
                var saveCustomMentions = function () {
                    var a = $(".dp-modal textarea").val();
                    "" !== a && options.saveOption("custom", "custom_mentions", a);
                };
                (myModule.customMentionCheck = function (a) {
                    var b = a.message;
                    if (settings.custom.custom_mentions) {
                        var c = settings.custom.custom_mentions.split(","),
                            d = c.some(function (f) {
                                var g = new RegExp("\\b" + f.trim() + "\\b", "i");
                                return g.test(b);
                            });
                        QueUp.session.id !== a.user.userInfo.userid && d && QueUp.room.chat.mentionChatSound.play();
                    }
                }),
                    (myModule.turnOn = function () {
                        QueUp.Events.bind("realtime:chat-message", this.customMentionCheck);
                    }),
                    (myModule.extra = function () {
                        modal.create({
                            title: "Custom Mentions",
                            content: "Add your custom mention triggers here (separate by comma)",
                            value: settings.custom.custom_mentions || "",
                            placeholder: "separate, custom triggers, by, comma, :heart:",
                            maxlength: "255",
                            confirmCallback: saveCustomMentions,
                        });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:chat-message", this.customMentionCheck);
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        18: [
            function (require, module, exports) {
                "use strict";
                var settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    QueUpDefaultSound = "/assets/music/user_ping.mp3",
                    myModule = {};
                (myModule.id = "dubplus-custom-notification-sound"),
                    (myModule.moduleName = "Custom Notification Sound"),
                    (myModule.description = "Change the notification sound to a custom one."),
                    (myModule.category = "Customize"),
                    (myModule.extraIcon = "pencil");
                var saveCustomNotificationSound = function () {
                    var a = $(".dp-modal textarea").val();
                    return "" !== a && a
                        ? void (soundManager.canPlayURL(a)
                              ? (QueUp.room.chat.mentionChatSound.url = a)
                              : setTimeout(function () {
                                    var b = myModule;
                                    modal.create({ title: "Dub+ Error", content: "You've entered an invalid sound url! Please make sure you are entering the full, direct url to the file. IE: https://example.com/sweet-sound.mp3" }),
                                        (QueUp.room.chat.mentionChatSound.url = QueUpDefaultSound),
                                        (b.optionState = !1),
                                        b.toggleAndSave(b.id, !1);
                                }, 100),
                          options.saveOption("custom", "notificationSound", a))
                        : (options.saveOption("custom", "notificationSound", ""), void (QueUp.room.chat.mentionChatSound.url = QueUpDefaultSound));
                };
                (myModule.extra = function () {
                    modal.create({
                        title: "Custom Notification Sound",
                        content: "Enter the full URL of a sound file. We recommend using an .mp3 file. Leave blank to go back to QueUp's default sound",
                        value: settings.custom.notificationSound || "",
                        placeholder: "https://example.com/sweet-sound.mp3",
                        maxlength: "500",
                        confirmCallback: saveCustomNotificationSound,
                    });
                }),
                    (myModule.init = function () {
                        this.optionState && settings.custom.notificationSound && this.turnOn();
                    }),
                    (myModule.turnOn = function () {
                        settings.custom.notificationSound && "" !== settings.custom.notificationSound ? (QueUp.room.chat.mentionChatSound.url = settings.custom.notificationSound) : this.extra();
                    }),
                    (myModule.turnOff = function () {
                        QueUp.room.chat.mentionChatSound.url = QueUpDefaultSound;
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/options.js": 45 },
        ],
        19: [
            function (require, module, exports) {
                "use strict";
                var _notify = require("../utils/notify.js"),
                    settings = require("../lib/settings.js"),
                    modal = require("../utils/modal.js"),
                    options = require("../utils/options.js"),
                    myModule = {};
                (myModule.id = "dj-notification"), (myModule.moduleName = "DJ Notification"), (myModule.description = "Notification when you are coming up to be the DJ"), (myModule.category = "General"), (myModule.extraIcon = "pencil");
                var savePosition = function () {
                    var a = parseInt($(".dp-modal textarea").val());
                    isNaN(a) ? options.saveOption("custom", "dj_notification", 2) : options.saveOption("custom", "dj_notification", a);
                };
                (myModule.djNotificationCheck = function (a) {
                    if (!(2 < a.startTime)) {
                        var b = parseInt($(".queue-position").text()),
                            c = 0 > a.startTime && !isNaN(b) ? b - 1 : b;
                        isNaN(b) ||
                            c !== settings.custom.dj_notification ||
                            ((0, _notify.showNotification)({ title: "DJ Alert!", content: "You will be DJing shortly! Make sure your song is set!", ignoreActiveTab: !0, wait: 1e4 }), QueUp.room.chat.mentionChatSound.play());
                    }
                }),
                    (myModule.turnOn = function () {
                        QueUp.Events.bind("realtime:room_playlist-update", this.djNotificationCheck);
                    }),
                    (myModule.extra = function () {
                        modal.create({
                            title: "DJ Notification",
                            content: "Please specify the position in queue you want to be notified at",
                            value: settings.custom.dj_notification || "",
                            placeholder: "2",
                            maxlength: "2",
                            confirmCallback: savePosition,
                        });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:room_playlist-update", this.djNotificationCheck);
                    }),
                    (module.exports = myModule);
            },
            { "../lib/settings.js": 8, "../utils/modal.js": 42, "../utils/notify.js": 44, "../utils/options.js": 45 },
        ],
        20: [
            function (require, module, exports) {
                "use strict";
                var _modcheck = require("../utils/modcheck.js"),
                    _modcheck2 = _interopRequireDefault(_modcheck);
                function _interopRequireDefault(a) {
                    return a && a.__esModule ? a : { default: a };
                }
                var myModule = {};
                (myModule.id = "dubplus-downdubs"),
                    (myModule.moduleName = "Downdubs in Chat (mods only)"),
                    (myModule.description = "Toggle showing downdubs in the chat box (mods only)"),
                    (myModule.category = "General"),
                    (myModule.downdubWatcher = function (a) {
                        var b = QueUp.session.get("username"),
                            c = QueUp.room.users.collection.findWhere({ userid: QueUp.room.player.activeSong.attributes.song.userid }).attributes._user.username;
                        if (b === c && "downdub" === a.dubtype) {
                            var d =
                                '\n      <li class="dubplus-chat-system dubplus-chat-system-downdub">\n        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">\n          <span class="icon-close"></span>\n        </div>\n        <div class="text">\n          @' +
                                a.user.username +
                                " has downdubbed your song " +
                                QueUp.room.player.activeSong.attributes.songInfo.name +
                                "\n        </div>\n      </li>";
                            $("ul.chat-main").append(d);
                        }
                    }),
                    (myModule.turnOn = function () {
                        (0, _modcheck2.default)(QueUp.session.id) &&
                            (QueUp.Events.bind("realtime:room_playlist-dub", this.downdubWatcher),
                            "function" != typeof window.dubplus.deleteChatMessageClientSide &&
                                (window.dubplus.deleteChatMessageClientSide = function (a) {
                                    $(a).parent("li")[0].remove();
                                }));
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:room_playlist-dub", this.downdubWatcher);
                    }),
                    (module.exports = myModule);
            },
            { "../utils/modcheck.js": 43 },
        ],
        21: [
            function (require, module, exports) {
                "use strict";
                var dubplus_emoji = require("../emojiUtils/prepEmoji.js"),
                    emote_module = {};
                (emote_module.id = "dubplus-emotes"), (emote_module.moduleName = "Emotes"), (emote_module.description = "Adds twitch and bttv emotes in chat."), (emote_module.category = "General");
                function makeImage(a, b, c, d, e) {
                    return '<img class="emoji ' + a + '-emote" ' + (d ? 'width="' + d + '" ' : "") + (e ? 'height="' + e + '" ' : "") + 'title="' + c + '" alt="' + c + '" src="' + b + '" />';
                }
                var replaceTextWithEmote = function () {
                    var a = dubplus_emoji.twitch.chatRegex;
                    if (dubplus_emoji.twitchJSONSLoaded) {
                        var b = $(".chat-main .text").last();
                        if (b.html()) {
                            dubplus_emoji.bttvJSONSLoaded && (a = dubplus_emoji.bttv.chatRegex);
                            var c = b.html().replace(a, function (d, e) {
                                var f,
                                    g,
                                    i = e.toLowerCase();
                                return dubplus_emoji.twitch.emotes[i]
                                    ? ((f = dubplus_emoji.twitch.emotes[i]), (g = dubplus_emoji.twitch.template(f)), makeImage("twitch", g, i))
                                    : dubplus_emoji.bttv.emotes[i]
                                    ? ((f = dubplus_emoji.bttv.emotes[i]), (g = dubplus_emoji.bttv.template(f)), makeImage("bttv", g, i))
                                    : dubplus_emoji.tasty.emotes[i]
                                    ? ((g = dubplus_emoji.tasty.template(i)), makeImage("tasty", g, i, dubplus_emoji.tasty.emotes[i].width, dubplus_emoji.tasty.emotes[i].height))
                                    : dubplus_emoji.frankerFacez.emotes[i]
                                    ? ((f = dubplus_emoji.frankerFacez.emotes[i]), (g = dubplus_emoji.frankerFacez.template(f)), makeImage("frankerFacez", g, i))
                                    : d;
                            });
                            b.html(c);
                        }
                    }
                };
                (emote_module.turnOn = function () {
                    window.addEventListener("twitch:loaded", dubplus_emoji.loadBTTVEmotes.bind(dubplus_emoji)),
                        window.addEventListener("bttv:loaded", dubplus_emoji.loadFrankerFacez.bind(dubplus_emoji)),
                        dubplus_emoji.twitchJSONSLoaded ? replaceTextWithEmote() : dubplus_emoji.loadTwitchEmotes(),
                        QueUp.Events.bind("realtime:chat-message", replaceTextWithEmote);
                }),
                    (emote_module.turnOff = function () {
                        QueUp.Events.unbind("realtime:chat-message", replaceTextWithEmote);
                    }),
                    (module.exports = emote_module);
            },
            { "../emojiUtils/prepEmoji.js": 2 },
        ],
        22: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = function () {
                        $(".player_sharing").append('<span class="icon-history eta_tooltip_t"></span>'), $(".eta_tooltip_t").mouseover(eta).mouseout(hide_eta);
                    });
                var eta = function () {
                        var a = 4,
                            b = parseInt($("#player-controller div.left ul li.infoContainer.display-block div.currentTime span.min").text()),
                            c = parseInt($(".queue-position").text()),
                            d = c * a - a + b;
                        0 <= d
                            ? $(this).append(
                                  '<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">ETA: ' +
                                      d +
                                      " minutes</div>"
                              )
                            : $(this).append(
                                  '<div class="eta_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">You\'re not in the queue</div>'
                              );
                    },
                    hide_eta = function () {
                        $(this).empty();
                    };
            },
            {},
        ],
        23: [
            function (require, module, exports) {
                "use strict";
                var fs_module = {};
                (fs_module.id = "dubplus-fullscreen"),
                    (fs_module.moduleName = "Fullscreen Video"),
                    (fs_module.description = "Toggle fullscreen video mode"),
                    (fs_module.category = "User Interface"),
                    (fs_module.altIcon = "arrows-alt"),
                    (fs_module.go = function () {
                        var a = document.querySelector(".playerElement iframe");
                        a.requestFullscreen ? a.requestFullscreen() : a.msRequestFullscreen ? a.msRequestFullscreen() : a.mozRequestFullScreen ? a.mozRequestFullScreen() : a.webkitRequestFullscreen && a.webkitRequestFullscreen();
                    }),
                    (module.exports = fs_module);
            },
            {},
        ],
        24: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-grabschat"),
                    (myModule.moduleName = "Grabs in Chat"),
                    (myModule.description = "Toggle showing grabs in the chat box"),
                    (myModule.category = "General"),
                    (myModule.grabChatWatcher = function (a) {
                        var b = QueUp.session.get("username"),
                            c = QueUp.room.users.collection.findWhere({ userid: QueUp.room.player.activeSong.attributes.song.userid }).attributes._user.username;
                        if (b === c && !QueUp.room.model.get("displayUserGrab")) {
                            var d =
                                '\n      <li class="dubplus-chat-system dubplus-chat-system-grab">\n        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">\n          <span class="icon-close"></span>\n        </div>\n        <div class="text">\n          @' +
                                a.user.username +
                                " has grabbed your song " +
                                QueUp.room.player.activeSong.attributes.songInfo.name +
                                "\n        </div>\n      </li>";
                            $("ul.chat-main").append(d);
                        }
                    }),
                    (myModule.turnOn = function () {
                        QueUp.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher),
                            "function" != typeof window.dubplus.deleteChatMessageClientSide &&
                                (window.dubplus.deleteChatMessageClientSide = function (a) {
                                    $(a).parent("li")[0].remove();
                                });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabChatWatcher);
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        25: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-hide-avatars"),
                    (myModule.moduleName = "Hide Avatars"),
                    (myModule.description = "Toggle hiding user avatars in the chat box."),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-hide-avatars");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-hide-avatars");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        26: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-hide-bg"),
                    (myModule.moduleName = "Hide Background"),
                    (myModule.description = "Toggle hiding background image."),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-hide-bg");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-hide-bg");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        27: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-video-only"),
                    (myModule.moduleName = "Hide Chat"),
                    (myModule.description = "Toggles hiding the chat box"),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-video-only");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-video-only");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        28: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-chat-only"),
                    (myModule.moduleName = "Hide Video"),
                    (myModule.description = "Toggles hiding the video box"),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-chat-only");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-chat-only");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        29: [
            function (require, module, exports) {
                "use strict";
                module.exports = [
                    require("./autovote.js"),
                    require("./afk.js"),
                    require("./emotes.js"),
                    require("./autocomplete.js"),
                    require("./customMentions.js"),
                    require("./chatCleaner.js"),
                    require("./chatNotifications.js"),
                    require("./pmNotifications.js"),
                    require("./djNotification.js"),
                    require("./showDubsOnHover.js"),
                    require("./downDubInChat.js"),
                    require("./upDubInChat.js"),
                    require("./grabsInChat.js"),
                    require("./snow.js"),
                    require("./rain.js"),
                    require("./fullscreen.js"),
                    require("./splitchat.js"),
                    require("./hideChat.js"),
                    require("./hideVideo.js"),
                    require("./hideAvatars.js"),
                    require("./hideBackground.js"),
                    require("./showTimestamps.js"),
                    require("./spacebarMute.js"),
                    require("./warnOnNavigation.js"),
                    require("./communityTheme.js"),
                    require("./customCSS.js"),
                    require("./customBackground.js"),
                    require("./customNotificationSound.js"),
                ];
            },
            {
                "./afk.js": 9,
                "./autocomplete.js": 10,
                "./autovote.js": 11,
                "./chatCleaner.js": 12,
                "./chatNotifications.js": 13,
                "./communityTheme.js": 14,
                "./customBackground.js": 15,
                "./customCSS.js": 16,
                "./customMentions.js": 17,
                "./customNotificationSound.js": 18,
                "./djNotification.js": 19,
                "./downDubInChat.js": 20,
                "./emotes.js": 21,
                "./fullscreen.js": 23,
                "./grabsInChat.js": 24,
                "./hideAvatars.js": 25,
                "./hideBackground.js": 26,
                "./hideChat.js": 27,
                "./hideVideo.js": 28,
                "./pmNotifications.js": 30,
                "./rain.js": 31,
                "./showDubsOnHover.js": 32,
                "./showTimestamps.js": 33,
                "./snow.js": 35,
                "./spacebarMute.js": 36,
                "./splitchat.js": 37,
                "./upDubInChat.js": 38,
                "./warnOnNavigation.js": 39,
            },
        ],
        30: [
            function (require, module, exports) {
                "use strict";
                var _notify = require("../utils/notify.js"),
                    myModule = {};
                (myModule.id = "dubplus_pm_notifications"),
                    (myModule.moduleName = "Notification on PM"),
                    (myModule.description = "Enable desktop notifications when a user receives a private message"),
                    (myModule.category = "General"),
                    (myModule.pmNotify = function (a) {
                        var b = QueUp.session.get("_id");
                        b === a.userid ||
                            (0, _notify.showNotification)({
                                title: "You have a new PM",
                                ignoreActiveTab: !0,
                                callback: function callback() {
                                    $(".user-messages").click(),
                                        setTimeout(function () {
                                            $('.message-item[data-messageid="' + a.messageid + '"]').click();
                                        }, 500);
                                },
                                wait: 1e4,
                            });
                    }),
                    (myModule.turnOn = function () {
                        var a = this;
                        (0, _notify.notifyCheckPermission)(function (b) {
                            !0 === b ? QueUp.Events.bind("realtime:new-message", a.pmNotify) : a.toggleAndSave(a.id, !1);
                        });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:new-message", this.pmNotify);
                    }),
                    (module.exports = myModule);
            },
            { "../utils/notify.js": 44 },
        ],
        31: [
            function (require, module, exports) {
                "use strict";
                var rain = {};
                (rain.id = "dubplus-rain"),
                    (rain.moduleName = "Rain"),
                    (rain.description = "Make it rain!"),
                    (rain.category = "General"),
                    (rain.particles = []),
                    (rain.drops = []),
                    (rain.numbase = 5),
                    (rain.numb = 2),
                    rain.width,
                    (rain.height = 0),
                    (rain.controls = { rain: 2, alpha: 1, color: 200, opacity: 1, saturation: 100, lightness: 50, back: 0, multi: !1, speed: 1 }),
                    (rain.turnOn = function () {
                        $("body").prepend('<canvas id="dubPlusRainCanvas" style="position : fixed; top : 0px; left : 0px; z-index: 100; pointer-events:none;"></canvas>'), this.bindCanvas();
                    }),
                    (rain.turnOff = function () {
                        $("#dubPlusRainCanvas").remove(), this.unbindCanvas();
                    }),
                    (rain.bindCanvas = function () {
                        this.requestAnimFrame = (function () {
                            return (
                                window.requestAnimationFrame ||
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame ||
                                window.oRequestAnimationFrame ||
                                window.msRequestAnimationFrame ||
                                function (e) {
                                    window.setTimeout(e, 1e3 / 60);
                                }
                            );
                        })();
                        var b = document.getElementById("dubPlusRainCanvas");
                        if (b) {
                            var c = b.getContext("2d");
                            this.width,
                                (this.height = 0),
                                (window.onresize = function () {
                                    (this.width = b.width = window.innerWidth), (this.height = b.height = window.innerHeight);
                                }),
                                window.onresize(),
                                this.particles,
                                (this.drops = []),
                                (this.numbase = 5),
                                (this.numb = 2);
                            var d = this;
                            (function e() {
                                d.requestAnimFrame(e), d.update(), d.rendu(c);
                            })();
                        }
                    }),
                    (rain.buildRainParticle = function (a, b, c) {
                        for (c || (c = this.numb); c--; )
                            this.particles.push({
                                speedX: 0.25 * Math.random(),
                                speedY: 9 * Math.random() + 1,
                                X: a,
                                Y: b,
                                alpha: 1,
                                color: "hsla(" + this.controls.color + "," + this.controls.saturation + "%, " + this.controls.lightness + "%," + this.controls.opacity + ")",
                            });
                    }),
                    (rain.explosion = function (a, b, c, d) {
                        for (d || (d = this.numbase); d--; ) this.drops.push({ speedX: 4 * Math.random() - 2, speedY: -4 * Math.random(), X: a, Y: b, radius: 0.65 + Math.floor(1.6 * Math.random()), alpha: 1, color: c });
                    }),
                    (rain.rendu = function (a) {
                        !0 == this.controls.multi && (this.controls.color = 360 * Math.random()), a.save(), a.clearRect(0, 0, width, height);
                        for (var f, b = this.particles, c = this.drops, d = 2 * Math.PI, e = 0; (f = b[e]); e++) (a.globalAlpha = f.alpha), (a.fillStyle = f.color), a.fillRect(f.X, f.Y, f.speedY / 4, f.speedY);
                        for (var g, e = 0; (g = c[e]); e++) (a.globalAlpha = g.alpha), (a.fillStyle = g.color), a.beginPath(), a.arc(g.X, g.Y, g.radius, 0, d), a.fill();
                        (a.strokeStyle = "white"), (a.lineWidth = 2), a.restore();
                    }),
                    (rain.update = function () {
                        for (var d, a = this.particles, b = this.drops, c = 0; (d = a[c]); c++) (d.X += d.speedX), (d.Y += d.speedY + 5), d.Y > height - 15 && (a.splice(c--, 1), this.explosion(d.X, d.Y, d.color));
                        for (var e, c = 0; (e = b[c]); c++) (e.X += e.speedX), (e.Y += e.speedY), (e.radius -= 0.075), 0 < e.alpha ? (e.alpha -= 5e-3) : (e.alpha = 0), 0 > e.radius && b.splice(c--, 1);
                        for (var c = this.controls.rain; c--; ) this.buildRainParticle(Math.floor(Math.random() * width), -15);
                    }),
                    (rain.unbindCanvas = function () {
                        this.requestAnimFrame = function () {};
                    }),
                    (module.exports = rain);
            },
            {},
        ],
        32: [
            function (require, module, exports) {
                "use strict";
                var _modcheck = require("../utils/modcheck.js"),
                    _modcheck2 = _interopRequireDefault(_modcheck);
                function _interopRequireDefault(a) {
                    return a && a.__esModule ? a : { default: a };
                }
                var modal = require("../utils/modal.js"),
                    dubshover = {};
                (dubshover.id = "dubplus-dubs-hover"),
                    (dubshover.moduleName = "Show Dub info on Hover"),
                    (dubshover.description = "Show Dub info on Hover."),
                    (dubshover.category = "General"),
                    (dubshover.resetGrabs = function () {
                        window.dubplus.dubs.grabs = [];
                    }),
                    (dubshover.grabInfoWarning = function () {
                        this.warned &&
                            ((this.warned = !0),
                            modal.create({
                                title: "Grab Vote Info",
                                content:
                                    "Please note that this feature is currently still in development. We are waiting on the ability to pull grab vote information from QueUp on load. Until then the only grabs you will be able to see are those you are present in the room for.",
                            }));
                    }),
                    (dubshover.showDubsOnHover = function () {
                        var a = this;
                        this.resetDubs(),
                            QueUp.Events.bind("realtime:room_playlist-dub", this.dubWatcher.bind(this)),
                            QueUp.Events.bind("realtime:room_playlist-queue-update-grabs", this.grabWatcher.bind(this)),
                            QueUp.Events.bind("realtime:user-leave", this.dubUserLeaveWatcher.bind(this)),
                            QueUp.Events.bind("realtime:room_playlist-update", this.resetDubs.bind(this)),
                            QueUp.Events.bind("realtime:room_playlist-update", this.resetGrabs.bind(this));
                        var b = $(".dubup").first().parent("li"),
                            c = $(".dubdown").first().parent("li"),
                            d = $(".add-to-playlist-button").first().parent("li");
                        $(b).addClass("dubplus-updubs-hover"),
                            $(c).addClass("dubplus-downdubs-hover"),
                            $(d).addClass("dubplus-grabs-hover"),
                            $(b).click(function (f) {
                                $("#dubplus-updubs-container").remove();
                                var g = f.clientX,
                                    h = f.clientY;
                                if (!g || !h || isNaN(g) || isNaN(h)) return $("#dubplus-downdubs-container").remove();
                                var j = document.elementFromPoint(g, h);
                                ($(j).hasClass("dubplus-updubs-hover") || 0 < $(j).parents(".dubplus-updubs-hover").length) &&
                                    setTimeout(function () {
                                        $(b).mouseenter();
                                    }, 250);
                            }),
                            $(c).click(function (f) {
                                $("#dubplus-downdubs-container").remove();
                                var g = f.clientX,
                                    h = f.clientY;
                                if (!g || !h || isNaN(g) || isNaN(h)) return $("#dubplus-downdubs-container").remove();
                                var j = document.elementFromPoint(g, h);
                                ($(j).hasClass("dubplus-downdubs-hover") || 0 < $(j).parents(".dubplus-downdubs-hover").length) &&
                                    setTimeout(function () {
                                        $(c).mouseenter();
                                    }, 250);
                            }),
                            $(d).click(function (f) {
                                $("#dubplus-grabs-container").remove();
                                var g = f.clientX,
                                    h = f.clientY;
                                if (!g || !h || isNaN(g) || isNaN(h)) return $("#dubplus-grabs-container").remove();
                                var j = document.elementFromPoint(g, h);
                                ($(j).hasClass("dubplus-grabs-hover") || 0 < $(j).parents(".dubplus-grabs-hover").length) &&
                                    setTimeout(function () {
                                        $(d).mouseenter();
                                    }, 250);
                            }),
                            $(b).mouseenter(function (f) {
                                var g = f.currentTarget;
                                if (!(0 < $("#dubplus-updubs-container").length)) {
                                    var k,
                                        h = $(b).innerWidth() + $(c).innerWidth(),
                                        j = $(".dubup").hasClass("voted") ? $(".dubup").css("background-color") : $(".dubup").find(".icon-arrow-up").css("color");
                                    0 < window.dubplus.dubs.upDubs.length
                                        ? ((k = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover" style="border-color: ' + j + '">'),
                                          window.dubplus.dubs.upDubs.forEach(function (o) {
                                              k +=
                                                  '<li class="preview-dubinfo-item users-previews dubplus-updubs-hover"><div class="dubinfo-image"><img src="https://api.QueUp.net/user/' +
                                                  o.userid +
                                                  '/image"></div><span class="dubinfo-text">@' +
                                                  o.username +
                                                  "</span></li>";
                                          }),
                                          (k += "</ul>"))
                                        : (k = '<div id="dubinfo-preview" class="dubinfo-show dubplus-updubs-hover dubplus-no-dubs" style="border-color: ' + j + '">No updubs have been casted yet!</div>');
                                    var l = document.createElement("div");
                                    (l.id = "dubplus-updubs-container"), (l.className = "dubinfo-show dubplus-updubs-hover"), (l.innerHTML = k), (l.style.visibility = "hidden"), document.body.appendChild(l);
                                    var m = g.getBoundingClientRect(),
                                        n = document.body.getBoundingClientRect();
                                    (l.style.visibility = ""),
                                        (l.style.width = h + "px"),
                                        (l.style.top = m.top - 150 + "px"),
                                        n.right - m.left >= h ? (l.style.left = m.left + "px") : (l.style.right = 0),
                                        document.body.appendChild(l),
                                        $(g).addClass("dubplus-updubs-hover"),
                                        $(document.body).on("click", ".preview-dubinfo-item", function (o) {
                                            var p = $(o.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
                                            a.updateChatInputWithString(p);
                                        }),
                                        $(".dubplus-updubs-hover").mouseleave(function (o) {
                                            var p = o.clientX,
                                                q = o.clientY;
                                            if (!p || !q || isNaN(p) || isNaN(q)) return $("#dubplus-downdubs-container").remove();
                                            var r = document.elementFromPoint(p, q);
                                            $(r).hasClass("dubplus-updubs-hover") || $(r).hasClass("ps-scrollbar-y") || !(0 >= $(r).parent(".dubplus-updubs-hover").length) || $("#dubplus-updubs-container").remove();
                                        });
                                }
                            }),
                            $(c).mouseenter(function (f) {
                                var g = f.currentTarget;
                                if (!(0 < $("#dubplus-downdubs-container").length)) {
                                    var k,
                                        h = $(b).innerWidth() + $(c).innerWidth(),
                                        j = $(".dubdown").hasClass("voted") ? $(".dubdown").css("background-color") : $(".dubdown").find(".icon-arrow-down").css("color");
                                    (0, _modcheck2.default)(QueUp.session.id)
                                        ? 0 < window.dubplus.dubs.downDubs.length
                                            ? ((k = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover" style="border-color: ' + j + '">'),
                                              window.dubplus.dubs.downDubs.forEach(function (o) {
                                                  k +=
                                                      '<li class="preview-dubinfo-item users-previews dubplus-downdubs-hover"><div class="dubinfo-image"><img src="https://api.QueUp.net/user/' +
                                                      o.userid +
                                                      '/image"></div><span class="dubinfo-text">@' +
                                                      o.username +
                                                      "</span></li>";
                                              }),
                                              (k += "</ul>"))
                                            : (k = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-no-dubs" style="border-color: ' + j + '">No downdubs have been casted yet!</div>')
                                        : (k = '<div id="dubinfo-preview" class="dubinfo-show dubplus-downdubs-hover dubplus-downdubs-unauthorized" style="border-color: ' + j + '">You must be at least a mod to view downdubs!</div>');
                                    var l = document.createElement("div");
                                    (l.id = "dubplus-downdubs-container"), (l.className = "dubinfo-show dubplus-downdubs-hover"), (l.innerHTML = k), (l.style.visibility = "hidden"), document.body.appendChild(l);
                                    var m = g.getBoundingClientRect(),
                                        n = document.body.getBoundingClientRect();
                                    (l.style.visibility = ""),
                                        (l.style.width = h + "px"),
                                        (l.style.top = m.top - 150 + "px"),
                                        n.right - m.left >= h ? (l.style.left = m.left + "px") : (l.style.right = 0),
                                        document.body.appendChild(l),
                                        $(g).addClass("dubplus-downdubs-hover"),
                                        $(document.body).on("click", ".preview-dubinfo-item", function (o) {
                                            var p = $(o.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
                                            a.updateChatInputWithString(p);
                                        }),
                                        $(".dubplus-downdubs-hover").mouseleave(function (o) {
                                            var p = o.clientX,
                                                q = o.clientY;
                                            if (!p || !q || isNaN(p) || isNaN(q)) return $("#dubplus-downdubs-container").remove();
                                            var r = document.elementFromPoint(p, q);
                                            $(r).hasClass("dubplus-downdubs-hover") || $(r).hasClass("ps-scrollbar-y") || !(0 >= $(r).parent(".dubplus-downdubs-hover").length) || $("#dubplus-downdubs-container").remove();
                                        });
                                }
                            }),
                            $(d).mouseenter(function (f) {
                                var g = f.currentTarget;
                                if (!(0 < $("#dubplus-grabs-container").length)) {
                                    var k,
                                        h = $(b).innerWidth() + $(d).innerWidth(),
                                        j = $(".add-to-playlist-button").hasClass("grabbed") ? $(".add-to-playlist-button").css("background-color") : $(".add-to-playlist-button").find(".icon-heart").css("color");
                                    0 < window.dubplus.dubs.grabs.length
                                        ? ((k = '<ul id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover" style="border-color: ' + j + '">'),
                                          window.dubplus.dubs.grabs.forEach(function (o) {
                                              k +=
                                                  '<li class="preview-dubinfo-item users-previews dubplus-grabs-hover"><div class="dubinfo-image"><img src="https://api.QueUp.net/user/' +
                                                  o.userid +
                                                  '/image"></div><span class="dubinfo-text">@' +
                                                  o.username +
                                                  "</span></li>";
                                          }),
                                          (k += "</ul>"))
                                        : (k = '<div id="dubinfo-preview" class="dubinfo-show dubplus-grabs-hover dubplus-no-grabs" style="border-color: ' + j + "\">This song hasn't been grabbed yet!</div>");
                                    var l = document.createElement("div");
                                    (l.id = "dubplus-grabs-container"), (l.className = "dubinfo-show dubplus-grabs-hover"), (l.innerHTML = k), (l.style.visibility = "hidden"), document.body.appendChild(l);
                                    var m = g.getBoundingClientRect(),
                                        n = document.body.getBoundingClientRect();
                                    (l.style.visibility = ""),
                                        (l.style.width = h + "px"),
                                        (l.style.top = m.top - 150 + "px"),
                                        n.right - m.left >= h ? (l.style.left = m.left + "px") : (l.style.right = 0),
                                        document.body.appendChild(l),
                                        $(g).addClass("dubplus-grabs-hover"),
                                        $(document.body).on("click", ".preview-dubinfo-item", function (o) {
                                            var p = $(o.currentTarget).find(".dubinfo-text")[0].innerHTML + " ";
                                            a.updateChatInputWithString(p);
                                        }),
                                        $(".dubplus-grabs-hover").mouseleave(function (o) {
                                            var p = o.clientX,
                                                q = o.clientY;
                                            if (!p || !q || isNaN(p) || isNaN(q)) return $("#dubplus-grabs-container").remove();
                                            var r = document.elementFromPoint(p, q);
                                            $(r).hasClass("dubplus-grabs-hover") || $(r).hasClass("ps-scrollbar-y") || !(0 >= $(r).parent(".dubplus-grabs-hover").length) || $("#dubplus-grabs-container").remove();
                                        });
                                }
                            });
                    }),
                    (dubshover.stopDubsOnHover = function () {
                        QueUp.Events.unbind("realtime:room_playlist-dub", this.dubWatcher),
                            QueUp.Events.unbind("realtime:room_playlist-queue-update-grabs", this.grabWatcher),
                            QueUp.Events.unbind("realtime:user-leave", this.dubUserLeaveWatcher),
                            QueUp.Events.unbind("realtime:room_playlist-update", this.resetDubs),
                            QueUp.Events.unbind("realtime:room_playlist-update", this.resetGrabs);
                    }),
                    (dubshover.dubUserLeaveWatcher = function (a) {
                        0 <
                            $.grep(window.dubplus.dubs.upDubs, function (b) {
                                return b.userid === a.user._id;
                            }).length &&
                            $.each(window.dubplus.dubs.upDubs, function (b) {
                                if (window.dubplus.dubs.upDubs[b].userid === a.user._id) return window.dubplus.dubs.upDubs.splice(b, 1), !1;
                            }),
                            0 <
                                $.grep(window.dubplus.dubs.downDubs, function (b) {
                                    return b.userid === a.user._id;
                                }).length &&
                                $.each(window.dubplus.dubs.downDubs, function (b) {
                                    if (window.dubplus.dubs.downDubs[b].userid === a.user._id) return window.dubplus.dubs.downDubs.splice(b, 1), !1;
                                }),
                            0 <
                                $.grep(window.dubplus.dubs.grabs, function (b) {
                                    return b.userid === a.user._id;
                                }).length &&
                                $.each(window.dubplus.dubs.grabs, function (b) {
                                    if (window.dubplus.dubs.grabs[b].userid === a.user._id) return window.dubplus.dubs.grabs.splice(b, 1), !1;
                                });
                    }),
                    (dubshover.grabWatcher = function (a) {
                        0 >=
                            $.grep(window.dubplus.dubs.grabs, function (b) {
                                return b.userid === a.user._id;
                            }).length && window.dubplus.dubs.grabs.push({ userid: a.user._id, username: a.user.username });
                    }),
                    (dubshover.updateChatInputWithString = function (a) {
                        $("#chat-txt-message").val(a).focus();
                    }),
                    (dubshover.deleteChatMessageClientSide = function (a) {
                        $(a).parent("li")[0].remove();
                    }),
                    (dubshover.dubWatcher = function (a) {
                        "updub" === a.dubtype
                            ? (0 >=
                                  $.grep(window.dubplus.dubs.upDubs, function (c) {
                                      return c.userid === a.user._id;
                                  }).length && window.dubplus.dubs.upDubs.push({ userid: a.user._id, username: a.user.username }),
                              0 <
                                  $.grep(window.dubplus.dubs.downDubs, function (c) {
                                      return c.userid === a.user._id;
                                  }).length &&
                                  $.each(window.dubplus.dubs.downDubs, function (c) {
                                      if (window.dubplus.dubs.downDubs[c].userid === a.user._id) return window.dubplus.dubs.downDubs.splice(c, 1), !1;
                                  }))
                            : "downdub" === a.dubtype &&
                              (0 >=
                                  $.grep(window.dubplus.dubs.downDubs, function (c) {
                                      return c.userid === a.user._id;
                                  }).length &&
                                  (0, _modcheck2.default)(QueUp.session.id) &&
                                  window.dubplus.dubs.downDubs.push({ userid: a.user._id, username: a.user.username }),
                              0 <
                                  $.grep(window.dubplus.dubs.upDubs, function (c) {
                                      return c.userid === a.user._id;
                                  }).length &&
                                  $.each(window.dubplus.dubs.upDubs, function (c) {
                                      if (window.dubplus.dubs.upDubs[c].userid === a.user._id) return window.dubplus.dubs.upDubs.splice(c, 1), !1;
                                  }));
                        var b = new Date() - new Date(QueUp.room.player.activeSong.attributes.song.played);
                        1e3 > b ||
                            (window.dubplus.dubs.upDubs.length === QueUp.room.player.activeSong.attributes.song.updubs
                                ? (0, _modcheck2.default)(QueUp.session.id) && window.dubplus.dubs.downDubs.length !== QueUp.room.player.activeSong.attributes.song.downdubs && this.resetDubs()
                                : this.resetDubs());
                    }),
                    (dubshover.resetDubs = function () {
                        (window.dubplus.dubs.upDubs = []), (window.dubplus.dubs.downDubs = []);
                        var a = "https://api.QueUp.net/room/" + QueUp.room.model.id + "/playlist/active/dubs";
                        $.getJSON(a, function (b) {
                            b.data.upDubs.forEach(function (c) {
                                if (
                                    !(
                                        0 <
                                        $.grep(window.dubplus.dubs.upDubs, function (f) {
                                            return f.userid === c.userid;
                                        }).length
                                    )
                                ) {
                                    var d;
                                    QueUp.room.users.collection.findWhere({ userid: c.userid }) && QueUp.room.users.collection.findWhere({ userid: c.userid }).attributes
                                        ? (d = QueUp.room.users.collection.findWhere({ userid: c.userid }).attributes._user.username)
                                        : $.getJSON("https://api.QueUp.net/user/" + c.userid, function (f) {
                                              f && f.userinfo && (d = f.userinfo.username);
                                          }),
                                        d && window.dubplus.dubs.upDubs.push({ userid: c.userid, username: d });
                                }
                            }),
                                (0, _modcheck2.default)(QueUp.session.id) &&
                                    b.data.downDubs.forEach(function (c) {
                                        if (
                                            !(
                                                0 <
                                                $.grep(window.dubplus.dubs.downDubs, function (f) {
                                                    return f.userid === c.userid;
                                                }).length
                                            )
                                        ) {
                                            var d;
                                            QueUp.room.users.collection.findWhere({ userid: c.userid }) && QueUp.room.users.collection.findWhere({ userid: c.userid }).attributes
                                                ? (d = QueUp.room.users.collection.findWhere({ userid: c.userid }).attributes._user.username)
                                                : $.getJSON("https://api.QueUp.net/user/" + c.userid, function (f) {
                                                      d = f.userinfo.username;
                                                  }),
                                                window.dubplus.dubs.downDubs.push({ userid: c.userid, username: QueUp.room.users.collection.findWhere({ userid: c.userid }).attributes._user.username });
                                        }
                                    });
                        });
                    }),
                    (dubshover.init = function () {
                        window.dubplus.dubs = { upDubs: [], downDubs: [], grabs: [] };
                    }),
                    (dubshover.turnOn = function () {
                        this.grabInfoWarning(), this.showDubsOnHover();
                    }),
                    (dubshover.turnOff = function () {
                        this.stopDubsOnHover();
                    }),
                    (module.exports = dubshover);
            },
            { "../utils/modal.js": 42, "../utils/modcheck.js": 43 },
        ],
        33: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-show-timestamp"),
                    (myModule.moduleName = "Show Timestamps"),
                    (myModule.description = "Toggle always showing chat message timestamps."),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-show-timestamp");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-show-timestamp");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        34: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = function () {
                        $(".player_sharing").append('<span class="icon-mute snooze_btn"></span>'),
                            $("body").on("mouseover", ".snooze_btn", snooze_tooltip),
                            $("body").on("mouseout", ".snooze_btn", hide_snooze_tooltip),
                            $("body").on("click", ".snooze_btn", snooze);
                    });
                var snooze_tooltip = function () {
                        $(this).append(
                            '<div class="snooze_tooltip" style="position: absolute;font: 1rem/1.5 proxima-nova,sans-serif;display: block;left: -33px;cursor: pointer;border-radius: 1.5rem;padding: 8px 16px;background: #fff;font-weight: 700;font-size: 13.6px;text-transform: uppercase;color: #000;opacity: .8;text-align: center;z-index: 9;">Mute current song</div>'
                        );
                    },
                    hide_snooze_tooltip = function () {
                        $(".snooze_tooltip").remove();
                    },
                    eventUtils = { currentVol: 50, snoozed: !1 },
                    eventSongAdvance = function (a) {
                        if (2 > a.startTime) return eventUtils.snoozed && (QueUp.room.player.setVolume(eventUtils.currentVol), (eventUtils.snoozed = !1)), !0;
                    },
                    snooze = function () {
                        eventUtils.snoozed || QueUp.room.player.muted_player || !(2 < QueUp.playerController.volume)
                            ? eventUtils.snoozed && (QueUp.room.player.setVolume(eventUtils.currentVol), QueUp.room.player.updateVolumeBar(), (eventUtils.snoozed = !1))
                            : ((eventUtils.currentVol = QueUp.playerController.volume), QueUp.room.player.mutePlayer(), (eventUtils.snoozed = !0), QueUp.Events.bind("realtime:room_playlist-update", eventSongAdvance));
                    };
            },
            {},
        ],
        35: [
            function (require, module, exports) {
                "use strict";
                var options = require("../utils/options.js");
                module.exports = {
                    id: "dubplus-snow",
                    moduleName: "Snow",
                    description: "Make it snow!",
                    category: "General",
                    doSnow: function doSnow() {
                        $(document).snowfall({ round: !0, shadow: !0, flakeCount: 50, minSize: 1, maxSize: 5, minSpeed: 5, maxSpeed: 5 });
                    },
                    turnOn: function turnOn() {
                        var a = this;
                        $.snowfall
                            ? this.doSnow()
                            : $.getScript("https://cdn.jsdelivr.net/gh/loktar00/JQuery-Snowfall/src/snowfall.jquery.js")
                                  .done(function () {
                                      a.doSnow();
                                  })
                                  .fail(function (b, c, d) {
                                      options.toggleAndSave(a.id, !1), console.error("Could not load snowfall jquery plugin", d);
                                  });
                    },
                    turnOff: function turnOff() {
                        $.snowfall && $(document).snowfall("clear");
                    },
                };
            },
            { "../utils/options.js": 45 },
        ],
        36: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-spacebar-mute"),
                    (myModule.moduleName = "Spacebar Mute"),
                    (myModule.description = "Turn on/off the ability to mute current song with the spacebar."),
                    (myModule.category = "Settings"),
                    (myModule.turnOn = function () {
                        $(document).bind("keypress.key32", function (a) {
                            var b = a.target.tagName.toLowerCase();
                            32 === a.which && "input" !== b && "textarea" !== b && QueUp.room.player.mutePlayer();
                        });
                    }),
                    (myModule.turnOff = function () {
                        $(document).unbind("keypress.key32");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        37: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-split-chat"),
                    (myModule.moduleName = "Split Chat"),
                    (myModule.description = "Toggle Split Chat UI enhancement"),
                    (myModule.category = "User Interface"),
                    (myModule.turnOn = function () {
                        $("body").addClass("dubplus-split-chat");
                    }),
                    (myModule.turnOff = function () {
                        $("body").removeClass("dubplus-split-chat");
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        38: [
            function (require, module, exports) {
                "use strict";
                var myModule = {};
                (myModule.id = "dubplus-updubs"),
                    (myModule.moduleName = "Updubs in Chat"),
                    (myModule.description = "Toggle showing updubs in the chat box"),
                    (myModule.category = "General"),
                    (myModule.updubWatcher = function (a) {
                        var b = QueUp.session.get("username"),
                            c = QueUp.room.users.collection.findWhere({ userid: QueUp.room.player.activeSong.attributes.song.userid }).attributes._user.username;
                        if (b === c && "updub" === a.dubtype) {
                            var d =
                                '\n      <li class="dubplus-chat-system dubplus-chat-system-updub">\n        <div class="chatDelete" onclick="dubplus.deleteChatMessageClientSide(this)">\n          <span class="icon-close"></span>\n        </div>\n        <div class="text">\n          @' +
                                a.user.username +
                                " has updubbed your song " +
                                QueUp.room.player.activeSong.attributes.songInfo.name +
                                "\n        </div>\n      </li>";
                            $("ul.chat-main").append(d);
                        }
                    }),
                    (myModule.turnOn = function () {
                        QueUp.Events.bind("realtime:room_playlist-dub", this.updubWatcher),
                            "function" != typeof window.dubplus.deleteChatMessageClientSide &&
                                (window.dubplus.deleteChatMessageClientSide = function (a) {
                                    $(a).parent("li")[0].remove();
                                });
                    }),
                    (myModule.turnOff = function () {
                        QueUp.Events.unbind("realtime:room_playlist-dub", this.updubWatcher);
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        39: [
            function (require, module, exports) {
                "use strict";
                var myModule = { id: "warn_redirect", moduleName: "Warn On Navigation", description: "Warns you when accidentally clicking on a link that takes you out of QueUp.", category: "Settings" };
                function unloader(a) {
                    var b = "";
                    return (a.returnValue = b), b;
                }
                (myModule.turnOn = function () {
                    window.addEventListener("beforeunload", unloader);
                }),
                    (myModule.turnOff = function () {
                        window.removeEventListener("beforeunload", unloader);
                    }),
                    (module.exports = myModule);
            },
            {},
        ],
        40: [
            function (require, module, exports) {
                (function (TIME_STAMP) {
                    "use strict";
                    var settings = require("../lib/settings.js"),
                        makeLink = function (a, b) {
                            var c = document.createElement("link");
                            return (c.rel = "stylesheet"), (c.type = "text/css"), (c.className = a || ""), (c.href = b), c;
                        },
                        load = function (a, b) {
                            if (a) {
                                var c = makeLink(b, settings.srcRoot + a + "?" + TIME_STAMP);
                                document.head.insertAdjacentElement("beforeend", c);
                            }
                        },
                        loadExternal = function (a, b) {
                            if (a) {
                                var c = makeLink(b, a);
                                document.head.insertAdjacentElement("beforeend", c);
                            }
                        };
                    module.exports = { load: load, loadExternal: loadExternal };
                }.call(this, "1571518443709"));
            },
            { "../lib/settings.js": 8 },
        ],
        41: [
            function (require, module, exports) {
                "use strict";
                var GetJSON = function (a, b, c) {
                    function d(g, h) {
                        var i = new XMLHttpRequest();
                        if ((i.open("GET", g), c)) for (var j in c) c.hasOwnProperty(j) && i.setRequestHeader(j, c[j]);
                        i.send(),
                            (i.onload = function () {
                                var k = i.responseText;
                                "function" == typeof h && h(k), e && window.dispatchEvent(e);
                            });
                    }
                    var e = b ? new Event(b) : null;
                    return {
                        done: function done(g) {
                            new d(a, g);
                        },
                    };
                };
                module.exports = GetJSON;
            },
            {},
        ],
        42: [
            function (require, module, exports) {
                "use strict";
                function makeButtons(a) {
                    var b = "";
                    return a ? ((b += '<button id="dp-modal-cancel">cancel</button>'), (b += '<button id="dp-modal-confirm">okay</button>')) : (b += '<button id="dp-modal-cancel">close</button>'), b;
                }
                var create = function (a) {
                        var c = Object.assign({}, { title: "Dub+", content: "", value: "", placeholder: null, maxlength: 999, confirmCallback: null }, a),
                            d = "";
                        c.placeholder && ((d = '<textarea placeholder="' + c.placeholder + '" maxlength="' + c.maxlength + '">'), (d += c.value), (d += "</textarea>"));
                        var f = [
                            '<div class="dp-modal">',
                            '<aside class="container">',
                            '<div class="title">',
                            "<h1>" + c.title + "</h1>",
                            "</div>",
                            '<div class="content">',
                            "<p>" + c.content + "</p>",
                            d,
                            "</div>",
                            '<div class="dp-modal-buttons">',
                            makeButtons(c.confirmCallback),
                            "</div>",
                            "</aside>",
                            "</div>",
                        ].join("");
                        document.body.insertAdjacentHTML("beforeend", f),
                            "function" == typeof c.confirmCallback &&
                                $("#dp-modal-confirm").one("click", function () {
                                    c.confirmCallback(), $(".dp-modal").remove();
                                }),
                            $("#dp-modal-cancel").one("click", function () {
                                $(".dp-modal").remove();
                            }),
                            $(document).one("keyup", function (g) {
                                13 === g.keyCode && "function" == typeof c.confirmCallback && (c.confirmCallback(), $(".dp-modal").remove()), 27 === g.keyCode && $(".dp-modal").remove();
                            });
                    },
                    close = function () {
                        $(".dp-modal").remove();
                    };
                module.exports = { create: create, close: close };
            },
            {},
        ],
        43: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 }),
                    (exports.default = function (a) {
                        return QueUp.helpers.isQueUpAdmin(a) || QueUp.room.users.getIfOwner(a) || QueUp.room.users.getIfManager(a) || QueUp.room.users.getIfMod(a);
                    });
            },
            {},
        ],
        44: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.notifyCheckPermission = notifyCheckPermission), (exports.showNotification = showNotification);
                var modal = require("../utils/modal.js"),
                    isActiveTab = !0;
                (window.onfocus = function () {
                    isActiveTab = !0;
                }),
                    (window.onblur = function () {
                        isActiveTab = !1;
                    });
                var onDenyDismiss = function () {
                    modal.create({ title: "Desktop Notifications", content: "You have dismissed or chosen to deny the request to allow desktop notifications. Reset this choice by clearing your cache for the site." });
                };
                function notifyCheckPermission(a) {
                    var b = "function" == typeof a ? a : function () {};
                    return "Notification" in window
                        ? "granted" === Notification.permission
                            ? b(!0)
                            : "denied" === Notification.permission
                            ? (onDenyDismiss(), b(!1))
                            : void Notification.requestPermission().then(function (c) {
                                  return "denied" === c || "default" === c ? (onDenyDismiss(), void b(!1)) : void b(!0);
                              })
                        : (modal.create({ title: "Desktop Notifications", content: "Sorry this browser does not support desktop notifications.  Please use the latest version of Chrome or FireFox" }), b(!1));
                }
                function showNotification(a) {
                    var c = Object.assign({}, { title: "New Message", content: "", ignoreActiveTab: !1, callback: null, wait: 5e3 }, a);
                    if (!0 != isActiveTab || c.ignoreActiveTab) {
                        var d = { body: c.content, icon: "https://res.cloudinary.com/hhberclba/image/upload/c_lpad,h_100,w_100/v1400351432/QueUp_new_logo_fvpxa6.png" },
                            e = new Notification(c.title, d);
                        (e.onclick = function () {
                            window.focus(), "function" == typeof c.callback && c.callback(), e.close();
                        }),
                            setTimeout(e.close.bind(e), c.wait);
                    }
                }
            },
            { "../utils/modal.js": 42 },
        ],
        45: [
            function (require, module, exports) {
                "use strict";
                var settings = require("../lib/settings.js"),
                    saveOption = function (a, b, c) {
                        (settings[a][b] = c), localStorage.setItem("dubplusUserSettings", JSON.stringify(settings));
                    },
                    getAllOptions = function () {
                        var a = localStorage.dubplusUserSettings;
                        return a ? JSON.parse(a) : settings;
                    },
                    toggle = function (a, b) {
                        var c = $(a);
                        c.length && (!0 === b ? c.addClass("dubplus-switch-on") : c.removeClass("dubplus-switch-on"));
                    },
                    toggleAndSave = function (a, b) {
                        return toggle("#" + a, b), saveOption("options", a, b);
                    };
                module.exports = { toggle: toggle, toggleAndSave: toggleAndSave, getAllOptions: getAllOptions, saveOption: saveOption };
            },
            { "../lib/settings.js": 8 },
        ],
        46: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 }), (exports.default = preload);
                var settings = require("../lib/settings.js");
                function preload() {
                    var a = [
                            "font-family: 'Trebuchet MS', Helvetica, sans-serif",
                            "z-index: 2147483647",
                            "color: white",
                            "position: fixed",
                            "top: 69px",
                            "right: 13px",
                            "background: #222",
                            "padding: 10px",
                            "line-height: 1",
                            "-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)",
                            "-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)",
                            "box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75)",
                            "border-radius: 5px",
                            "overflow: hidden",
                            "width: 230px",
                        ].join(";"),
                        b = ["float:left", "width: 26px", "margin-right:5px"].join(";"),
                        c = ["display: table-cell", "width: 10000px", "padding-top:5px"].join(";"),
                        d =
                            '\n    <div class="dubplus-waiting" style="' +
                            a +
                            '">\n      <div style="' +
                            b +
                            '">\n        <img src="' +
                            settings.srcRoot +
                            '/images/dubplus.svg" alt="DubPlus icon">\n      </div>\n      <span style="' +
                            c +
                            '">\n        Temporary DubPlus fix by Mozzle launched. Waiting for QueUp...\n      </span>\n    </div>\n  ';
                    document.body.insertAdjacentHTML("afterbegin", d);
                }
            },
            { "../lib/settings.js": 8 },
        ],
        47: [
            function (require, module, exports) {
                "use strict";
                Object.defineProperty(exports, "__esModule", { value: !0 });
                function deepCheck(a, b) {
                    for (var c = a.split("."), d = c.length, e = b || window, f = 0; f < d; f++) {
                        if ("undefined" == typeof e[c[f]]) return !1;
                        e = e[c[f]];
                    }
                    return !0;
                }
                function arrayDeepCheck(a, b) {
                    for (var c = a.length, d = b || window, e = 0; e < c; e++) if (!deepCheck(a[e], d)) return console.log(a[e], "is not found yet"), !1;
                    return !0;
                }
                function WaitFor(a, b) {
                    if ("string" != typeof a && !Array.isArray(a)) return void console.warn("WaitFor: invalid first argument");
                    var d = function _cb() {},
                        e = function _failCB() {},
                        f = Array.isArray(a) ? arrayDeepCheck : deepCheck,
                        g = Object.assign({}, { interval: 500, seconds: 5 }, b),
                        h = 0,
                        j = (1e3 * g.seconds) / g.interval,
                        k = function check() {
                            h++;
                            var n = f(a);
                            return n ? d() : h < j ? void window.setTimeout(k, g.interval) : e();
                        };
                    return {
                        then: function then(n) {
                            return "function" == typeof n && (d = n), window.setTimeout(k, g.interval), this;
                        },
                        fail: function fail(n) {
                            return "function" == typeof n && (e = n), this;
                        },
                    };
                }
                exports.default = WaitFor;
            },
            {},
        ],
    },
    {},
    [1]
);
