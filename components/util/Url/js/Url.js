/**
 * @fileOverview URL组件
 * @author kongchao
 * @see The <a href="http://www.onlycoder.com/">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define(function(require , exports , module){

	var $ = require('jquery');

	/**
	 * [Url Url构造函数]
	 */
	var Url = function(url){
		this.url = url;
		this.query = Url.parseQuery(url);
	};

	/**
	 * [parse url全解析]
	 * @return {object}  url解析后的对象
	 */
	Url.prototype.parse = function(){
		return Url.parse(this.toString());
	}

	/**
	 * [parseQuery 解析url的query参数]
	 * @return {object}   解析后的query对象
	 */
	Url.prototype.parseQuery = function(){
		return Url.parseQuery(this.toString());
	}

	/**
	 * [add 添加query参数]
	 * @param {string} key   query参数名
	 * @param {string} value query参数值
	 * @return {object}     [description]
	 */
	Url.prototype.add = function(key, value){
		this.query[key] = value;
		return this;
	}

	/**
	 * [remove 删除指定键名或全部查询参数]
	 * @param  {string} key 指定键名，不指定则删除全部
	 * @return {[type]}     [description]
	 */
	Url.prototype.remove = function(key){
		delete this.query[key];
		return this;
	}

	/**
	 * [has 否包含指定查询参数键名]
	 * @param  {string}  key 指定键名
	 * @return {Boolean}     [description]
	 */
	Url.prototype.has = function(key){
		return this.query[key] !== undefined;
	}

	/**
	 * [get 获取指定的查询参数对应的值]
	 * @param  {string}  key 指定键名
	 * @return {[type]}     [description]
	 */
	Url.prototype.get = function(key){
		return this.query[key];
	}

	/**
	 * [set 设置对应键值]
	 * @param {string}  key 指定键名
	 * @param {[type]} value  键值
	 */
	Url.prototype.set = function(key, value){
		this.query[key] = value;
		return this;
	}

	/**
	 * [toString 序列化查询参数]
	 * @return {String}  序列后的化查询参数
	 */
	Url.prototype.toString = function(){
		return Url.build(this.url, this.query);
	}
	
	/**
	 * [parse url全解析]
	 * @param {string}  url  要解析的url
	 * @return {object}     url解析后的对象
	 */
	Url.parse = function(url){
		var link = document.createElement('a');
	    link.href = url;

	    return {
	        source: url,
	        protocol: link.protocol.replace(':', ''),
	        host: link.hostname,
	        port: link.port,
	        query: link.search,
	        file: (link.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
	        hash: link.hash.replace('#', ''),
	        path: link.pathname.replace(/^([^\/])/, '/$1'),
	        relative: (link.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
	        segments: link.pathname.replace(/^\//, '').split('/')
	    }
		return "";
	}

	/**
	 * [parseQuery 解析url的query参数]
	 * @param {string}  url  要解析的url
	 * @return {object} [description]
	 */
	Url.parseQuery = function(url){
	    var reg = /([^?&=]+)=([^?&=]*)/g;
	    var search = "";
	    var query = {};
	 	if(url.indexOf("?")<0){
	 		return query;
	 	}
	 	search = url.substring(url.indexOf("?") + 1);
	    search.replace(reg, function (rs, $1, $2) {
	        var name = decodeURIComponent($1);
	        var val = decodeURIComponent($2);                
	        val = String(val);
	       	query[name] = val;
	        return rs;
	    });
	    return query;
	}

	/**
	 * [build 构建URL链接]
	 * @param  {string} url   要构造的url
	 * @param  {object} query 请求参数
	 * @return {string}       新url
	 */
	Url.build = function(url, query){
    	var existQuery = Url.parseQuery(url);
    	var queryString = "";
    	query = $.extend({}, existQuery, query);

    	for (var i in query) {
        	queryString += (i + '=' + encodeURIComponent(query[i]) + '&');
    	}
		return url.replace(/([^?]+).*/, "$1") + "?" + queryString.substring(0, queryString.length-1);
	}

	module.exports = Url;

});