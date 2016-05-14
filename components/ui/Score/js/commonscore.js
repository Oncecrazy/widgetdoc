define('CommonScore',['Base','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

var defaults = {
		target      	:   null,         // String   目标元素
		score       	:   0,            // Number   默认评分
		activeClass     :   "active",     // String   激活后CSS类名
		renderEvt		:   "mouseover",  // String   渲染事件       
		comfirmEvt  	:   "click",      // String   确认事件
		ComfirmCb	    :	function(){}  // Function 确认后回调函数
	};

	/**
	 * @description                     Score组件
	 * @param  {function}  Base         基类构造函数
	 * @param  {function}  				构造函数初始化
	 *         {object}    config       配置参数		                                
	 */
	var CommonScore = Base.extend(Score,function(config){
		var option = $.extend({},defaults,config);
		Score.call(this,option)
		this.init(option);
	});

	Base.implement(Score,Event);

	Score.prototype.render = function(){
		var target =  event.srcElement,
			activeClass = this.option.activeClass,
			index = $(target).index(),
			score = index === -1 ? 0 : index +1;
		$(target).addClass(activeClass).siblings().removeClass(activeClass);
		return index +1;
	}

	module.exports = Score;	
});