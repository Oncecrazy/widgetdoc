define('cookie', function(require, exports, module) {

    var Cookie = Cookie || {};
    var decode = decodeURIComponent;
    var encode = encodeURIComponent;

    Cookie.get = function(name, options) {
        var cookies = null;
        validateCookieName(name);
        if (typeof options === "function") {
            options = {
                converter: options
            };
        } else {
            options = options || {};
        }
        cookies = parseCookie(document.cookie, !options["raw"]);
        return (options.converter || same)(cookies[name]);
    };


    Cookie.set = function(name, value, options) {
        var expires, domain, path;
        validateCookieName(name);

        options = options || {};
        expires = options["expires"];
        domain = options["domain"];
        path = options["path"];

        // raw: 默认值：false。默认情况下，读取和写入 cookie 的时候自动进行编码和解码（使用encodeURIComponent 编码， 
        // decodeURIComponent 解码）。要关闭这个功能设置 raw: true 即可。
        if (!options["raw"]) {
            value = encode(String(value));
        }
        var text = name + "=" + value;

        // expires
        curTime.setTime(new Date().getTime() + (expires * 1000));
        text += "; expires=" + curTime.toUTCString();

        // domain
        if (isNonEmptyString(domain)) {
            text += "; domain=" + domain;
        }

        // path
        if (isNonEmptyString(path)) {
            text += "; path=" + path;
        }

        // secure 默认值：false。 如果为true，cookie的传输需要使用安全协议（HTTPS）
        if (options["secure"]) {
            text += "; secure";
        }
        document.cookie = text;
        return text;
    };

    Cookie.remove = function(name, options) {
        options = options || {};
        options["expires"] = new Date(0);
        return this.set(name, "", options);
    };

    function parseCookie(text, shouldDecode) {
        var cookies = {};
        if (isString(text) && text.length > 0) {
            var decodeValue = shouldDecode ? decode : same;
            var cookieParts = text.split(/;\s/g);
            var cookieName;
            var cookieValue;
            var cookieNameValue;
            for (var i = 0, len = cookieParts.length; i < len; i++) {
                cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                if (cookieNameValue instanceof Array) {
                    try {
                        cookieName = decode(cookieNameValue[1]);
                        cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
                    } catch (ex) {}
                } else {
                    cookieName = decode(cookieParts[i]);
                    cookieValue = "";
                }
                if (cookieName) {
                    cookies[cookieName] = cookieValue;
                }
            }
        }
        return cookies;
    }

    function isString(o) {
        return typeof o === "string";
    }

    function isNonEmptyString(s) {
        return isString(s) && s !== "";
    }

    function validateCookieName(name) {
        if (!isNonEmptyString(name)) {
            throw new TypeError("Cookie name must be a non-empty string");
        }
    }

    function same(s) {
        return s;
    }

    module.exports = Cookie;
});