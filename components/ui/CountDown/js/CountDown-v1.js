define('countdown',function(require,exports,module){
	
	/**
	 * [CountDown description]
	 * @param {int} time  [倒计时秒数]
	 * @param {int} space [倒计时间隔时间（单位毫秒）,默认是1秒刷新一次]
	 * 使用时间差值，能够避免Firefox和谷歌在标签页闲置时，将setInterval的时间间隔限制在1000ms左右的问题。
	 * 如果时间间隔高于1000ms，则没有相应限制。如果时间间隔低于1000ms，则暂停setInterval。
	 * 关键如下：
	 * totalCount = this.time; //倒计时总差值
	 * beginCount = +new Date(); //倒计时开始时间
	 * countdown.time = countdown.totalCount - (+new Date() - countdown.beginCount)/1000; //倒计时实际经历的差值
	 */
	
	var CountDown = function(time, space){
		this.time = time >= 0 ? time : 0;
		this.space = space || 1000;
		this.finish = false;
		this.countTimer = null;
	}

	CountDown.prototype.count = function(callback) {
		var _this = this;
		this.totalCount = this.time;
		this.beginCount = +new Date();
		refresh(this, callback);
		if (this.time >= 0) {
			_this.countTimer = setInterval(function() {
				refresh(_this, callback);
			}, _this.space );
		}
	}

	function refresh(countdown, callback){
		if (countdown.time <= 0) {
			countdown.finish = true;
			clearInterval(countdown.countTimer);
		}
		typeof callback === 'function' && callback(convert(countdown.time, countdown.space), countdown.finish);
		countdown.time = countdown.totalCount - (+new Date() - countdown.beginCount)/1000;
	}

	function convert(time, space){
		var temp = [ 60 * 60 * 24 , 60 * 60 , 60 , 1 ,space/1000];
		var counts = [];
		if(time <= 0){
			return [0,0,0,0,0];
		}
		for(var i = 0;i<temp.length;i++){
			counts[i] = Math.floor(time / temp[i]);
			if(counts[i]>0){
				time = time - counts[i] * temp[i];
			}
		}
		return counts;
	}

	module.exports = CountDown;
});