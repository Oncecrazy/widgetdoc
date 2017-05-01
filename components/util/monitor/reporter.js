

/**
 BJ_REPORT.init({
  combo:0,                              // combo 是否合并上报， 0 关闭， 1 启动（默认）
  delay:1000,                           // 当 combo= 1 可用，延迟多少毫秒，合并缓冲区中的上报
  random : 1                            // 抽样上报，1~0 之间数值，1为100%上报（默认为1）
  onReport : function (id , errObj){    // 当上报的时候回调 。 id: 上报的id , errObj : 错误的对象

  url: "http://badjs2.qq.com/badjs",    // 指定上报地址 , 默认已为 "http://badjs2.qq.com/badjs"
  ignore: [/Script error/i],            // 忽略某个错误
  ext : {}                              // 扩展属性，后端做扩展处理属性。例如：存在 msid 就会分发到 monitor.server.com
  }
});

上报实例：

BJ_REPORT.report("error msg");

BJ_REPORT.report({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

try{
    // something throw error ...
}catch(error){
    BJ_REPORT.report(e);
}

手动延迟上报

BJ_REPORT.push("error msg");

BJ_REPORT.push({
  msg: "xx load error",                 // 错误信息
  target: "xxx.js",                     // 错误的来源js
  rowNum: 100,                          // 错误的行数
  colNum: 100,                          // 错误的列数
});

BJ_REPORT.report();

*/

var reporter = (function(global){

    if (global.reporter) return global.reporter;

    var _msg = [];
    var comboTimeout = 0;
    var _config = {
        combo:0,                              
        delay:1000,                          
        random : 1                         

        url: "http://badjs2.qq.com/badjs",    
        ignore: [],            
        ext : {},
        beforeReport: function(){},
        afterReport: function(){}                     
    };

    function isObject(obj) {
        var type = typeof obj;
        return type === "object" && !!obj;
    }

    function isType(obj) {
        return Object.prototype.toString.call(obj).match(/\[object (\w+)\]/)[1].toLowerCase();
    };

    function _submit(url, data, callback) {
        if(!callback){callback = function(){};}

        var rnd = +new Date +"." + Math.floor(Math.random()*1000),
            name = "reporterImage_" + rnd,
            img = global[name] = new Image(),
            items = [ '_=' + rnd ];

        for (var key in data) {
            if (data[key]) {
                items.push(key + '=' + encodeURIComponent(data[key]));
            }
        }

        url = url + (url.indexOf('?') < 0 ? '?' : '&') +  items.join('&');

        img.onload = img.onerror = img.onabort = function () {
            callback && callback();
            img.onload = img.onerror = img.onabort = null;
            global[name] = null;
        };

        img.src = url + (url.indexOf('?') < 0 ? '?' : '&') +  items.join('&');
    };

    function send(immediate) {
        if (!_config.report) return;

        while (_msg.length) {
            var isIgnore = false;
            var msg = _msg.shift();

            var error_str = _error_tostring(error, error_list.length);

            if (_isOBJByType(_config.ignore, "Array")) {
                for (var i = 0, l = _config.ignore.length; i < l; i++) {
                    var rule = _config.ignore[i];
                    if ((_isOBJByType(rule, "RegExp") && rule.test(error_str[1])) ||
                        (_isOBJByType(rule, "Function") && rule(error, error_str[1]))) {
                        isIgnore = true;
                        break;
                    }
                }
            }

            if (!isIgnore) {
                if (_config.combo) {
                    error_list.push(error_str[0]);
                } else {
                    //_submit(_config.report + error_str[2] + "&_t=" + (+new Date));
                    _submit(_config.report, error_list, _config.afterReport);
                }
                _config.onReport && (_config.onReport(_config.id, error));
            }
        }

        // 合并上报
        var count = error_list.length;
        if (count) {
            var comboReport = function() {
                clearTimeout(comboTimeout);
                // _submit(_config.report + error_list.join("&") + "&count=" + count + "&_t=" + (+new Date));
                _submit(_config.report, error_list, _config.afterReport);
                comboTimeout = 0;
                error_list = [];
            };

            if (immediate) {
                comboReport(); // 立即上报
            } else if (!comboTimeout) {
                comboTimeout = setTimeout(comboReport, _config.delay); // 延迟上报
            }
        }
    };


    var reporter = {

        init: function(config) {
            if (isObject(config)) {
                for (var key in config) {
                    _config[key] = config[key];
                }
            }

            _config.report = _config.url  + "?id=" + id + "&from=" + encodeURIComponent(location.href) + "&ext=" + JSON.stringify(_config.ext);

            return report;
        },

        push: function(msg) {
            if (Math.random() >= _config.random) {
                return report;
            }
            _error.push(isObject(msg) ? _processError(msg) : {
                msg: msg
            });
            _send();
            return report;
        },

        report: function(msg) {
            msg && report.push(msg);
            _send(true);
            return report;
        },

        __onerror__: global.onerror
    };

    return reporter

})(window);



var $ = require('$');
var util = require('util');
var config = require('config');

var http_img_sender = function () {
    var img = new Image();
    var sender = function (src) {
        img.onload = img.onerror = img.onabort = function () {
            img.onload = img.onerror = img.onabort = null;
            img = null;
        };
        img.src = src;
    };
    return sender;
};

/**
 * @method onErrorHandle
 * @description 上报页面脚本错误
 * @param {Object} error 错误对象
 * @author brianlin
 */
var onErrorHandle = function(error){
    var param = {
        "url": location.href,
        "error": error.toString(),
        "_": new Date()
    };
    var url = config.reporterOption.pageErrUrl;
    if(url){
        url = util.addParamObjToUrl(url,param);
        var sender = http_img_sender();
        sender(url);
    }
};

/**
 * @class reporter
 * @description 数据上报对象
 * @author brianlin
 */
var reporter = {
    /**
     * @method init
     * @description 初始化数据上报相关函数
     * @author brianlin
     */
    init: function(){
        window.onerror = onErrorHandle;
        $(document).click(function(event){
            var parent = event.target;
            var depth = config.reporterOption.maxClickDepth;
            while(parent){
                if(depth <= 0){
                    break;
                }
                var tag = $(parent).attr('data-tag');
                if(tag){
                    reporter.click(tag);
                    break;
                }
                parent = parent.parentNode;
                depth--;
            }
        });
    },
    /**
     * @method retCode
     * @description 上报返回码
     * @param {String} url 具体某个 cgi 的 url
     * @param {Number} code cgi 的返回码或者本地产生的 -98、-99
     * @param {Number} duration cgi 请求耗时
     * @author brianlin
     */
    retCode: function(url,code,duration){
        var param = {
            "domain": document.domain,
            "cgi": url,
            "type": "",
            "code": "",
            "time": "",
            "_": new Date()
        };
        param.type = code == 0 ? 1 : 2;
        param.code = code;
        param.time = duration;
        var url = config.reporterOption.rtnCodeUrl;
        if(url){
            url = util.addParamObjToUrl(url,param);
            var sender = http_img_sender();
            sender(url);
        }
    },
    /**
     * @method speed
     * @description 上报页面测速
     * @param {String} url 要测速的页面url
     * @param {Array} speeds 速度值数组
     * @author brianlin
     */
    speed: function(url,speeds){
        var param = {
            "url": url,
            "_": new Date()
        };
        for(var i=1;i<=speeds.length;i++) {
            param[i] = speeds[i-1];
        }
        var url = config.reporterOption.speedUrl;
        if(url){
            url = util.addParamObjToUrl(url,param);
            var sender = http_img_sender();
            sender(url);
        }
    },
    /**
     * @method click
     * @description 上报点击流
     * @param {String} tag 点击标识
     * @author brianlin
     */
    click: function(tag){
        if(!tag){
            return;
        }
        var param = {
            "url": location.href,
            "tag": tag,
            "_": new Date()
        };
        var url = config.reporterOption.clickUrl;
        if(url){
            url = util.addParamObjToUrl(url,param);
            var sender = http_img_sender();
            sender(url);
        }
    },
    /**
     * @method basic
     * @description 上报基础数据，如：pv
     * @param {String} path 页面路径
     * @author brianlin
     */
    basic: function(path){
        if(!path){
            return;
        }
        if (!/^\//.test(path)) {
            path = '/' + path;
        }
        var param = {
            "domain": document.domain,
            "path": path,
            "_": new Date()
        };
        var url = config.reporterOption.baseUrl;
        if(url){
            url = util.addParamObjToUrl(url,param);
            var sender = http_img_sender();
            sender(url);
        }
    }
};

if (typeof exports !== "undefined") {
    if (typeof module !== "undefined" && module.exports) {
        exports = module.exports = reporter;
    }
    exports.reporter = reporter;
}