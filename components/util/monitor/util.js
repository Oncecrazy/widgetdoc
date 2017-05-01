/**
 * @name lib/util
 * @description 工具函数模块，包括cookie操作，模版处理，封装ajax请求，日期格式化等(持续扩展)
 * @author brianlin
 */
var $ = require('$');
var config = require('config');
window.console = window.console || {};//防止调试console在IE下报错
window.console.log = window.console.log || function(){};
window.console.error = window.console.error || function(){};

if(Date.prototype.format == undefined){
    /**
     * @method Date.format
     * @description 定义Date的format方法用于格式化指定格式的日期
     * @author brianlin
     */
    Date.prototype.format = function (fmt) {
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        var expMap = {'M+':this.getMonth()+1,'d+':this.getDate(),'h+':this.getHours(),'m+':this.getMinutes(),'s+':this.getSeconds(),'S':this.getMilliseconds()};
        for(var exp in expMap){
            if(new RegExp('('+exp+')').test(fmt)){
                fmt = fmt.replace(RegExp.$1,(RegExp.$1.length==1)?(expMap[exp]):(("00"+expMap[exp]).substr((""+expMap[exp]).length)));
            }
        }
        return fmt;
    };
}

$(window).load(function(){
    window.isOnload = true;
});
$(window).unload(function(){
    window.isOnload = false;
});
var _ajax = function (method,url,data,callback,global) {
    (global == undefined) && (global = true);
    return $.ajax({
        type: method,
        url: url,
        data: data,
        global: global,
        success: function (data) {
            callback(data);
        },
        error: function (jqXHR) {
            if (window.isOnload) {//处理页面刷新导致请求abort时误报错误
                console.log('jqXHR.status='+jqXHR.status);
                callback({code:-1});
            }
        }
    });
};

module.exports = {
    /**
     * @method cookie
     * @param {string} key cookie的key值
     * @param {string|null} [value] cookie的value值或null
     * @param {object} [options] 设置cookie时的参数
     * @example
     *		设置cookie：util.cookie(key,value,{"expires":天数,"domain":"qcloud.com","path":"/"})
     *		删除cookie: util.cookie(key,null)
     *		读取cookie: util.cookie(key) 返回value值
     * @author brianlin
     */
    cookie: function(key,value,options){
        if(!options){
            options = {};
        }
        if (arguments.length > 3){
            if (value === null) {
                value = '';
                options.expires = new Date(0);
            }
            if(typeof options.expires === 'number') {
                options.expires = new Date((new Date().getTime()+options.expires*1000));
            }else if(options.expires === 'forever') {
                options.expires = new Date(0xfffffffffff);
            }
            var cookieStr = encodeURIComponent(key)+'='+(options.raw?String(value):encodeURIComponent(String(value)));
            cookieStr+=(options.expires?'; expires=' + options.expires.toGMTString():'');
            cookieStr+=(options.path?'; path=' + options.path : '; path=/');
            cookieStr+=(options.domain?'; domain=' + options.domain : '; domain=.'+config.domain);
            cookieStr+=(options.secure?'; secure':'');
            document.cookie = cookieStr;
            return;
        }
        var ret,result,decode=options.raw?function(s){return s;}:decodeURIComponent;

        if(result=new RegExp('(?:^|; )'+encodeURIComponent(key)+'=([^;]*)').exec(document.cookie)){
            try {
                ret = decode(result[1]);
            } catch(e) {
                ret = result[1];
            }
        } else {
            ret = '';
        }
        return ret;
    },

    /**
     * @method tmpl
     * @param  {String} str html模板字符串或者通过script标签加入html模版时的script元素Id
     * @param  {Object} data 用于生成html判断填充的数据对象
     * @param  {Object} [mixinTmpl] 模版嵌套时，嵌套模版的id和模版内容的key-val对象
     * @return {String} 生成的html片段字符串
     * @description 将html模版转换成html片段,=号转义，-号原始输出
     * @author brianlin
     * @example
     *		var careerTmpl = '<div><%=career%></div>';
     * 		util.tmpl('<h1><%=name%></h1> <%#careerTmpl%>',{name:'brianlin',career:'engineer'},{careerTmpl:careerTmpl});
     */
    tmpl: function () {
        var _cache = {},
            _escape = function (str) {
                str = (str || '').toString();
                return str.replace(/&(?!\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;');
            },
            _getTmplStr = function (rawStr, mixinTmpl) {
                if (mixinTmpl) {
                    for (var p in mixinTmpl) {
                        var r = new RegExp('<%#\\s?' + p + '%>', 'g');
                        rawStr = rawStr.replace(r, mixinTmpl[p]);
                    }
                }
                return rawStr;
            };

        return function tmpl(str, data, mixinTmpl) {
            var strIsKey = !/\W/.test(str);
            !strIsKey && (str = _getTmplStr(str, mixinTmpl));

            var fn = strIsKey ? _cache[str] = _cache[str] || tmpl(_getTmplStr(document.getElementById(str).innerHTML, mixinTmpl)) :
                new Function("obj", "_escape", "var _p='';with(obj){_p+='" + str
                    .replace(/[\r\t\n]/g, " ")
                    .split("\\'").join("\\\\'")
                    .split("'").join("\\'")
                    .split("<%").join("\t")
                    .replace(/\t-(.*?)%>/g, "'+$1+'")
                    .replace(/\t=(.*?)%>/g, "'+_escape($1)+'")
                    .split("\t").join("';")
                    .split("%>").join("_p+='")
                + "';} return _p;");

            var render = function (data) {
                return fn(data, _escape)
            };
            return data ? render(data) : render;
        };
    }(),

    /**
     * @method queryStrToObject
     * @param  {String} [queryString] 待转换的参数字符串，默认情况为window.location.search
     * @return {Object} 参数对象
     * @description 将URL参数字符串转化成对象
     * @author brianlin
     */
    queryStrToObject: function (queryString) {
        var obj = [];
        queryString = queryString || window.location.search;
        queryString = queryString.replace('?','');
        var pairs = queryString.split('&');
        var pairsLen = pairs.length;
        for(var i=0;i<pairsLen;i++) {
            var pair = pairs[i].split('=');
            var key = pair[0];
            var value = pair.slice(1).join('=');

            // 有可能碰到不规范的url a.php?&a=b,那么split后会有一个空值
            if (key) {
                obj[decodeURIComponent(key)] = decodeURIComponent(value);
            }
        }
        return obj;
    },

    /**
     * @method objectToQueryStr
     * @param  {Object} obj 参数对象
     * @return {String} url参数字符串
     * @description 将参数对象转换为url参数字符串
     * @author brianlin
     */
    objectToQueryStr: function (obj) {
        var queryArr = [];
        for(var prop in obj){
            queryArr.push(encodeURIComponent(prop)+'='+encodeURIComponent(obj[prop]));
        }
        return queryArr.join('&');
    },

    /**
     * @method getHref
     * @param  {Object} node a标签dom节点
     * @description 获取a标签href的相对地址包括pathname+请求参数
     * @author brianlin
     */
    getHref: function (node) {
        var href = node.getAttribute('href', 2);
        href = href.replace('http://' + window.location.host, '');
        return href;
    },

    /**
     * @method cloneObject
     * @param  {Object} obj 任意对象
     * @return {Object} 新的拷贝对象
     * @description 深度拷贝对象
     * @author brianlin
     */
    cloneObject: function (obj) {
        var o = obj.constructor === Array ? [] : {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                o[i] = typeof obj[i] === "object" ? this.cloneObject(obj[i]) : obj[i];
            }
        }
        return o;
    },

    /**
     * @method get
     * @param {String} url 请求url
     * @param {Object} data 请求参数对象
     * @param {Function} callback 请求回调函数
     * @param {Boolean} global 是否触发全局AJAX事件
     * @description 发送ajax GET请求
     * @author brianlin
     */
    get: function (url,data,callback,global) {
        return _ajax('GET',url,data,callback,global);
    },

    /**
     * @method post
     * @param {String} url 请求url
     * @param {Object} data 请求参数对象
     * @param {Function} callback 请求回调函数
     * @param {Boolean} global 是否触发全局AJAX事件
     * @description 发送ajax POST请求
     * @author brianlin
     */
    post: function (url,data,callback,global) {
        return _ajax('POST',url,data,callback,global);
    },

    /**
     * @method addEventListener
     * @param {Object} elem 监听事件的dom节点
     * @param {String} type 事件类型
     * @param {Function} callback 事件响应函数
     * @description 监听指定dom节点事件响应
     * @author brianlin
     */
    addEventListener: function (elem,type,callback) {
        if(elem.addEventListener){
            elem.addEventListener(type,callback,false);
        }else if(elem.attachEvent){
            elem.attachEvent("on"+type,callback);
        } else {
            elem[type]=callback;
        }
    },

    /**
     * @method removeEventListener
     * @param {Object} elem 移除监听事件的dom节点
     * @param {String} type 事件类型
     * @param {Function} callback 事件响应函数
     * @description 移除监听指定dom节点事件响应
     * @author brianlin
     */
    removeEventListener: function (elem,type,callback) {
        if(elem.removeEventListener){
            elem.removeEventListener(type,callback,false);
        }else if(elem.detachEvent){
            elem.detachEvent("on"+type,callback);
        } else {
            elem[type]=null;
        }
    },

    /**
     * @method getHashInWin
     * @param {Object} [win] 窗口对象，默认当前window
     * @return {String} hash值
     * @description 获取在指定窗口url中的hash值
     * @author brianlin
     */
    getHashInWin: function (win) {
        var match = (win || window).location.href.match(/#(.*)$/);
        return match?match[1]:'';
    },

    /**
     * @method stripHash
     * @param {String} str 待移除前后'#'井号字符的字符串
     * @return {String} 移除前后'#'井号字符后的字符串
     * @description 移除指定字符串前后的'#'井号字符
     * @author brianlin
     */
    stripHash: function (str) {
        return str.replace(/^\#+|\#+$/g, '');
    },

    /**
     * @method stripSlash
     * @param {String} str 待移除前后'/'斜杠字符的字符串
     * @return {String} 移除前后'/'斜杠字符后的字符串
     * @description 移除指定字符串前后的'/'斜杠字符
     * @author brianlin
     */
    stripSlash: function (str) {
        return str.replace(/^\/+|\/+$/g, '');
    },

    /**
     * @method addParamsStrToUrl
     * @param {String} url 目标url
     * @return {Object} paramObj url参数对象
     * @description 参数对象加入目标url
     * @author brianlin
     */
    addParamObjToUrl: function (url,paramObj) {
        var paramStrArr = [];
        for(var prop in paramObj){
            paramStrArr.push(prop+'='+encodeURIComponent(paramObj[prop]));
        }
        if(url.indexOf('?') >= 0){
            url += "&";
        }else{
            url += "?";
        }
        url += paramStrArr.join('&');
        return url;
    },

    /**
     * @method inArray
     * @param {object} arr 数组或对象
     * @param {mixed} needed 要查找的字符串或数字
     * @return bool
     * @description 查找needed是否存在arr中, 只支持一维数组或对象
     * @author carl
     */
    inArray: function(arr, needed) {
        for ( var i in arr ) {
            if ( needed === arr[i] ) {
                return true;
            }
        }

        return false;
    },

    /**
     * @description 对象或数组中key是否存在
     * @param obj
     * @param key
     */
    keyExists: function(obj, key) {
        var flag = false;
        for (var i in obj) {
            if ( key === i ) {
                flag = true;
                break;
            }
        }

        return flag;
    },

    /**
     * @method isString
     * @description 判断参数是否是字符串
     * @param str
     * @returns {boolean}
     * @author carl
     */
    isString: function(str) {
        return typeof str === 'string';
    },

    /**
     * @method isNumber
     * @description 判断参数是否是数字(可以是整数或小数)
     * @param num
     * @returns {boolean}
     * @author carl
     */
    isNumber: function(num) {
        return typeof num === 'number';
    },

    /**
     * @method isInt
     * @description 判断参数是否是非负整数
     * @param num
     * @returns {boolean}
     * @author carl
     */
    isInt: function(num) {
        return /\d+/.test(num);
    },

    /**
     * @method isFloat
     * @description 判断参数是否是浮点型
     * @param num
     * @returns {boolean}
     * @author carl
     */
    isFloat: function(num) {
        return /^(-?\d+)(\.\d+)?$/.test(num);
    },

    /**
     * @method isEmail
     * @description 判断参数是否是邮箱
     * @param email
     * @returns {boolean}
     * @author carl
     */
    isEmail: function(email) {
        return /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/.test(email);
    },

    /**
     * @method isMobile
     * @description 判断参数是否是手机号
     * @param mobile
     * @returns {boolean}
     * @author carl
     */
    isMobile: function(mobile) {
        return /^((\(\d{2,3}\))|(\d{3}\-))?((1[345]\d{9})|(18\d{9}))$/.test(mobile);
    },

    /**
     * @method isUrl
     * @description 判断参数是否是url
     * @param url
     * @returns {boolean}
     * @author carl
     */
    isUrl: function(url) {
        return /^(http:|ftp:|https)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/.test(url);
    },

    /**
     * @method isset
     * @description 变量是否已经定义或存在
     * @param variable
     * @returns {boolean}
     * @author carl
     */
    isset: function(variable) {
        return typeof variable !== 'undefined' ? true : false;
    },

    /**
     * @method getObjectLength
     * @description 获取对象长度
     * @param obj
     * @returns {number}
     * @author carl
     */
    getObjectLength: function(obj) {
        var i = 0;
        for ( var k in obj ) {
            if ( obj.hasOwnProperty(k) ) {
                i++;
            }
        }

        return i;
    },

    /**
     * 解析URL中的参数
     * @param url
     * @returns {object}
     * @author carl
     */
    parseUrlQuery: function(url) {
        var url = url || window.location.href,
            querys = {},
            queryStr = '',
            tmp = [], tmpQuery, fstEqual,
            // 为什么不直接使用split来分割，因为有可能出现参数是url，url中也带了?或&
            fstPosition = url.indexOf('?');

        if ( fstPosition > 0 ) {
            queryStr = url.substr(fstPosition);
            if ( queryStr.length ) {
                querys = this.queryStrToObject();
            }
        }

        return querys;
    }
};
