define('shake', ['jquery'], function(require, exports, module) {
	
	var $ = require('jquery');

	var defaults = {
		btnEvent: 'mouseover', //抖动触发方式
		style: '', //抖动方式 {x,y,rotation}或者function
		speed: '', //抖动频率
		startFunc: function() {}, //开始运动前的回调函数
		endFun: function() {} //结束运动后的回调函数
	};

	var Shake = function(settings) {
		this.settings = $.extend({}, defaults, settings);
		this.$target = $(this.settings.target);
		this.interval = null;
	};



	Shake.prototype.active = function() {
		var _this = this;
			settings = _this.settings,
			container = _this.$target,
		container.on(settings.btnEvent, function() {
			_this.startShake();
		});
	};

	Shake.prototype.deactive = function() {
		var settings = this.settings,
			container = this.$target;
		container.off(settings.btnEvent);
		this.stopShake();
	}

	Shake.prototype.startShake = function() {
		var settings = this.settings,
			container = this.$target,
			style = settings.style,
			speed = settings.speed,
			callback = settings.startFunc;
		callback.call(container);
		if (typeof style === "function") {
			style.call(container, settings);
		} else {
			clearInterval(this.interval);
			this.interval = setInterval(function() {
				shake(container, settings);
			}, speed);
		}
	}

	Shake.prototype.stopShake = function() {
		var settings = this.settings,
			container = this.$target,
			callback = settings.endFun;
		clearInterval(this.interval);
		if (container.css('display') === 'inline') {
			container.css('display', 'inline');
		}
		var reset = {
			'left': 0,
			'top': 0,
			'-webkit-transform': 'rotate(0deg)',
			'-moz-transform': 'rotate(0deg)',
			'-ms-transform': 'rotate(0deg)',
			'-o-transform': 'rotate(0deg)',
			'transform': 'rotate(0deg)'
		};
		container.css(reset);
		callback.call(container);
	}


	function shake(container, settings) {
		var x = settings.style.x * 2,
			y = settings.style.y * 2,
			rot = settings.style.rotation * 2,
			rx = Math.floor(Math.random() * (x + 1)) - x / 2,
			ry = Math.floor(Math.random() * (y + 1)) - y / 2,
			rrot = Math.floor(Math.random() * (rot + 1)) - rot / 2;
			/*========================================================*/
			/* Ensure Movement From Original Position
			/*========================================================*/
			rx = (rx === 0 && x !== 0) ? ((Math.random() < .5) ? 1 : -1) : rx;
			ry = (ry === 0 && y !== 0) ? ((Math.random() < .5) ? 1 : -1) : ry;
			/*========================================================*/
			/* Check Inline
			/*========================================================*/
			if (container.css('display') === 'inline') {
				container.css('display', 'inline-block');
			}
			/*========================================================*/
			/* Rumble Element
			/*========================================================*/
			container.css({
				'position': 'relative',
				'left': rx + 'px',
				'top': ry + 'px',
				'-webkit-transform': 'rotate(' + rrot + 'deg)',
				'-moz-transform': 'rotate(' + rrot + 'deg)',
				'-ms-transform': 'rotate(' + rrot + 'deg)',
				'-o-transform': 'rotate(' + rrot + 'deg)',
				'transform': 'rotate(' + rrot + 'deg)'
			});
	}

	module.exports = Shake;
});