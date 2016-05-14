/**
 * @fileOverview Cookie组件
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define(function(require , exports , module){
	
	/**
	 * [cookie cookie对象]
	 * @type {Object}
	 */
	var cookie =  cookie || {};

    var decode = decodeURIComponent;
    var encode = encodeURIComponent;

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

	/**
	 * [get 获取cookie]
	 * @param  {string} name  cookie的名称
	 * @return {string}       cookie的值
	 */
	cookie.get = function(name){
		var cookie = document.cookie;
		var start = cookie.indexOf(name + "=");
		var end = 0;
		var value = "";

    	validateCookieName(name);

　　　　if (start != -1){
　　　　　　start = start + name.length + 1;
　　　　　　end = cookie.indexOf(";", c_start);
　　　　　　if (end == -1) {
				//考虑是否是最后一项
				end = cookie.length;　
			}　
			value = decode(cookie.substring(start, end));
        }
        return value;
	}

	/**
	 * [set 设置cookie]
	 * @param {string} name     cookie的名称
	 * @param {string} val      cookie的值
	 * @param {number|date}  expires 失效时间. number 类型时单位为秒，不设置表示生效时间为本次浏览器进程
	 * @param {string} domain   域
	 * @param {string} path     路径
	 * @param {boolean} secure  安全标志
	 * @return {void}   
	 */
	cookie.set = function(name, val, expires, domain, path, secure){
		var text = encode("" + val);
		var date = expires;

		validateCookieName(name);
		if(typeof expires === 'number') {
			date = new Date();
			date.setTime(date.getTime() + expires*1000);
		}

        if (date instanceof Date) {
            text += '; expires=' + date.toUTCString();
        }

        if (isNotEmptyString(domain)) {
            text += '; domain=' + domain;
        }

        if (isNotEmptyString(path)) {
            text += '; path=' + path;
        }

        if (secure) {
            text += '; secure';
        }

        document.cookie = name + '=' + text;
	}

	/**
	 * [remove 删除cookie]
	 * @param {string} name     cookie的名称
	 * @param  {string} domain 域
	 * @param  {string} path   路径
	 * @param  {boolean} secure 安全标志
	 * @return {void} 
	 */
	cookie.remove = function(name, domain, path, secure){
		this.set(name, '', -1, domain, path, secure);
	}

	module.exports = cookie;
});
