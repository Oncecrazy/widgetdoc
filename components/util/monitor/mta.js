! function(t, e) {
    function n() {
        var n = "-",
            i = a.encode,
            o = t.screen,
            r = t.navigator,
            s = this._getViewport();
        this.screen = o ? o.width + "x" + o.height : n, this.viewport = s.width + "x" + s.height, this.charset = i(e.characterSet ? e.characterSet : e.charset ? e.charset : n), this.language = (r && r.language ? r.language : r && r.browserLanguage ? r.browserLanguage : n).toLowerCase(), this.javaEnabled = r && r.javaEnabled() ? 1 : 0, this.isFirstVisit = !1, this.setCookie()
    }

    function i(t) {
        this.url = t
    }

    function o(t) {
        this._config = a.merge({
            sampleRate: 100,
            useCombo: !0,
            autotags: !0,
            beacon: e.location.protocol + "//frep.meituan." + ("https:" === e.location.protocol ? "com" : "net") + "/_.gif"
        }, t || {}), this._client = new n, this._beacon = new i(this._config.beacon), this._queue = [], this._timer = null, this._app = null, this._tags = {}, this.visitorCode = a.random()
    }
    var r = Object.prototype.hasOwnProperty,
        a = {
            hash: function(t) {
                var e, n = 1,
                    i = 0;
                if (t)
                    for (n = 0, e = t.length - 1; e >= 0; e--) i = t.charCodeAt(e), n = (n << 6 & 268435455) + i + (i << 14), i = 266338304 & n, n = 0 !== i ? n ^ i >> 21 : n;
                return n
            },
            keyPaths: function(t, e) {
                function n(t) {
                    return o.length >= 10 ? void e(o.concat(), t) : t instanceof Object ? void i(t).forEach(function(e) {
                        o.push(e), n(t[e]), o.pop()
                    }) : void e(o.concat(), t)
                }
                var i = Object.keys || function(t) {
                        var e = [];
                        for (var n in t) r.call(t, n) && e.push(n);
                        return e
                    },
                    o = [];
                n(t)
            },
            whitelistify: function(t, e) {
                var n = [];
                a.keyPaths(e, function(t) {
                    n.push(t.join("."))
                });
                var i = "|" + n.join("|") + "|",
                    o = {};
                return a.keyPaths(t, function(t, e) {
                    if (-1 !== i.indexOf("|" + t.join(".") + "|"))
                        for (var n = o, r = 0; r < t.length; r++) n[t[r]] || (n[t[r]] = {}), r === t.length - 1 && (n[t[r]] = e), n = n[t[r]]
                }), o
            },
            random: function() {
                return Math.round(2147483647 * Math.random())
            },
            stringify: function(t) {
                if ("undefined" != typeof JSON && JSON.stringify) return JSON.stringify(t);
                var e = typeof t;
                switch (e) {
                    case "string":
                        return '"' + t + '"';
                    case "boolean":
                    case "number":
                        return String(t);
                    case "object":
                        if (null === t) return "null";
                        var n = !1,
                            i = "";
                        for (var o in t)
                            if (r.call(t, o)) {
                                var s = "" + o,
                                    u = a.stringify(t[o]);
                                u.length && (n ? i += "," : n = !0, i += t instanceof Array ? u : '"' + s + '":' + u)
                            }
                        return t instanceof Array ? "[" + i + "]" : "{" + i + "}";
                    default:
                        return ""
                }
            },
            debug: function(t, e) {
                "undefined" != typeof console && console.log && (e && console.warn ? console.warn(t) : console.log(t))
            },
            encode: function(t, e) {
                return encodeURIComponent instanceof Function ? e ? encodeURI(t) : encodeURIComponent(t) : escape(t)
            },
            decode: function(t, e) {
                var n;
                if (t = t.split("+").join(" "), decodeURIComponent instanceof Function) try {
                    n = e ? decodeURI(t) : decodeURIComponent(t)
                } catch (i) {
                    n = unescape(t)
                } else n = unescape(t);
                return n
            },
            merge: function(t, e) {
                for (var n in e) r.call(e, n) && (t[n] = e[n]);
                return t
            },
            buildQueryString: function(t) {
                var e, n = a.encode,
                    i = [];
                for (e in t)
                    if (r.call(t, e)) {
                        var o = "object" == typeof t[e] ? a.stringify(t[e]) : t[e];
                        i.push(n(e) + "=" + n(o))
                    }
                return i.join("&")
            },
            addEventListener: function(e, n, i) {
                return t.addEventListener ? t.addEventListener(e, n, i) : t.attachEvent ? t.attachEvent("on" + e, n) : void 0
            },
            onload: function(t) {
                "complete" === e.readyState ? t() : a.addEventListener("load", t, !1)
            },
            domready: function(t) {
                "interactive" === e.readyState ? t() : e.addEventListener ? e.addEventListener("DOMContentLoaded", t, !1) : e.attachEvent && e.attachEvent("onreadystatechange", t)
            },
            onunload: function(t) {
                a.addEventListener("unload", t, !1), a.addEventListener("beforeunload", t, !1)
            },
            now: function() {
                return (new Date).getTime()
            },
            ajax: function(e) {
                if ("file:" !== t.location.protocol) {
                    var n, i = a.merge({
                        method: "GET",
                        async: !0
                    }, e);
                    if (t.XDomainRequest) try {
                        n = new t.XMLHttpRequest, n.open(i.method, i.url), n.send(a.stringify(i.data))
                    } catch (o) {} else {
                        if (!t.XMLHttpRequest) return;
                        if (n = new t.XMLHttpRequest, "withCredentials" in n) try {
                            n.open(i.method, i.url, i.async), n.setRequestHeader("Content-type", "application/json"), n.send(a.stringify(i.data))
                        } catch (o) {}
                    }
                }
            }
        },
        s = {
            queue: {},
            on: function(t, e) {
                "function" == typeof e && (this.queue[t] || (this.queue[t] = []), this.queue[t].push(e))
            },
            trigger: function(t) {
                var e, n = [];
                for (e = 1; e < arguments.length; e++) n.push(arguments[e]);
                if (this.queue[t])
                    for (e = 0; e < this.queue[t].length; e++) this.queue[t][e].apply(this, n)
            }
        },
        u = {
            get: function(t) {
                for (var n = e.cookie, i = t + "=", o = i.length, r = n.length, a = 0; r > a;) {
                    var s = a + o;
                    if (n.substring(a, s) === i) return this._getValue(s);
                    if (a = n.indexOf(" ", a) + 1, 0 === a) break
                }
                return ""
            },
            set: function(t, n, i, o, r, a) {
                r = r ? r : this._getDomain(), e.cookie = t + "=" + encodeURIComponent(n) + (i ? "; expires=" + i : "") + (o ? "; path=" + o : "; path=/") + (r ? "; domain=" + r : "") + (a ? "; secure" : "")
            },
            getExpire: function(t, e, n) {
                var i = new Date;
                return "number" == typeof t && "number" == typeof e && "number" == typeof e ? (i.setDate(i.getDate() + parseInt(t, 10)), i.setHours(i.getHours() + parseInt(e, 10)), i.setMinutes(i.getMinutes() + parseInt(n, 10)), i.toGMTString()) : void 0
            },
            _getValue: function(t) {
                var n = e.cookie,
                    i = n.indexOf(";", t);
                return -1 === i && (i = n.length), decodeURIComponent(n.substring(t, i))
            },
            _getDomain: function() {
                var t = e.domain;
                return "localhost" === t ? "" : ("undefined" != typeof M && M.DOMAIN_HOST && (t = "." + M.DOMAIN_HOST), "www." === t.substring(0, 4) && (t = t.substring(4)), t)
            }
        },
        c = "__mta";
    n.prototype = {
        setCookie: function() {
            var t = u.get(c),
                e = u.getExpire(720, 0, 0),
                n = a.now();
            if (t) t = t.split("."), t[2] = t[3], t[3] = n, t[4] = parseInt(t[4], 10) + 1, u.set(c, t.join("."), e), this.uuid = t[0];
            else {
                var i = this._hashInfo(),
                    o = n,
                    r = n,
                    s = n,
                    h = 1;
                t = [i, o, r, s, h].join("."), u.set(c, t, e), this.isFirstVisit = !0, this.uuid = i
            }
        },
        getInfo: function() {
            return {
                sr: this.screen,
                vp: this.viewport,
                csz: e.cookie ? e.cookie.length : 0,
                uuid: this.uuid
            }
        },
        _hashInfo: function() {
            var n = t.navigator,
                i = t.history.length;
            n = n.appName + n.version + this.language + n.platform + n.userAgent + this.javaEnabled + this.screen + (e.cookie ? e.cookie : "") + (e.referrer ? e.referrer : "");
            for (var o = n.length; i > 0;) n += i-- ^ o++;
            return a.hash(n)
        },
        _getViewport: function() {
            return null !== t.innerWidth ? {
                width: t.innerWidth,
                height: t.innerHeight
            } : "CSS1Compat" === e.compatMode ? {
                width: e.documentElement.clientWidth,
                height: e.documentElement.clientHeight
            } : {
                width: e.body.clientWidth,
                height: e.body.clientWidth
            }
        }
    }, i.MAX_URL_LENGTH = 2083, i.prototype = {
        config: function(t) {
            this.url = t
        },
        send: function(t) {
            t.version = o.VERSION;
            var e = a.buildQueryString(t);
            e.length && ((this.url + "?" + e).length <= i.MAX_URL_LENGTH ? this._sendByScript(e) : this.post(t))
        },
        post: function(t) {
            a.ajax({
                url: this.url,
                method: "POST",
                data: t
            })
        },
        _sendByScript: function(t) {
            var n = e.createElement("script");
            n.type = "text/javascript", n.async = !0, n.src = this.url + "?" + t;
            var i = e.getElementsByTagName("script")[0];
            i.parentNode.insertBefore(n, i)
        }
    };
    var h = 100;
    o.VERSION = "0.3.2", o.Plugins = {}, o.addPlugin = function(t, e) {
        if ("function" != typeof e.data) throw new Error("cannot add plugin: " + t);
        o.Plugins[t] = e
    }, o.prototype = {
        isInitialized: function() {
            return !!this._app
        },
        push: function() {
            for (var t = Array.prototype.slice, e = 0, n = 0, i = arguments.length; i > n; n++) try {
                var o = arguments[n];
                if ("function" == typeof o) arguments[n](this);
                else {
                    o = t.call(o, 0);
                    var r = o[0];
                    this[r].apply(this, o.slice(1))
                }
            } catch (a) {
                e++
            }
            return e
        },
        create: function(t, e) {
            this._app = t, this._config = a.merge(this._config, e || {})
        },
        config: function(t, e) {
            if (void 0 !== e) switch (t) {
                case "sampleRate":
                    "number" == typeof e && (this._config.sampleRate = e);
                    break;
                case "beaconImage":
                    this._beacon.config(this._config.beacon = e);
                    break;
                case "useCombo":
                    "boolean" == typeof e && (this._config.useCombo = e);
                    break;
                case "autotags":
                    "boolean" == typeof e && (this._config.autotags = e)
            }
        },
        tag: function(t, e) {
            "string" == typeof t && t.length && ("undefined" != typeof e ? this._tags[t] = e : "undefined" != typeof this._tags[t] && delete this._tags[t])
        },
        send: function(e, n, i, r) {
            if (e) {
                var a = o.Plugins[e];
                a && (n = a.data(), r = a.type);
                var s = {};
                n && (s[e] = n, this._push(r || "timer", s, i));
                var u = this;
                this._timer && (t.clearTimeout(this._timer), this._timer = null), this._timer = t.setTimeout(function() {
                    u._send.call(u)
                }, h)
            }
        },
        timing: function(t, e, n) {
            this.send(t, e || 1, n, "timer")
        },
        count: function(t, e, n) {
            this.send(t, e || 1, n, "counter")
        },
        gauge: function(t, e, n) {
            this.send(t, e || 1, n, "gauge")
        },
        on: function(t, e) {
            s.on(t, e)
        },
        _push: function(t, e, n) {
            this._queue.push({
                type: t,
                data: e,
                tags: n ? n : this._tags
            })
        },
        _send: function() {
            if (this.isInitialized() && this._isSampleHit()) {
                var e = a.merge,
                    n = this._config.useCombo,
                    i = this._client.getInfo(),
                    o = {
                        app: this._app,
                        type: "combo",
                        url: t.location.protocol + "//" + t.location.hostname + t.location.pathname,
                        autotags: this._config.autotags
                    };
                if (o = e(o, i), this._queue.length) {
                    if (n) 1 === this._queue.length ? (o = e(o, this._queue[0]), s.trigger("data", o), this._beacon.send(o)) : (o.data = this._queue, s.trigger("data", o), this._beacon.send(o));
                    else
                        for (var r = 0, u = this._queue.length; u > r; r++) o = e(o, this._queue[r]), s.trigger("data", o), this._beacon.send(o);
                    this._queue = []
                }
            }
        },
        _isSampleHit: function() {
            return this.visitorCode % 1e4 < 100 * this._config.sampleRate
        }
    }, o.addPlugin("page", {
        type: "timer",
        data: function() {
            var e = t,
                n = e.performance || e.mozPerformance || e.msPerformance || e.webkitPerformance;
            if (n) {
                var i = n.timing,
                    o = {
                        redirect: i.fetchStart - i.navigationStart,
                        dns: i.domainLookupEnd - i.domainLookupStart,
                        connect: i.connectEnd - i.connectStart,
                        network: i.connectEnd - i.navigationStart,
                        send: i.responseStart - i.requestStart,
                        receive: i.responseEnd - i.responseStart,
                        backend: i.responseEnd - i.requestStart,
                        render: i.loadEventEnd - i.loadEventStart,
                        dom: i.domComplete - i.domLoading,
                        frontend: i.loadEventEnd - i.domLoading,
                        load: i.loadEventEnd - i.navigationStart,
                        domReady: i.domContentLoadedEventStart - i.navigationStart,
                        interactive: i.domInteractive - i.navigationStart,
                        ttf: i.fetchStart - i.navigationStart,
                        ttr: i.requestStart - i.navigationStart,
                        ttdns: i.domainLookupStart - i.navigationStart,
                        ttconnect: i.connectStart - i.navigationStart,
                        ttfb: i.responseStart - i.navigationStart
                    };
                if ("object" == typeof M && M.subresources && M.subresources.names && "undefined" != typeof t.SubResoucesTiming) {
                    var r = M.subresources.lastImage || "",
                        a = M.subresources.firstImage || "",
                        s = new t.SubResoucesTiming(M.subresources.names, r, a);
                    s.length && "fsImg" === s[s.length - 1].id && (o.atf = s[s.length - 1].start, o.c_atf = s[s.length - 1].start - (i.responseStart - i.navigationStart))
                }
                if (i.msFirstPaint && (o.firstPaint = i.msFirstPaint), e.chrome && e.chrome.loadTimes) {
                    var u = e.chrome.loadTimes();
                    o.firstPaint = Math.round(1e3 * (u.firstPaintTime - u.startLoadTime))
                }
                return "undefined" != typeof M && M.TimeTracker && M.TimeTracker.fst && (o.firstScreen = M.TimeTracker.fst - i.navigationStart), o
            }
        }
    }), o.addPlugin("cdn", {
        type: "timer",
        data: function() {
            if ("object" == typeof M && M.subresources && M.subresources.names && SubResoucesTiming) {
                t.SubResoucesTiming = SubResoucesTiming;
                var e = M.subresources.lastImage || "",
                    n = M.subresources.firstImage || "",
                    i = new SubResoucesTiming(M.subresources.names, e, n);
                if (!i.length) return;
                for (var o = {}, r = 0, a = i.length; a > r; r++) {
                    var s = i[r];
                    if (s.server) {
                        o[s.server] = {};
                        for (var u in s) s.hasOwnProperty(u) && parseInt(s[u], 10) > 0 && (o[s.server][u] = s[u])
                    }
                }
                return o
            }
        }
    }), a.onload(function() {
        if (t.MeituanAnalyticsObject) {
            var e = t[t.MeituanAnalyticsObject];
            if (!(e.q && e.q.isInitialized && e.q.isInitialized())) {
                var n = Object.prototype.toString,
                    i = new o,
                    r = e ? e.q : [];
                e.q = i, r && "[object Array]" === n.call(r) && i.push.apply(i, r)
            }
        }
    })
}(window, document);;
