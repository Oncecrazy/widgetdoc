define('scrollbar', function(require, exports, module) {

	var Base = require('Base'),
		Drag = require('drag'),
		$ = require('jquery');

	var defaults = {
		container: '',    //容器
		content : '',     //滚动内容
		xTrack:'',        //横向滚动滑道
		xBar: '',         //横向滚动条
		yTrack: '',       //纵向滚动滑道
		yBar: '',         //纵向滚动条
		wheelSpeed: 20    //鼠标滚动时滑动速度
	}

	var ScrollBar = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	ScrollBar.prototype.init = function(option){
		var config = $.extend({}, defaults, option);
		//记录滑道初始位置
		config.xTrackBottom = parseFloat($(config.xTrack).css('bottom')) || 0;
		config.yTrackRight = parseFloat($(config.yTrack).css('right')) || 0;
		this.config = config;
		this.render();
		this.dragX = new Drag({
			container: this.config.xTrack,
			target: this.config.xBar,
			axis: 'x'
		});
		this.dragY = new Drag({
			container: this.config.yTrack,
			target: this.config.yBar,
			axis: 'y'
		});
		$(config.container)[0].onselectstart = function(){return false;};
		/*$(config.content).on('selectstart',function(){
			return false;
		});*/
		initEvent(this);
	}

	ScrollBar.prototype.render = function(){
		var config = this.config,
			size = getSize(this);
		if(config.xTrack){
			$(config.xTrack).css('width', size.limitWidth);
			if(size.xRatio < 1){
				$(config.xBar).css('width', size.limitWidth * size.xRatio + 'px');
				this.showBar('x');
			}else{
				this.hideBar('x');
			}
		}
		if(config.yTrack){
			$(config.yTrack).css('height', size.limitHeight);
			if(size.yRatio < 1){
				$(config.yBar).css('height',  size.limitHeight * size.yRatio + 'px');
				this.showBar('y');
			}else{
				this.hideBar('y');
			}
		}
	}

	ScrollBar.prototype.move = function(bars, pos){
		var config = this.config,
			content = $(config.content),
			xBar = $(config.xBar),
			yBar = $(config.yBar),
			size = getSize(this),
			top = size.top, 
			left = size.left;
		if(!bars || bars === 'x'){
			left += pos;
			left = left < -(size.contentWidth - size.limitWidth) ? -(size.contentWidth - size.limitWidth) : 
						left > 0 ? 0 : left;
		}
		if(!bars || bars === 'y'){
			top += pos;
			top = top < -(size.contentHeight -  size.limitHeight) ? -(size.contentHeight -  size.limitHeight) : 
						top > 0 ? 0 : top;
		}
		//移动内容
		content.css({"top": top, "left": left});
		//移动滚动条
		if(bars.indexOf('x')>=0){
			xBar.css({"left": (-1) * left * size.xRatio});
		}
		if(bars.indexOf('y')>=0){
			yBar.css({"top": (-1) * top * size.yRatio});
		}
	}

	ScrollBar.prototype.showBar = function(bars) {
		var config = this.config,
			xTrack = $(config.xTrack),
			yTrack = $(config.yTrack);			
		if(!bars || bars.indexOf('x')>=0){
			xTrack.css({bottom: config.xTrackBottom + 'px'});
		}
		if(!bars || bars.indexOf('y')>=0){
			yTrack.css({right: config.yTrackRight + 'px'});
		}
	}

	ScrollBar.prototype.hideBar = function(bars) {
		var config = this.config,
			xTrack = $(config.xTrack),
			yTrack = $(config.yTrack),
			width = (yTrack.outerWidth() + parseFloat(yTrack.css('marginRight'))
						+  parseFloat(yTrack.css('marginLeft'))) || 0,
			height = (xTrack.outerHeight() + parseFloat(xTrack.css('marginTop'))
						+  parseFloat(xTrack.css('marginBottom'))) || 0;	
		if(!bars || bars.indexOf('x')>=0){
			xTrack.css({bottom: -height + 'px'});
		}
		if(!bars || bars.indexOf('y')>=0){
			yTrack.css({right: -width + 'px'});
		}
	}

	//重新加载（动态改变内容后，刷新浏览器）
	ScrollBar.prototype.reload = function(){
		this.render();
	}

	function initEvent(obj){
		//监听滚动内容的鼠标滚动事件
		contentScrollListener(obj);

		// 监听滚动滑道的点击事件
		trackClickListner(obj);

		// 监听滚动条拖动事件
		barsDragListener(obj);
	}

	function contentScrollListener(obj){
		$(obj.config.container).on('mousewheel DOMMouseScroll', function(evt){
			evt.preventDefault();
			/* jQuery没有封装滚轮事件，此次使用原始的事件 */
			var oevt = evt.originalEvent;
			oevt.delta = (oevt.wheelDelta) ? oevt.wheelDelta / 120 : - (oevt.detail || 0) / 3;
			obj.move('y', obj.config.wheelSpeed * oevt.delta);
		});
	}

	function trackClickListner(obj){
		// 监听滚动滑道的点击事件
		$(obj.config.yTrack).on('click', function(evt){
			var yBarTop = parseFloat($(obj.config.yBar).css('top')),
				yBarHeight = $(obj.config.yBar).outerHeight(),
				relativeTop = evt.pageY - $(this).offset().top,
				yRatio = getSize(obj).yRatio;
			obj.move('y', (yBarHeight/yRatio) * (relativeTop > yBarTop ? -1 : 1));
			evt.stopPropagation();
		});
		//点击滚动条不会滚动
		$(obj.config.yBar).on('click', function(evt){
			evt.stopPropagation();
		});

		// 监听滚动滑道的点击事件
		$(obj.config.xTrack).on('click', function(evt){
			var xBarLeft = parseFloat($(obj.config.xBar).css('left')),
				xBarWidth = $(obj.config.xBar).outerWidth(),
				relativeLeft = evt.pageX - $(this).offset().left,
				xRatio = getSize(obj).xRatio;
			obj.move('x', (xBarWidth/xRatio) * (relativeLeft > xBarLeft ? -1 : 1));
			evt.stopPropagation();
		});
		//点击滚动条不会滚动
		$(obj.config.xBar).on('click', function(evt){
			evt.stopPropagation();
		});
	}

	function barsDragListener(obj){
		obj.dragX.on('dragging' , function( movePos ){
			var size = getSize(obj);
			var left = - movePos.left/size.xRatio;
			left = left < -(size.contentWidth - size.limitWidth) ? -(size.contentWidth - size.limitWidth) : 
						left > 0 ? 0 : left;
			//移动内容
			$(obj.config.content).css({"left": left});			
		});
		obj.dragY.on('dragging' , function( movePos ){
			var size = getSize(obj);
			var top = - movePos.top/size.yRatio;
			top = top < -(size.contentHeight -  size.limitHeight) ? -(size.contentHeight -  size.limitHeight) : 
						top > 0 ? 0 : top;
			//移动内容
			$(obj.config.content).css({"top": top});			
		});
	}

	function getSize(obj){
		var config = obj.config,
			container = $(config.container),
			content = $(config.content);
		return {
			limitWidth : container.width(),
			limitHeight: container.height(),
			contentWidth: content.outerWidth(),
			contentHeight : content.outerHeight(),
			xRatio : container.width()/content.outerWidth(),
			yRatio : container.height()/content.outerHeight(),
			left : parseFloat(content.css('left')) || 0,
			top : parseFloat(content.css('top')) || 0
		};
	}
});