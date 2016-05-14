define('Base',function(require , exports , module){
	/**
	 * [Base 基础组件构造函数]
	 */
	function Base(){};

	Base.prototype = {

		constructor : Base,

		/**
		 * [init  构造函数初始化对象]
		 * @return {[void]} 
		 */
		init : function(){},

		/**
		 * [render 组件渲染]
		 * @return {[void]} 
		 */
		render : function(){},

		/**
		 * [destroy 对象保存dom元素的数组和自定义事件的销毁]
		 * @return {[void]} 
		 */
		destroy : function(){
			/* 注销自定义实践 */
			typeof this.off === 'function' && this.off();
			/* 删除属性 */
			for(var p in this){
				if(this.hasOwnProperty(p)){
					delete this[p];
				}
			}
		},

		/**
		 * [toString]
		 * @return {[String]} [对象信息基本描述]
		 */
		toString : function(){

			return '[t8t-plugin Object]';

		}
	};

	/**
	 * @description                      继承父类
	 * @param  {Function}   SuperClass   父类构造函数
	 * @param  {Function}   callback     回调函数，用于子类初始化
	 * @return {[type]}              
	 */
	Base.extend = function(SuperClass, callback){
		if(typeof SuperClass !=="function") return;

		var SubClass = function (){
			//SuperClass.apply(this,arguments); //需要手动调用，灵活赋值
			callback.apply(this,arguments);
		};

        var fn = function(){}
        fn.prototype = SuperClass.prototype;
        SubClass.prototype = new fn();
        SubClass.prototype.constructor = SubClass;
        /* 额外添加父类构造函数 */
        SubClass.prototype.superclass = SuperClass;
		return SubClass;
	};

    /**
     * @description       实现接口
     * @param {Function}  子类构造函数
     * @param {Function}  子类构造函数，可以有任意多个
     * @return {[type]}   [description]
     */
	Base.implement = function(){
		var SubClass = Array.prototype.shift.call(arguments);
		for(var i = 0; i < arguments.length; i++){
			var SuperClass = arguments[i];
			for(var method in SuperClass.prototype){
				if(method !== "constructor"){
					SubClass.prototype[method] = SuperClass.prototype[method];
				}
			}
		}
	}

	module.exports = Base;

});