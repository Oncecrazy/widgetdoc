/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('Score',['Base','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		target   : '',					//string|object  目标元素(seletor|jquery对象)
		list  : '',						//string|object  评分元素(seletor|jquery对象)
		activeCl : 'on',                //string         激活类名
		score    : 0,                   //number         默认评分
		renderListener : function(){},  //function       渲染事件
		comfirmListener : function(){}  //function       确认事件
	}
	/**
	 * [Score Score组件]
	 * @description 这是一个评分组件                   
	 * @extends  	Base               	
	 * @implement   Events
	 * @param  {object}    option       配置参数
	 *                           target              目标元素
	 *                           list                评分元素
	 *                           activeCl	         激活类名
	 *                           score               默认评分  
	 *                           renderListener      渲染事件
	 *                           comfirmListener     确认事件      	                                
	 */
	var Score = module.exports = Base.extend(Base, function(option){
		/**
		 * [config 配置对象]
		 * @type {object}
		 */
		this.config = null;
		/**
		 * [score  评分]
		 * @type {Number}
		 */
		this.score = 0;
		/**
		 * [elements 目标对象]
		 * @type {object}
		 */
		this.elements = null;
		this.init(option);
	});

	Base.implement(Score,Event);


	/**
	 * [init 初始化]
	 * @param  {object} option  配置参数
	 * @return {null}
	 */
	Score.prototype.init = function(option){
		var config = $.extend({}, defaults, option);
		this.config = config;
		this.score = config.score;
		this.elements = $(config.target);
		initEvent(this);
		this.render(config.score);
	};


	/**
	 * [render 根据得分渲染]
	 * @param  {number} score  分数
	 * @return {null}      
	 */
	Score.prototype.render = function(score){
		var activeCl = this.config.activeCl,
			index = score -1,
			list = getChildren(this);
		if(score < 0 || score > list.length){return;}	
		list.removeClass(activeCl);	
		list.each(function(i){
			if(i<=index){
				$(this).addClass(activeCl);
			}
		});
		this.emit("render",score);
	}


	/**
	 * [destory 组件销毁]
	 * @return {null} 
	 */
	Score.prototype.destory = function(){
		this.emit("beforeDestory");
		this.elements = null;
		this.score = null;
		this.option = null;
	}


	/**
	 * [setScore 设置当前得分]
	 * @param {number} value 	分数
	 */
	Score.prototype.setScore = function(value){
		this.score = value;
		this.render(value);
	};


	/**
	 * [initEvent 事件初始化]
	 * @private (指示一个类或函数是私有的。私有类和函数不会出现在文档中)
	 * @param  {obj} obj 	Score组件对象
	 * @return {null}      
	 */
	function initEvent(obj){
		var element = obj.elements,
			renderScore = obj.score,
			renderListener = obj.config.renderListener
			comfirmListener = obj.config.comfirmListener;
		getChildren(obj).on("mouseenter",function(event){
			var target = event.target,
				index = $(target).index();
			renderScore = index === -1 ? 0 : index +1;
			obj.render(renderScore);
		}).on("mouseleave",function(){
			obj.render(obj.score);
		}).on("click",function(event){
			obj.score = renderScore;
			obj.emit("comfirm",obj.score);
		});	
		obj.on("render",renderListener);
		obj.on("comfirm",comfirmListener);
	}

	/**
	 * [getChildren 获取得分列表对象]
	 * @private (指示一个类或函数是私有的。私有类和函数不会出现在文档中)
	 * @param  {object} obj 	Score组件对象
	 * @return {object}     	得分列表对象
	 */
	function getChildren(obj){
		var list = obj.config.list;
		if(list ===''){
			list = obj.elements.children();
		}else if(typeof list ==='string'){
			list = obj.elements.find(list);
		}
		return list;
	}

});