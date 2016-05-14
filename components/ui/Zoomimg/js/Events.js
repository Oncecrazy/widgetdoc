/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('Events', function(require , exports , module){
	
	/*事件类型字符串分隔符*/
	var eventSplitter = /\s+/ ;

	/**
	 * [Events 事件机制构造函数]
	 */
	var Events = function(){
	}

	Events.prototype = {
		constructor : Events,

		/**
		 * [on  事件监听] 
		 * @param  {String}   types   	必须,事件名称.多个事件名以空格分割
		 * @param  {Function} callback 	必须,事件触发时的回调函数
		 * @param  {type}   context  	可选,回调函数的上下文环境
		 * @return {void}
		 */
		on : function(types , callback , context){
			//事件类型,回调以及上下文对象保存容器
			var events = this.events  = this.events || {},
				type;
			if(!callback)return;
			types = types.split(eventSplitter);
			for(var i = 0; i < types.length; i++){
				type = types[i];
				callbacks = events[type] = events[type] || [];
				contexts = callbacks.contexts = callbacks.contexts || [];
				ones = callbacks.ones = callbacks.ones || [];
				callbacks.push(callback);
				contexts.push(context);
				ones.push(false);
			}
		},

		/**
		 * [one 事件监听 事件处理函数只执行一次]
		 * @param  {String}   types   	必须,事件名称.多个事件名以空格分割
		 * @param  {Function} callback  必须,事件触发时的回调函数
		 * @param  {type}   context  	可选,回调函数的上下文环境
		 * @return {void}
		 */
		one: function(types , callback , context){
			//事件类型,回调以及上下文对象保存容器
			var events = this.events  = this.events || {},
				type;
			if(!callback)return;
			types = types.split(eventSplitter);
			for(var i = 0; i < types.length; i++){
				type = types[i];
				callbacks = events[type] = events[type] || [];
				contexts = callbacks.contexts = callbacks.contexts || [];
				ones = callbacks.ones = callbacks.ones || [];
				callbacks.push(callback);
				contexts.push(context);
				ones.push(true);
			}
		},

		/**
		 * [emit 触发指定类型的事件处理函数]
		 * @param  {String}   type       必选,触发指定类型的事件  
		 * @param  {Function} callback   可选,触发指定类型对应的指定回调函数,没有该参数时触发指定事件的所有回调函数  
		 * @param  {agrs}                回调函数参数，可以任意多个
		 * @return {void}            
		 */
		emit : function(type, callback,	agrs){
			var events = this.events;
			if(!events)return;

			var callbacks = events[type];
			if(!callbacks)return;
				
			var contexts = callbacks.contexts,
				ones = callbacks.ones;
			if(typeof arguments[1] === 'function'){
				var index = indexOf(callbacks , arguments[1]),
					agrs = Array.prototype.slice.call(arguments,2);
				index >= 0 && arguments[1].apply(contexts[index] || this, agrs);
				ones[index] === true && this.off(type, arguments[1]);
			}else{
				var agrs = Array.prototype.slice.call(arguments,1);
				for(var i = 0; i < callbacks.length; i++){
					callbacks[i].apply(contexts[i] || this, agrs);
					ones[i] === true && this.off(type, callbacks[i]);
				}
			}		
		},

		/**
		 * [emitAll   触发所有类型的事件处理函数]
		 * @param         回调函数参数，可以任意多个 
		 * @return {void}            
		 */
		emitAll : function(){
			var events = this.events;
			if(!events)return;
			var callbacks,contexts;
			for(var type in events){
				callbacks = events[type];
				contexts = callbacks.contexts;
				ones = callbacks.ones;
				for(var i = 0; i < callbacks.length; i++){
					callbacks[i].apply(contexts[i] || this, arguments);
					ones[i] === true && this.off(type, callbacks[i]);
				}
			}	
		},

		/**

		 * [off    事件销毁]
		 * @param  {String}   types     可选,事件名称.多个事件名以空格分割，没有该参数则删除所有事件
		 * @param  {Function} callback  可选,回调函数，没有改参数则删除给定事件下所有事件处理函数
		 * @return {void}            
		 */
		off : function(types, callback){
			var events = this.events  = this.events || {},
				type,callbacks;
			if(arguments.length == 0){
				this.events = {};
			}else{
				types = types.split(eventSplitter);
				for(var i = 0; i < types.length; i++){
					type = types[i];
					callbacks = this.events[type];
					if(callback){
						var index = indexOf(callbacks , callback);
						index >= 0 && callbacks.splice(index , 1);
					}else{
						delete this.events[type];
					}	
				}
			}
		}
	};

	/**
	 * [indexOf  数组指定元素搜索]
	 * @private
	 * @param  {Array}  arr    		数组		
	 * @param  {Object} item  		数组元素		
	 * @return {Number}       		元素在数组中对应的下标,不存在返回-1		
	 */
	function indexOf(arr , item){
		for(var i = 0; i < arr.length; i++){
			if(item === arr[i]){
				return i;
			}
		}
		return -1;
	}

	module.exports = Events;

});