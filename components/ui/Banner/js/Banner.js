/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 *       var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('banner', function(require, exports, module){

    var Base = require('Base'),
        Event = require('Events'),
        $ = require('jquery');

    var defaults = {
        target: '',
        controlNav: '',
        prevBtn: '',                 //上一个按钮
        nextBtn: '',                 //下一个按钮
        num : 1,                     //每次移动个数
        loop: true,                  //循环播放
        direction: 'horizon',        //默认运动方向  horizon、vertical 
        autoSpeed: 0,                //自动播放速度，默认0（即不自动播放）
        animationSpeed: 1000         //动画速度
    };

    /**
     * [Banner Banner组件]
     * @description 这是一个轮播图组件
     * @extends     Base                
     * @implement   Events
     * @param  {object}    option       配置参数
     */
    var Banner = module.exports = Base.extend(Base, function(option){
        /**
         * [config 配置对象]
         * @type {object}
         */
        this.config = null;
        /**
         * [step 当前位置]
         * @type {Number}
         */
        this.step = 0;
        this.init(option);
    });

    Base.implement(Banner, Event);

    /**
     * [init 初始化]
     * @param  {object} option  配置参数
     * @return {void}       
     */
	Banner.prototype.init = function(option){
        var _this = this,
            autoSpeed = 0;
        this.config = $.extend({}, defaults, option);
		this.step = 0;
        autoSpeed = this.config.autoSpeed;
        //设置容器宽或高
        this.setSize();
        //事件初始化
        initEvent(this);
        //自动播放
        if(autoSpeed){
            clearInterval(this.autoTimer);
            this.autoTimer = setInterval(function(){
                _this.next();
            }, autoSpeed);
        }
	};

    /**
     * [move 移动]
     * @param  {number} step 移动到指定位置
     * @return {void}    
     */
	Banner.prototype.move = function(step){
		var _this = this,
            config = this.config,
            target = $(config.target),
            loop = config.loop,
            direction = config.direction,
            len = target.children().length,
            func = step >= this.step? moveNext : movePrev;

        //开始移动
        if(target.is(":animated")){return;}
        if(loop){
            func(this, step, function(){
                    _this.step = step;
                    _this.emit('move',  step >= 0 ? step%len : len - Math.abs(step)%len );
                }, direction);
        }else if(step>=0 && step < len){
            func(this, step, function(){
                    _this.step = step;
                    _this.emit('move', step);
                }, direction);
        }
	}


    /**
     * [stop 停止自动播放]
     * @return {[type]} [description]
     */
    Banner.prototype.stop = function(){
        clearInterval(this.autoTimer);
    }    

    /**
     * [prev 向前移动]
     * @return {void}
     */
	Banner.prototype.prev = function(){
		this.move(this.step - this.config.num);
	}

    /**
     * [next 向后移动]
     * @return {void}
     */
	Banner.prototype.next = function(){
        this.move(this.step + this.config.num);
	}

    //获取容器实际占位高度
    /**
     * [getSize 获取容器实际占位]
     * @return {object}  [容器宽高]
     */
    Banner.prototype.getSize = function(){
        var direction = this.config.direction,
            target = $(this.config.target),
            num = this.config.num,
            width = 0,
            height = 0,
            maxRowHeight = 0,
            curHeight = 0;

        target.children().each(function(idx){

            //计算容器宽度（水平滑动使用）
            width += caclOccupySpace($(this)).width;

            //计算容器高度（纵向滑动使用）
            curHeight = caclOccupySpace($(this)).height;
            maxRowHeight = maxRowHeight > curHeight ? maxRowHeight: curHeight;
            if((idx+1)%num === 0){
                height += maxRowHeight;
                maxRowHeight = 0;
            }
            //重设元素宽高，防止百分比带来的bug
            $(this).css({
                width: $(this).width(),
                height: $(this).height()
            });
        });

        maxRowHeight && (height += maxRowHeight);

        return {
            width : width,
            height : height
        }
    }


    /**
     * [setSize 设置容器宽或高]
     * @param {object} size  指定宽高
     * @return {void} 
     */
    Banner.prototype.setSize = function(size){
        var direction = this.config.direction,
            target = $(this.config.target),
            num = this.config.num,
            i = 1,
            maxHeight = 0,
            value = 0,
            temp = 0;
        if(direction === 'horizon'){
            target.css('width',  ( (size && size.width) || this.getSize().width ) + 'px');
        }else{
            target.css('height', ( (size &&　size.height) || this.getSize().height ) +'px');
        }
    }

    /**
     * [initEvent 事件初始化]
     * @private
     * @param  {object} obj  Banner对象
     * @return {void}    
     */
    function initEvent(obj){
        var config = obj.config;
        $(config.prevBtn).on('click',function(){
            obj.prev();
        });
        $(config.nextBtn).on('click',function(){
            obj.next();
        });
        $(config.controlNav).on('click',function(){
            var index = $(this).index();
            obj.move(index);
        });
    }


    /**
     * [caclOccupySpace 计算元素实际占位空间]
     * @private
     * @param  {object} element jQuery/Dom对象
     * @return {object}         [元素占位空间]
     */
    function caclOccupySpace(element){
        var width = $(element).outerWidth() + parseFloat($(element).css('marginLeft')) 
                + parseFloat($(element).css('marginRight')),
            height = $(element).outerHeight() + parseFloat($(element).css('marginTop')) 
                + parseFloat($(element).css('marginBottom'));
        return {
            width : width,
            height : height
        }
    }


    /**
     * [movePrev 前移]
     * @private
     * @param  {object}   obj       Banner对象
     * @param  {number}   step      指定移动位置
     * @param  {Function} callback  完成时执行的回掉函数
     * @param  {string}   direction 方向horizon/vertical
     * @return {void}            
     */
    function movePrev(obj, step, callback, direction){
        var target = $(obj.config.target),
            speed = obj.config.animationSpeed,
            num = obj.config.num,
            distance = 0,
            animateMap = {},
            moveList = [],
            skip = Math.abs(obj.step - step),
            height = obj.getSize().height,
            len = target.children().length,
            originSize;
        //计算移动距离            
        target.children().each(function(idx){
            if(idx >= len - skip){
                moveList.push($(this));
                if(direction === 'horizon'){
                    distance += caclOccupySpace($(this)).width;
                }
            }
        });
        if(direction === 'vertical'){
            distance += Math.floor(skip/num) * (height/Math.ceil(len/num));
        }

        originSize = obj.getSize();
        //拷贝
        for(var i = moveList.length-1 ; i>=0; i--){
            moveList[i].clone(true).prependTo(target);
        }
        obj.setSize();

        animateMap[direction === 'horizon' ? 'marginLeft' : 'marginTop'] = -distance + "px"; 
        target.css(animateMap);
        animateMap[direction === 'horizon' ? 'marginLeft' : 'marginTop'] = "+=" + distance + "px"; 

        target.animate(animateMap, speed, function(){
            for(var i =0; i<moveList.length; i++){
                moveList[i].remove();
            }
            obj.setSize(originSize);
            callback();
        });
    }


    /**
     * [movePrev 后移]
     * @private
     * @param  {object}   obj       Banner对象
     * @param  {number}   step      指定移动位置
     * @param  {Function} callback  完成时执行的回掉函数
     * @param  {string}   direction 方向horizon/vertical
     * @return {void}            
     */
    function moveNext(obj, step, callback, direction){
        var target = $(obj.config.target),
            speed = obj.config.animationSpeed,
            num = obj.config.num,
            distance = 0,
            animateMap = {},
            moveList = [],
            skip = Math.abs(obj.step - step),
            height = obj.getSize().height,
            len = target.children().length,
            originSize;

        //计算移动距离      
        target.children().each(function(idx){
            if(idx < skip){
                moveList.push($(this));
                if(direction === 'horizon'){
                    distance += caclOccupySpace($(this)).width;   
                }
            }
        });
        if(direction === 'vertical'){
            distance += Math.floor(skip/num) * (height/Math.ceil(len/num));
        }

        originSize = obj.getSize();
        //拷贝
        for(var i =0; i<moveList.length; i++){
            moveList[i].clone(true).appendTo(target);
        }
        obj.setSize();

        animateMap[direction === 'horizon' ? 'marginLeft' : 'marginTop'] = -distance + "px";   

        target.animate(animateMap, speed, function() {
            for(var i =0; i<moveList.length; i++){
                moveList[i].remove();
            }
            obj.setSize(originSize);
            animateMap[direction === 'horizon' ? 'marginLeft' : 'marginTop'] = 0;
            target.css(animateMap);
            callback();
        });
    }

});