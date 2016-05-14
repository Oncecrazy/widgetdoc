define('ScrollWord',['UniformMotion','jquery'],function(require,exports,module){
	var UniformMotion = require('UniformMotion'),
		$ = require('jquery');

	var defaults = {
		//容器
		container:'',
		//行高
		height: 25,
        //动作时间，默认500毫秒
        speed: 1000
    };

	var WordScroll =  function(option){	
		option = $.extend({}, defaults, option);
		this.init(option);
	}

	WordScroll.prototype.init = function(option){
		var config = {};
		config.elem = $(option.container);
		config.offset = [0 , -1*option.height];
		config.duration = option.speed;
		var uniformMotion = new UniformMotion(config);
		uniformMotion.addListener("afterStopMove",function(){
			var _this = this;
			$(_this.elem).find(":first").appendTo($(_this.elem));
			$(_this.elem).css("top","0");
			uniformMotion.start();
		});
		uniformMotion.start();
	};


	module.exports = WordScroll;
});