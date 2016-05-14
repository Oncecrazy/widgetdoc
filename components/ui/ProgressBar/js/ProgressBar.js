define('progressbar', function(require, exports, module) {

	var Base = require('Base'),
	    Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		container : document.body,     
		auto: true,  //自动执行
		rate: 0.02,
        speed: 500,  //自动执行刷新间隔
        easing: 'ease',
		template :  '<div class="progress" role="progress">\
		               <div class="progressbar" role="bar">\
		               </div>\
		            </div>'
	}

	var ProgressBar = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	Base.implement(ProgressBar, Event);


	ProgressBar.prototype.init = function(option) {
		this.config = $.extend({}, defaults, option);
		this.status = null;
	}


	ProgressBar.prototype.start = function() {
		var config = this.config,
			_this = this;
		this.render();

		var run = function() {
			setTimeout(function() {
				if (_this.status!=='done') return;

				_this.inc();

				run();
			}, config.speed);
	    };
	    if(config.auto){run();}

	    this.emit("start");

		return this.set(0);
	}

	ProgressBar.prototype.done = function() {
		
		this.emit("done");

		return this.inc(0.3 + 0.5 * Math.random()).set(1);
	}
	
	ProgressBar.prototype.render = function(){
		if(!this.elem || !this.elem.length){return;}

		var config = this.config;
		
		if(!$(config.container).find('[role="progress"]').length){
			this.elem = $(config.template);
			this.elem.appendTo(config.container);
		}
		return this;
	}

	ProgressBar.prototype.remove = function(){
		this.elem && this.elem.remove();
		this.emit("removed");
	}

	ProgressBar.prototype.set = function(num){
		var n = clamp(n, 0, 1);

		this.status = (n === 1 ? null : n);

		this.emit("running", n);

		return this;
	}

	ProgressBar.prototype.inc = function(amount){
		var n = this.status;

	    if (!n) {
	      return this.start();
	    }

		if (typeof amount !== 'number') {
			amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
		}

		n = clamp(n + amount, 0, 0.994);

		return this.set(n);
	}

	function clamp(n, min, max) {
		if (n < min) return min;
		if (n > max) return max;
		return n;
	}
});