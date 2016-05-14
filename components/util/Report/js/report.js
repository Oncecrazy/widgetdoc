define('Report', function(require,exports,module){

/**
 * @description 数据上报模块，包括pv/点击流/测速/返回码等等
 * @author brianlin
 */

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
var report = {
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

module.exports = report;
});