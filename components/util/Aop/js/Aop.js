/**
 * @fileOverview Aop组件
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('Aop',function(require, exports, module){

	/**
	 * [Aop Aop构造函数]
	 */
	var Aop = function(agrs){
		this.beforeQuen = [];
		this.afterQuen = [];
		this.originFunQuen = [];
	};

	/**
	 * [inject  为函数注入before、after方法，不改变原方法]
	 * @param  {object} agrs 				json对象
	 *                  agrs.context  		函数执行上下文
	 *                  agrs.origin 		函数名
	 *                  agrs.before(可选) 	提前执行的函数对象
	 *                  agrs.after (可选)	延后执行的函数对象
	 * @return {Function}      [注入后的函数对象]
	 */
	Aop.inject = function(agrs){
		var context = agrs.context || window,
			originFunName = agrs.origin,
			before = agrs.before,
			after = agrs.after;
		if(!context[originFunName]){
			return null;
		}	
		return function(){
			var agrs = [].slice.call(arguments);
			expandMethod(context,originFunName,before,after,agrs);
		}
	};

	/**
	 * [addMethod  Aop对象添加before、after方法]
	 * @param  {object} agrs 				json对象
	 *                  agrs.before(可选) 	提前执行的函数对象
	 *                  agrs.after (可选)	延后执行的函数对象
	 * @return {object}  					本Aop对象
	 */
	Aop.prototype.addMethod = function(agrs){
		var before = agrs.before,
			after = agrs.after;
		if(typeof before === "function"){
			this.beforeQuen.push(before);
		}
		if(typeof after === "function"){
			this.afterQuen.push(after);
		}	
		return this;	
	};

	/**
	 * [removeMethod   Aop对象删除before、after方法]
	 * @param  {object} agrs 				json对象
	 *                  agrs.before(可选) 	提前执行的函数对象
	 *                  agrs.after (可选)	延后执行的函数对象
	 * @return {object}  					本Aop对象  
	 */
	Aop.prototype.removeMethod= function(agrs){
		var before = agrs.before,
			after = agrs.after;
		if(typeof before === "function"){
			var idx = indexOf(this.beforeQuen,before)
			this.beforeQuen.splice(idx,1);
		}
		if(typeof after === "function"){
			var idx = indexOf(this.afterQuen,after)
			this.afterQuen.splice(idx,1);
		}
		return this;		
	};

	/**
	 * [inject  为函数注入before、after方法，从Aop对象中获取before、after方法，会改变原函数]
	 * @param  {object} agrs 				json对象
	 *                  agrs.context  		函数执行上下文
	 *                  agrs.origin 		函数名
	 * @return {object}       			    本Aop对象
	 */
	Aop.prototype.inject = function(agrs){
		var context = agrs.context || window,
			originFunName =  agrs.origin,
			beforeQuen = this.beforeQuen,
			afterQuen = this.afterQuen,
			originFun = context[originFunName];
		if(!originFunName){
			return;
		}
		if(this.originFunQuen[originFunName]){
			originFun = this.originFunQuen[originFunName];
		}else{
			this.originFunQuen[originFunName] = originFun;
		}
		replaceMethod(this,context,originFunName,beforeQuen,afterQuen);
		return this;
	};

	/**
	 * [originRun  执行函数名对应的原始函数(注入前)]
	 * @return {object} [未找到对应原始函数时，返回false。否则返回对应原始函数的执行结果]
	 */
	Aop.prototype.originRun = function(){
		var settings,context,originFunName,originFun,args; 
		if(arguments.length<1){
			return null;
		}
	 	settings = arguments[0];
		context = settings.context || window;
		originFunName =  settings.origin;
		originFun = this.originFunQuen[originFunName];
		args = [].slice.call(arguments).splice(1);
		if(this.originFunQuen[originFunName]){
			return originFun.apply(context,args);
		}else{
			return null;
		}	
	}
	
	/**
	 * @description [扩展函数]
	 * @private
	 * @param  {[type]} context [description]
	 * @param  {[type]} origin  [description]
	 * @param  {[type]} before  [description]
	 * @param  {[type]} after   [description]
	 * @param  {[type]} agrs   [description]
	 * @return {[type]}         [description]
	 */
	function expandMethod(context,origin,before,after,agrs){
		/*标识before函数返回值，用于是否终止函数执行*/
		var flag = before.apply(context);
		if(flag===false){
			return;
		}
		context[origin].apply(context,agrs);
		after.apply(context);
	}

	/**
	 * @description [替换函数]
	 * @private
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} context    [description]
	 * @param  {[type]} origin     [description]
	 * @param  {[type]} beforeQuen [description]
	 * @param  {[type]} afterQuen  [description]
	 * @return {[type]}            [description]
	 */
	function replaceMethod(obj,context,origin,beforeQuen,afterQuen){
		var originFun = obj ? obj.originFunQuen[origin] : context[origin];
		/*标识before函数返回值，用于是否终止函数执行*/
		Aop.flag = true; 	
		context[origin] && (context[origin] = function(){
			for(var i = 0,len = beforeQuen.length; i<len; i++){
				Aop.flag = beforeQuen[i].apply(context);
				/*如果before函数返回false，则退出*/
				if(Aop.flag === false){
					return;
				}
			}
			originFun.apply(context,arguments);
			/*如果before函数返回false，则退出。递归调用时需要该代码。*/
			if(Aop.flag === false){
				return;
			}
			for(var i = 0,len = afterQuen.length; i<len; i++){
				afterQuen[i].apply(context);
			}
		});
	}

	function indexOf(arr , item){
		for(var i=0;i<arr.length;i++){
			if(item === arr[i])return i;
		}
		return -1;
	}
	module.exports = Aop;
});