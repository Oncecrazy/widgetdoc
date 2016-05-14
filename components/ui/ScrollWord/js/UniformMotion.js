define('UniformMotion',['Base','Move','jquery'],function(require,exports,module){
	var Base = require('Base'),
        Move = require('Move'),
		$ = require('jquery');

    /*
        var defaults = {
        //运动元素
        elem: null,
        //偏移位置
       s offset: [0, 0],
        //运动的时间，默认500毫秒
        duration: 500,
    };*/

    var UniformMotion = Base.extend(Move,function(config){
        Move.call(this,config);
    })


	UniformMotion.prototype.init =  function(option){
		this.originPos = [toInteger($(this.elem).css("left")), toInteger($(this.elem).css("top"))];
		this.offset = option.offset;
		return this;
	};

	UniformMotion.prototype.step = function(timeUsed){
		//每一步的X,Y轴的位置
        var pos = calcPosition(this,timeUsed);
        position(this, pos[0], pos[1]);
    	return this;
    };

	/**
    * @description           计算运动元素的空间位置
    * @param {Object} obj    Move对象
    * @return {Array} pos    运动元素位移的X,Y轴偏移量
    */
    function calcPosition(obj,timeUsed) {
        var pos = [0, 0];
        for (var i = 0; i < 2; i++) {
            pos[i] =  obj.offset[i]/obj.duration * timeUsed;
        }
        return pos;
    }

    /**
    * @description 			定位
    * @param {Object} obj 	Move对象
    * @param {Number} x 	X轴偏移量 
    * @param {Number} y 	Y轴偏移量 
    */
    function position(obj, x, y) {
        $(obj.elem).css({
            left: obj.originPos[0] + x,
            top:  obj.originPos[1] + y
        });
    }

    //将字符串转化为整数
    function toInteger(text) {
        text = parseInt(text);
        return isFinite(text) ? text : 0;
    }
    module.exports = UniformMotion;
});