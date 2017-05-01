/*! mars-1.0.1 2015-11-20 04:11:02 */ ! function() {
    window.T0 = (new Date).getTime(), window.Mar = function() {}, Mar.Cookie = {
        get: function(a) {
            var b, c = document.cookie,
                d = c.indexOf(a + "=");
            return -1 !== d ? (d += a.length + 1, b = c.indexOf(";", d), unescape(c.substring(d, -1 === b ? c.length : b))) : void 0
        },
        set: function(a, b, c) {
            for (var d, e = document.domain.toLowerCase(), f = "", g = ["vipshop", "vip", "appvipshop"], h = new Array(".com"), i = 0, i = 0; i < h.length; i++)
                if (f = h[i], -1 != e.indexOf(f)) {
                    e = e.substring(0, e.indexOf(f)), e = e.substring(e.lastIndexOf(".") + 1, e.length);
                    break
                }
            for (; i < g.length && e !== g[i]; i++);
            0 === c ? document.cookie = a + "=" + escape(b) + ";path=/;domain=." + g[i] + ".com" : (d = new Date, d.setTime(d.getTime() + 24 * c * 3600 * 1e3), document.cookie = a + "=" + escape(b) + ";expires=" + d.toGMTString() + ";path=/;domain=." + g[i] + ".com")
        },
        del: function(a, b) {
            document.cookie = a + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/;" + (b ? "domain=" + b : "")
        }
    }, Mar.guid = function() {
        for (var a = 0, b = []; 8 > a;) b.push((65536 * (1 + Math.random()) | 0).toString(16).substring(1)), a++;
        return b.join("").toUpperCase()
    }, Mar.guid2 = function() {
        function a() {
            return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
        }
        return a() + a() + "-" + a() + "-" + a() + "-" + a() + "-" + a() + a() + a()
    }, Mar.guid3 = function() {
        function a(a, c, d) {
            var e = b(a, 16),
                f = new Array,
                g = "",
                h = 0;
            for (h = 0; h < e.length; h++) f.push(e.substring(h, h + 1));
            for (h = Math.floor(c / 4); h <= Math.floor(d / 4); h++) g += f[h] && "" != f[h] ? f[h] : "0";
            return g
        }

        function b(a, b) {
            return a.toString(b)
        }

        function c(a) {
            return Math.floor(Math.random() * (a + 1))
        }
        var d = new Date(1582, 10, 15, 0, 0, 0, 0),
            e = new Date,
            f = e.getTime() - d.getTime(),
            g = a(f, 0, 31),
            h = a(f, 32, 47),
            i = a(f, 48, 59) + "1",
            j = a(c(4095), 0, 7),
            k = a(c(4095), 0, 7),
            l = a(c(8191), 0, 7) + a(c(8191), 8, 15) + a(c(8191), 0, 7) + a(c(8191), 8, 15) + a(c(8191), 0, 15);
        return g + h + i + j + k + l
    }, Mar.rand = function(a) {
        var b = "0123456789abcdef",
            c = "",
            d = 0;
        for (a = a || 32; a > d; d++) c += b.charAt(Math.ceil(1e8 * Math.random()) % b.length);
        return c
    }, Mar.IE = function() {
        for (var a = 3, b = document.createElement("DIV"), c = b.getElementsByTagName("I"); b.innerHTML = "<!--[if gt IE " + ++a + "]><i></i><![endif]-->", c[0];);
        return a > 4 ? a : 0
    }, Mar.browser = function() {
        var a = navigator.userAgent.toLowerCase(),
            b = Mar.IE();
        return {
            ie: b && ["ie", b],
            firefox: a.match(/firefox\/([\d.]+)/),
            chrome: a.match(/chrome\/([\d.]+)/),
            opera: a.match(/opera.([\d.]+)/),
            safari: window.openDatabase ? a.match(/version\/([\d.]+)/) : void 0
        }
    }, Mar.protocal = function() {
        return -1 !== document.location.href.toLowerCase().indexOf("https://") ? "https://" : "http://"
    }, Mar.stringify = function(a) {
        if (window.JSON && window.JSON.stringify) return window.JSON.stringify(a);
        var b, c, d, e = [],
            f = typeof a,
            g = 0;
        if ("string" === f) return '"' + a + '"';
        if ("undefined" === f || "boolean" === f || "number" === f || null === a) return a;
        if ("[object Array]" == Object.prototype.toString.call(a)) {
            for (b = a.length, e.push("["); b > g; g++) e.push(Mar.stringify(a[g]) + ",");
            e.push("]")
        } else {
            e.push("{");
            for (c in a) a.hasOwnProperty(c) && e.push('"' + c + '":' + Mar.stringify(a[c]) + ",");
            d = e.length - 1, e[d] = e[d].replace(/,$/, ""), e.push("}")
        }
        return e.join("")
    }, Mar.Request = function(a, b) {
        var c = Mar.Base,
            d = Mar.Biz();
        a = Mar.protocal() + ("mar." + (-1 !== document.domain.toLowerCase().indexOf(".vipshop.com") ? "vipshop" : -1 !== document.domain.toLowerCase().indexOf(".appvipshop.com") ? "appvipshop" : "vip") + ".com") + a + "&mars_cid=" + d.cid + "&mars_sid=" + d.sid + "&pi=" + d.pid + "&mars_vid=" + d.vid + "&mars_var=" + d.mvar + "&lg=" + d.isLog + "&wh=" + d.wh + "&in=" + d.newbie + "&sn=" + d.orderId + "&url=" + c.url + "&sr=" + c.res + "&rf=" + c.ref + "&bw=" + c.cw + "&bh=" + c.ch + "&sc=" + c.col + "&bv=" + c.nav + "&ce=" + c.ce + "&vs=&title=" + c.title + "&tab_page_id=" + d.pageId + "&vip_qe=" + d.vip_qe + "&vip_qt=" + d.vip_qt + "&vip_xe=" + d.vip_xe + "&vip_xt=" + d.vip_xt, b && (a += "&wap_ln=" + d.wapln + "&wap_vs=" + d.wapvs + "&wap_pwh=" + d.wappwh + "&wap_wh=" + d.wapwh + "&wap_id=" + d.wapid + "&wap_from=" + d.wapfrom + "&cps_u=" + d.cpsu + "&m_vipruid=" + d.ruid), a += "&r=" + Math.random();
        var e = new Image(1, 1);
        return e.onload = e.onerror = e.onabort = function() {
            e.onload = e.onerror = e.onabort = null, e = null
        }, e.src = a, Mar
    };
    var a;
    Mar.Base = {}, a = Mar.Base, a.local = document.location, a.domain = document.domain, a.docEle = document.documentElement, a.context = "css1compat" === document.compatMode.toLowerCase() ? document.body : a.docEle, a.monitor = window.screen, a.href = a.local.href, a.url = escape(a.href), a.pn = a.local.pathname.toLowerCase(), a.hn = a.local.hostname.toLowerCase(), a.ref = escape(document.referrer), a.cw = a.docEle.clientWidth, a.ch = a.docEle.clientHeight, a.res = a.monitor.width + "*" + a.monitor.height, a.col = a.monitor.colorDepth, a.w = a.context.width, a.h = a.context.height, a.nav = escape(navigator.userAgent.toLowerCase()), a.ce = navigator.cookieEnabled ? 1 : 0, a.title = escape(document.title)
}(),
function(a) {
    Mar.PageIdIndex = 0, Mar.PageId = Mar.PageId ? Mar.PageId + "_" + ++Mar.PageIdIndex : (new Date).getTime() + "_" + Mar.guid2(), Mar.Biz = function(b) {
        var c = Mar.Cookie,
            d = c.get,
            e = c.set,
            f = c.del,
            g = Mar.Base,
            h = 0,
            i = 0,
            j = "",
            k = d("VipLID"),
            l = d("PHPSESSID"),
            m = d("mars_cid") || d("cookie_id"),
            n = d("mars_pid") || d("page_id"),
            o = d("mars_sid") || Mar.rand(),
            p = d("visit_id") || Mar.guid(),
            q = d("tmp_mars_cid"),
            r = d("vip_wh"),
            s = window.mars_var ? Mar.stringify(window.mars_var) : "-",
            t = d("vip_qe"),
            u = d("vip_qt"),
            v = window.vip_xe || "",
            w = window.vip_xt || "";
        if (k && l && unescape(k).split("|")[0] === l && (h = 1), !m && q ? m = q : (!m || 32 !== (m + "").length && 46 !== (m + "").length) && (m = (new Date).getTime() + "_" + Mar.rand(), i = 1), n = n || 0, b && n++, f("cookie_id"), f("page_id"), f("mars_cid"), e("mars_pid", n, 732), e("mars_cid", m, 732), e("mars_sid", o, 0), e("visit_id", p, .5 / 24), "/shop/shop_pay.php" === g.pn) j = a("#orid").html();
        else if ("checkout.vipshop.com" === g.hn && "order.php" === g.pn.substring(6, 15)) try {
            j = a("body").html().match(/您的订单号为：(\d+)/)[1]
        } catch (x) {}
        return {
            cid: m,
            sid: o,
            pid: n,
            vid: p,
            wh: r,
            mvar: s,
            newbie: i,
            isLog: h,
            orderId: j,
            pageId: Mar.PageId,
            vip_qe: t,
            vip_qt: u,
            vip_xe: v,
            vip_xt: w
        }
    }, Mar.PV = function() {
        return Mar.Request("/p?1=1"), Mar
    }
}(jQuery),
function(a) {
    Mar.Seed = function() {
        function b(b) {
            return /.*\.\w*$/.test(b) && -1 !== a.inArray(b.match(/\.(\w*)$/i)[1], ["rar", "zip", "exe", "doc", "ppt", "xls", "docx", "xlsx", "pptx", "sisx", "apk"]) ? "download" : ""
        }

        function c(c, e) {
            var f, g, h, i = a(this),
                j = this.tagName.toLowerCase();
            e = e || "click", "a" === j ? (g = i.attr("href"), h = d[j + (g ? b(g.toLowerCase()) : "")]) : (g = i.attr("type"), f = d[j + (g ? g.toLowerCase() : "")], h = f ? f : j), Mar.Seed.request(h, e, "hover" !== e.toLowerCase() ? i.attr("mars_sead") : i.attr("mars_sead_hover"), i.attr("data-mars"))
        }
        var d = {
            inputbutton: "button",
            inputsubmit: "button",
            inputtext: "inputText",
            inputinput: "inputText",
            inputradio: "radio",
            inputcheckbox: "checkbox",
            adownload: "download",
            a: "link",
            span: "span",
            button: "button"
        };
        return a("body").delegate("[mars_sead]:not(select)", "click", function() {
            c.call(this)
        }).delegate("select[mars_sead]", "change", function() {
            Mar.Seed.request("select", "change", a(this).attr("mars_sead"))
        }).delegate("[mars_sead_hover]", "mouseenter", function(a) {
            c.call(this, a, "hover")
        }), Mar
    }, Mar.Seed.request = function(a, b, c, d) {
        var e = (new Date).getTime() - window.T0;
        d = d || "", Mar.Request("/c?at=" + e + "&et=" + a + "&ed=" + b + "&one=" + encodeURIComponent(c) + "&data_mars=" + d)
    }, Mar.Report = function() {
        return window.MARS_EVENT_TYPE && window.MARS_EVENT_VALUE && Mar.Seed.request(MARS_EVENT_TYPE, escape(MARS_EVENT_VALUE), "", ""), Mar
    }
}(jQuery),
function(a) {
    Mar.Screen = function() {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p = Mar.Biz(),
            q = p.cid;
        q.substring(q.length - 1, q.length);
        return q.lastIndexOf("0") !== q.length - 1 ? Mar : (b = Mar.Base, c = [], d = (new Date).getTime(), f = a(window), g = f.width(), h = f.height(), i = b.context.scrollHeight, o = function(a, b) {
            Mar.Request("/s?psn=" + a + "&pt=" + b + "&ph=" + f.scrollTop() + "&pl=" + i)
        }, f.bind("scroll", function() {
            n = setTimeout(function() {
                clearTimeout(n), j = f.scrollTop(), k = Math.ceil(j / h), j >= (k - 1) * h + .2 * h && (-1 !== b.href.indexOf("shop.vipshop.com/detail") || -1 !== b.href.indexOf("www.vip.com/detail") ? (l !== k && (clearInterval(m), m = setInterval(function() {
                    o(k, 3)
                }, 3e3)), l = k) : -1 === a.inArray(k, c) && (e = (new Date).getTime(), o(k, (e - d) / 1e3), d = e, c.push(k)))
            }, 500)
        }).bind("close", function() {
            j = f.scrollTop(), k = Math.ceil(j / h), e = (new Date).getTime(), o(k, (e - d) / 1e3)
        }).bind("resize", function() {
            f = a(this), g = f.width(), h = f.height(), srollHeight = b.context.scrollHeight
        }), Mar)
    }
}(jQuery),
function(a) {
    Mar.Links = function() {
        var b = function(b, c) {
            var d = a(this).attr("href");
            d = d ? d.replace("#", "%26") : d, void 0 === c ? Mar.Request("/m?mx=" + b.pageX + "&my=" + b.pageY + "&href=" + d) : Mar.Request("/m?mx=" + b.pageX + "&my=" + b.pageY + "&clk_depth=" + c + "&href=" + d)
        };
        return a(document.body).click(function(a) {
            var c = [],
                d = a.target || a.srcElement || a[0].target || a[0].srcElement;
            if (7 != Mar.IE())
                for (; d && d[0] && d[0].tagName && "body" !== d[0].tagName.toLowerCase() && "!" !== d[0].tagName.toLowerCase();) 8 !== d[0].nodeType && (c.push(d[0].tagName.toLowerCase() + (void 0 === d.attr("class") ? "" : "." + d.attr("class")) + ":" + d.prevAll(d[0].tagName).length), d = d.parent());
            b.call(a.target || a.srcElement || a[0].target || a[0].srcElement, a, c.reverse().join(" "))
        }), Mar
    }
}(jQuery),
function(a) {
    Mar.Performance = function() {
        var b, c, d, e, f = window.performance;
        return f && (b = f.timing, c = f.navigation, a(function() {
            e = setInterval(function() {
                0 !== b.loadEventEnd && (clearInterval(e), d = {
                    navigation: b.loadEventEnd - b.navigationStart,
                    unloadEvent: b.unloadEventEnd - b.unloadEventStart,
                    redirect: b.redirectEnd - b.redirectStart,
                    domainLookup: b.domainLookupEnd - b.domainLookupStart,
                    connect: b.connectEnd - b.connectStart,
                    request: b.responseEnd - b.requestStart,
                    response: b.responseEnd - b.responseStart,
                    domLoading: b.domInteractive - b.domLoading,
                    domInteractive: b.domContentLoadedEventEnd - b.domInteractive,
                    domContentLoaded: b.domContentLoadedEventEnd - b.domContentLoadedEventStart,
                    domComplete: b.domComplete - b.domLoading,
                    loadEvent: b.loadEventEnd - b.loadEventStart,
                    fetch: b.responseEnd - b.fetchStart,
                    type: c.type
                }, Mar.Request("/a?ps_nav=" + d.navigation + "&ps_ule=" + d.unloadEvent + "&ps_rd=" + d.redirect + "&ps_dlu=" + d.domainLookup + "&ps_con=" + d.connect + "&ps_req=" + d.request + "&ps_resp=" + d.response + "&ps_dl=" + d.domLoading + "&ps_di=" + d.domInteractive + "&ps_dcl=" + d.domContentLoaded + "&ps_dc=" + d.domComplete + "&ps_le=" + d.loadEvent + "&ps_ft=" + d.fetch + "&ps_ty=" + d.type))
            }, 100)
        })), Mar
    }
}(jQuery),
function() {
    Mar.Var = function() {
        if (-1 !== document.location.href.indexOf("http://www.vip.com/detail-") || -1 !== document.location.href.indexOf("http://www.vip.com/show-")) var a, b = (window.mars_var ? Mar.stringify(window.mars_var) : "-", 0),
            c = function() {
                return 1 > b ? void b++ : (clearInterval(a), void Mar.Request("/o?iso=1"))
            },
            a = window.setInterval(c, 1e3);
        return Mar
    }
}(),
function() {
    Mar.Recommend = function() {
        function a(a, b) {
            var c = d.scrollTop(),
                g = d.scrollLeft(),
                h = c + d.height(),
                i = g + d.width(),
                j = [];
            $("[mars-exposure-module]:visible").each(function(a, b) {
                var d = $(b),
                    e = d.offset(),
                    k = e.top,
                    l = d.height() / 2,
                    m = k + l;
                h >= m && m >= c && f(i, g, d, e) && (j[j.length] = d.attr("mars-exposure-module"))
            }), j.length > 0 && (e[e.length] = {
                into_time: a,
                leave_time: b,
                sec: b - a,
                brands: j
            })
        }

        function b() {
            var a, b, c, d, f, h, i, j, k, l = e.length;
            if (0 !== l) {
                for (a = 0; l > a; a++) {
                    for (h = {}, d = e[a], f = d.brands, c = f.length, b = 0; c > b; b++) i = f[b].split("_"), k = i[1], j = h[k] = h[k] || [], j[j.length] = {
                        brand_id: i[2],
                        brand_rank: i[3]
                    };
                    for (a in h) Mar.Request("/y?" + ["into_time=" + d.into_time, "leave_time=" + d.leave_time, "sec=" + d.sec, "brand_expose=" + encodeURIComponent(g({
                        page: i[0],
                        module: a,
                        brands: h[a]
                    }))].join("&"))
                }
                e = []
            }
        }
        var c = window,
            d = $(c),
            e = [],
            f = c.marOptions && marOptions.tCjudge ? function(a, b, c, d) {
                var e = d.left,
                    f = c.width() / 2,
                    g = e + f;
                return a >= g && g >= b
            } : function() {
                return !0
            },
            g = c.JSON && /^[^{]+\{\s*\[native \w/.test(JSON.stringify) ? JSON.stringify : function(a) {
                var b, c = a.constructor,
                    d = 0,
                    e = [];
                switch (!0) {
                    case c === Array:
                        for (b = a.length, d; b > d; d++) e[d] = g(a[d]);
                        return "[" + e.join(",") + "]";
                    case c === Object:
                        for (d in a) e[e.length] = '"' + d + '":' + g(a[d]);
                        return "{" + e.join(",") + "}";
                    case c === String:
                        return '"' + a + '"';
                    default:
                        return a || ""
                }
            };
        return $(document).ready(function() {
            function c() {
                var b = +new Date;
                b - e > 500 && a(e, b)
            }
            var e = +new Date;
            d.on("scroll", function() {
                c(), e = +new Date
            }).on("unload", function() {
                c(), b()
            }), setInterval(function() {
                b()
            }, 2e3)
        }), Mar
    }
}(),
function(a) {
    Mar.PV().Report().Screen().Links().Performance().Var().Seed().Recommend()
}(jQuery);
