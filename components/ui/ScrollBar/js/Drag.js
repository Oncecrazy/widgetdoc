define('drag', function(require, exports, module) {

	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
	    container  :   window,    // String|Object 设置拖拽范围的元素
	    target     :   null,      // String|Object 拖拽元素   
	    axis       :   '',        // String        设置拖拽的方向，x是横向，y是纵向
	    restore    :   false      // Boolean       是否在拖拽结束后还原到初始的位置
	}

	var Drag = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	Base.implement(Drag, Event);

	Drag.prototype.init = function(option){
		var config = $.extend({}, defaults, option);
		this.config = config;
		this.target = $(config.target);
		this.target.css('position') === 'static' && this.target.css('position' , 'relative');
		isNaN(parseInt(this.target.css('left'))) && this.target.css('left' , 0);
		isNaN(parseInt(this.target.css('top'))) && this.target.css('top' , 0);
		var container = this.config.container == window ? document.body: this.config.container;
		this.boundary = getBoundary($(container));
		initEvent(this);
	}

	Drag.prototype.render = function(currPos){
		var left = !this.config.axis || this.config.axis.toUpperCase() === 'X' ? currPos.left : this.originPos.left,
			top = !this.config.axis || this.config.axis.toUpperCase() === 'Y' ? currPos.top : this.originPos.top;
		this.target.css({
			left : left + 'px',
			top : top + 'px'
		});
	}

	Drag.prototype.dragging = function(movePos){
		if(!this.target){return;}
		var currPos = {
				left: movePos.left + this.originPos.left,
				top: movePos.top + this.originPos.top
			},
			elemWidth = $(this.target).outerWidth(),
			elemHeight = $(this.target).outerHeight(),
			boundary = this.boundary;

		currPos.left = currPos.left < 0 ? 0 : 
							currPos.left > boundary.width - elemWidth ? boundary.width - elemWidth: currPos.left;
		console.log('boundary.width ' + boundary.width);
		console.log('elemWidth ' + elemWidth);
		console.log('currPos.left ' + currPos.left);

		currPos.top = currPos.top < 0 ? 0 : 
							currPos.top > boundary.height - elemHeight ? boundary.height - elemHeight : currPos.top;					
		this.render(currPos);
	}

	Drag.prototype.destroy = function(){
		this.off();
		this.target = null;
		this.config = null;
	}

	function initEvent(obj){
		var config = obj.config,
			target = obj.target,
			targetCursor = target.css('cursor'),
			mouseOriginPos = {},
			dragFlag = false;
		target.on('mousedown', function(evt){
			evt.stopPropagation();
			if(!target){return;}
			obj.originPos = getTargetPos(obj);
			mouseOriginPos = getMousePos(evt);
			dragFlag = true;
			target.css('cursor' , 'pointer');
			obj.emit('beforeDrag');
		});
		$(document.body).on('mousemove', function(evt){
			if(!dragFlag){return;}
			var mousePos = getMousePos(evt);
			var movePos = {
				left: mousePos.left - mouseOriginPos.left,
				top: mousePos.top - mouseOriginPos.top
			}
			obj.dragging(movePos);
			obj.emit('dragging', movePos);
		}).on('mouseup', function(evt){
			if(!dragFlag){return;}
			target.css('cursor' , targetCursor);
			if(config.restore){
				target.css({
					left : obj.originPos.left,
					top : obj.originPos.top
				});
			}
			obj.emit('afterdrop');
			dragFlag = false;
		});
	}

	function getBoundary(elem){
		return {
			top : elem.offset().top || 0,
			left: elem.offset().left || 0,
			width: elem.width(),
			height: elem.height()
		}
	}

	function getMousePos(evt){
		return {
			left: evt.pageX + $(document.body).scrollLeft(),
			top: evt.pageY + $(document.body).scrollTop()
		}
	}

	function getTargetPos(obj){
		return {
			left : parseInt(obj.target.css('left')),
			top: parseInt(obj.target.css('top'))
		}
	}
});