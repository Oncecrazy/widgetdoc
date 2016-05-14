define('Move',['Base','Events'],function(require,exports,module){
   
    var Base = require("Base");
    var Event = require("Events");

    /**
     * [Move description]
     * @description     运动基类
     * @param {Object}  初始化参数
     */
	function Move(config) {
        this.elem = config.elem;
        this.duration = config.duration;
        this.timerId = null;
        this.init(config);
    }   

    Base.implement(Move,Event);

    Move.prototype.init = function(){
        return this;
    }

    Move.prototype.start = function(){
    	var _this = this,
            begin = now();
    	this.emit('beforeStartMove');
        if (!!this.timerId) {
            this.stop();
        }
        this.timerId = setInterval(function() {
            var time = now(),
                timeUsed = time - begin;
            if(timeUsed >= _this.duration){
                _this.stop();
            }else{
                _this.step(timeUsed);
                _this.emit('duringMove');
            }
        }, 20);
        this.emit('afterStartMove');
        return this;
    }

    Move.prototype.step = function(){
    	return this;
    }

    Move.prototype.stop = function(){
        this.emit('beforeStopMove');
    	clearInterval(this.timerId);
    	this.timerId = null;
    	this.emit('afterStopMove');
    	return this;
    }

	Move.prototype.toString = function(){
		return '[object Move]'
    }

    Move.prototype.addListener = function(type,callback){
        this.on(type,callback);
        return this;
    }

    //获取当前时间的毫秒数
    function now() {
        return +new Date();
    }

    module.exports = Move;

});