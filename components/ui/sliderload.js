define('sliderload', function(require, exports, module) {
    var Base = require('base');
    var Events = require('events');
    var $ = require('$');

    var defaults = {
        container: '', //容器  
        distance: 50   //拉动距离（触发）
    }

    var SliderLoad = module.exports = Base.expand(function(Super, option) {
        this.init(option);
    });

    SliderLoad.getPropertyFrom(Events);

    SliderLoad.prototype.init = function(options){
        var config = $.extend({}, defaults, options);
        this.config = config;
        this.$element = $(config.container);
        this.isLock = false;
        this.loading = false;
        this.isActive = false;
        initEvent(this);
    }

    SliderLoad.prototype.lock = function(){
        this.isLock = true;
    }

    SliderLoad.prototype.unlock = function(){
        this.isLock = false;
    }

    function initEvent(obj) {
        obj.$element.on('touchstart',function(evt){
            if(!obj.loading && !obj.isLock){
                evt.touches = evt.touches || evt.originalEvent.touches;
                touchstartHandler(evt, obj);
            }
        })
        .on('touchmove',function(evt){
            if(!obj.loading && !obj.isLock){
                evt.touches = evt.touches || evt.originalEvent.touches;
                touchmoveHandler(evt, obj);
            }
        })
        .on('touchend',function(evt){
            if(!obj.loading && !obj.isLock){
                evt.touches = evt.touches || evt.originalEvent.touches;
                touchendHandler(evt, obj);
            }
        });
    }

    function touchstartHandler(evt, obj){
        obj.data = {};
        obj.data.startY = evt.touches[0].pageY;
        obj.data.height = obj.$element.height();
        obj.data.contentHeight = obj.$element.children().height();
        obj.data.scrollTop = obj.$element.scrollTop();
        obj.isActive = false;
    }

    function touchmoveHandler(evt, obj){
        var absMoveY;
        obj.data.curY = evt.touches[0].pageY;
        obj.data.moveY = obj.data.curY - obj.data.startY;
        absMoveY = Math.abs(obj.data.moveY);
        if(!obj.data.moveY){return;}
        obj.direction = obj.data.moveY > 0 ? 'down': 'up'; 
        if(obj.data.scrollTop <= 0 && obj.direction === 'down'){ //下拉
            if(absMoveY<= obj.config.distance){
                obj.data.offsetY = absMoveY;
                obj.emit('beforepull', obj);
            }else {
                obj.data.offsetY = obj.config.distance+(absMoveY-obj.config.distance)*0.3;
                obj.emit('afterpull', obj);
                obj.isActive = true;
            }
        }else if(obj.data.contentHeight <= (obj.data.height + obj.data.scrollTop) 
            && obj.direction=== 'up'){  //上推
            if(absMoveY <= obj.config.distance){
                obj.data.offsetY = absMoveY;
                obj.emit('beforepush', obj);
            }else if(absMoveY > obj.config.distance){
                obj.data.offsetY = obj.config.distance+(absMoveY-obj.config.distance)*0.3;
                obj.emit('afterpush', obj);
                obj.isActive = true;
            }
        }
    }

    function touchendHandler(evt, obj){
        if(!obj.isActive){return;}
        if(obj.direction === 'down'){
            obj.emit('pullload', obj);
        }else if(obj.direction === 'up'){
            obj.emit('pushload', obj);
        }
    }
});