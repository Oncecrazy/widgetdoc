/**
 * @fileOverview UA组件
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define(function(require , exports , module){

	/**
	 * [ua  ua对象]
	 * @type {Object}
	 */
	var ua = ua || {};
	var userAgent = window.navigator.userAgent;

	ua.browser = (function() {
	  	var u = userAgent.toLocaleLowerCase(),
		    msie = /(msie) ([\d.]+)/,
		    chrome = /(chrome)\/([\d.]+)/,
		    firefox = /(firefox)\/([\d.]+)/,
		    safari = /(safari)\/([\d.]+)/,
		    opera = /(opera)\/([\d.]+)/,
		    ie11 = /(trident)\/([\d.]+)/,
		    b = u.match(msie) || u.match(chrome) || u.match(firefox) || u.match(safari) || u.match(opera) || u.match(ie11);
	  	return {
		    name: b[1],
		    version: parseInt(b[2])
		})();
	
	ua.os = (function(){
		var u = userAgent.toLocaleLowerCase(),
			android = /(?:android);?[\s\/]+([\d.]+)?/,
			ios = /(?:ipad|ipod|iphone).*OS\s([\d_]+)/,
			b = u.match(android) || u.match(ios);

       return {
		    name: b[1],
		    version: parseInt(b[2])
		})();
	})();

	ua.device = (function(){
		
	})();
	module.exports = ua;
});