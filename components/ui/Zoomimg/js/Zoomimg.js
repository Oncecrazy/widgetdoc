define('zoomimg', function(require, exports, module) {

	var Base = require('Base'),
		$ = require('jquery');

	var defaults = {
		originImg: '',   //原始图片
		slider: '',      //选择器
		bigImg: '',      //放大图片
		imgSrc: ''       //大图图片URL
	}

	var ZoomImg = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	ZoomImg.prototype.init = function(option) {
		var config = $.extend({}, defaults, option);
		this.config = config;
		if(!this.config.imgSrc){
			this.config.imgSrc = $(this.config.originImg).find('img').attr('src');
		}
		$(this.config.bigImg).find('img').attr('src', this.config.imgSrc);
		initEvent(this);
	}

	function initEvent(obj){
		var originImg = $(obj.config.originImg);
		originImg.on('mouseenter', function(evt){
			mouseenterHandler(evt, obj);
		});
		originImg.on('mousemove',function(evt){
			mousemoveHandler(evt, obj);
		});
		originImg.on('mouseleave', function(evt){
			mouseleaveHandler(evt, obj);
		});

	}

	function mouseenterHandler(evt, obj){
		var slider = $(obj.config.slider),
			target = $(obj.config.bigImg);
		mousemoveHandler(evt, obj)
		target.show();	
		slider.show();	
	}

	function mousemoveHandler(evt, obj){
		var source = $(obj.config.originImg),
			slider = $(obj.config.slider),
			target = $(obj.config.bigImg),
			relativeX = evt.pageX - source.offset().left - slider.outerWidth() / 2,
			relativeY = evt.pageY - source.offset().top - slider.outerHeight() / 2,
			// relativeX = evt.offsetX  - slider.outerWidth() / 2,
			// relativeY = evt.offsetY - slider.outerHeight() / 2,
			xRatio = target.width()/slider.outerWidth(),
			yRatio = target.height()/slider.outerHeight();
		// 滑块可拖动边界 
		var boundary = [ 0 , 0 , 
			source.width() - slider.outerWidth() , source.height() - slider.outerHeight()];		
		relativeX = relativeX < boundary[0] ? boundary[0] : 
					relativeX > boundary[2] ? boundary[2] : relativeX;
		relativeY = relativeY < boundary[1] ? boundary[1] : 
					relativeY > boundary[3] ? boundary[3] : relativeY;
		slider.css({
				left : relativeX + 'px',
				top : relativeY + 'px'
			});
		target.find('img').css({
				left : -relativeX * xRatio + 'px',
				top : -relativeY * yRatio + 'px' 
			});	
	}

	function mouseleaveHandler(evt, obj){
		var slider = $(obj.config.slider),
			target = $(obj.config.bigImg);
		target.hide();	
		slider.hide();
	}
});