define('Title',['Base','Events','Tip','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		Tip = require('Tip');
		$ = require('jquery');

	var defaults = {
		attr 		: 	'data-title', //String   		Title提示属性,值为提示内容
	    effects     :   'normal',     // String   		动画效果的名称  normal| fade | slide
	    direction   :   'top',        // String   		提示显示的方位
	    trigger     :   'hover',      // String   		触发提示的事件类型
	    space       :   12            // Number   		提示离触发元素的间距
	};

	var Title = Base.extend(Base, function(option){
		this.init(option);
	});

	Base.implement(Title, Event);


	Title.prototype.init = function(option){
		var config = $.extend({}, defaults, option);
		this.config = config;
		this.attr = config.attr;
		this.render(option);		
		initEvent(this);		
	};

	Title.prototype.render = function(option){
	};


	Title.prototype.destroy = function(){
		this.off();
		$(document).off('.title');
		this.attr = null;
		this.config = null;
	};

	function initEvent(obj){
		var config = obj.config;
		$(document).off('.title').on('mouseenter.title', '[' + config.attr + ']' ,function(e){
			var $target = $(this),
				content = $target.attr(config.attr);
			new Tip({
		        target: $target,
		        content: content,
		        trigger : config.trigger,
		        effects  : config.effects,
		        direction : config.direction,
		        space: config.space
		    }).show();
		});
	};

	module.exports = Title;	
});