define('Tip',['Base','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		target      :   null,         // String   		目标元素
		tip         :   '.tip',       // String         提示元素
		title       :   '',           // String         提示标题
	    content     :   '',           // String      	提示的内容
	    close       :   '',			  // string         关闭按钮的内容;
	    effects     :   'normal',     // String   		动画效果的名称  normal| fade | slide
	    direction   :   'top',        // String   		提示显示的方位
	    trigger     :   'hover',      // String   		触发提示的事件类型
	    zIndex      :   9900,         // Number   		提示的层级    
	    waitTime    :   -1,		      // Number   		提示关闭等待时间(正数为等待时间，否则不关闭)
	    space       :   12            // Number   		提示离触发元素的间距
	};

	var Tip = Base.extend(Base,function(option){
		this.init(option);
	});

	Base.implement(Tip, Event);

	Tip.prototype.init = function(option){
		var _this = this,
		 	config = $.extend({}, defaults, option);
		this.config  = 	config;
		this.elements = $(config.target);

		if($(this.config.tip).length <= 0){
			$(document.body).append('<div class="tip"></div>');
		}
		this.tip = $(this.config.tip);

		this.closetimer = null;
		this.render();		
		initEvent(this);		
	};

	Tip.prototype.render = function(){
		var config  = this.config,
			tip = this.tip,
			content = config.content,
			require = [];
			partscontent = {
				title : this.config.title,
				close : this.config.close,
				content : this.config.content
			};

		this.config.title && require.push('title');
		this.config.close && require.push('close');

		constructParts(tip , require , partscontent);

		setTipStyle(tip, config);

		loacteTipContent(this.elements,tip,config.direction,config.space);
	};


	Tip.prototype.destroy = function(){
		this.off();
		this.tip = null;
		this.elements = null;
		this.config = null;
	};

	Tip.prototype.show = function() {
		var _this = this,
			config = this.config,
			tip = this.tip,
			effects = config.effects;
		switch (effects) {
			case 'normal':
				tip.stop().show();
				break;
			case 'fade':
				tip.stop().fadeIn();
				break;
			case 'slide':
				tip.stop().slideDown();
				break;
		}
		loacteTipArrow(this.elements,tip,tip.find('.tip_arrow_icon'),config.direction,config.space);
	};

	Tip.prototype.close = function() {
		var effects = this.config.effects,
			tip = this.tip;
		switch (effects) {
			case 'normal':
				tip.hide();
				break;
			case 'fade':
				tip.fadeOut();
				break;
			case 'slide':
				tip.slideUp();
				break;
		}
	};

	//设置背景颜色
	Tip.prototype.setBgColor = function(color){
		var direction = this.config.direction;
		var tip = this.tip;
		tip.css("background-color",color);
		var arrow = this.tip.find("em.tip_arrow_icon");
		arrow.css("border-"+direction+"-color",color);
	}

	function initEvent(obj){
		var trigger = obj.config.trigger;
		obj.on('show',function(){
			obj.show();
		});
		obj.on('close',function(){
			clearTimeout(obj.closetimer);
			obj.closetimer = setTimeout(function(){
				obj.close();
			},100);
		});
		resize(obj);
		bindElementEvent(obj, trigger);
		bindTipEvent(obj);
	};

	function resize(obj){
		var element = obj.elements,
			tip = obj.tip,
			config = obj.config;
		$(window).bind("resize",function() {
            loacteTipContent(element,tip,config.direction,config.space);
            loacteTipArrow(element,tip,tip.find('.tip_arrow_icon'),config.direction,config.space);
        });
	};

	function bindElementEvent(obj){
		var element = obj.elements,
			trigger = obj.config.trigger;
		if(trigger ==='hover'){
			hoverEvent(obj, element);
		}else{
			element.on(trigger,function(){	
				obj.emit('show');
				if(obj.config.waitTime > 0){
					obj.emit('close');
				}
			});
		}
	};

	function bindTipEvent(obj){
		var tip = obj.tip;
		hoverEvent(obj, tip);
		tip.on( 'click' , '.tip_close', function(evt){
			obj.emit( 'close');
			evt.stopPropagation();
		});	
	};

	function hoverEvent(obj,target){
		var close = obj.config.close;
		if(!obj || !target){return;}
		target.on("mouseenter",function(){
			clearTimeout(obj.closetimer);
            obj.emit('show');
        }); 
		if(close ===''){
			target.on("mouseleave",function(){
            	obj.emit( 'close');
        	})
		}
	}


	function indexOf(arr , value){
		if(!arr){return -1;}
		for(var i = 0; i < arr.length; i++){
			if(arr[i] === value){return i;}
		}
		return -1;
	};

	function createParts(elem , name, content){
		var part;
		content = content || '';
		part = $('<div class="tip_' + name + '">'+ content +'</div>');
		elem.append(part);
		return part;
	};

	function requireParts (parts , part){
		return indexOf(parts , part) >= 0 ? true : false;
	};

	function constructParts (elem , parts , partscontent){
		var requireTitle = requireParts( parts, 'title'),
			requireClose = requireParts( parts, 'close'),
			part;
		elem.html('');
		createParts(elem , 'arrow', '<em class="tip_arrow_icon"></em>');
		if(requireTitle || requireClose){
			part = createParts(elem , 'head');
			requireTitle && createParts(part , 'title', partscontent['title']);
			requireClose && createParts(part , 'close', partscontent['close']);
		}
		createParts(elem , 'content', partscontent['content']);
	};

	function setTipStyle(obj,option){
		var zIndex = option.zIndex,
			direction = option.direction;
        obj.css({
        	position: 'absolute',
 			top : '-1000px',
            zIndex: zIndex
        });
		obj.find("em.tip_arrow_icon").addClass("tip_arrow_"+direction);	
	};

	/* 获得元素当前相对于文档的偏移（位置）*/
	function offsetPosition(element) {
		var top = element.offset().top,
			left = element.offset().left,
			owidth = element.outerWidth(),
			oheight = element.outerHeight();
		return {
			top: top,
			left: left,
			width: owidth,
			height: oheight
		};
	}

	/**
	 * [相对定位(目标元素应为绝对定位，且为body的直接子节点)]
	 * @param  {object} refer     [相对元素]
	 * @param  {object} target    [目标元素]
	 * @param  {String} direction [定位方向]
	 * @param  {int}    space     [定位间隙]
	 * @return {[type]}           [目标元素坐标值]
	 */
	function relativeLocate(refer,target,direction,space){
		var width = target.outerWidth(),
			height = target.outerHeight(),
			referoffset = offsetPosition(refer),
			bodyoffset,
			top,left;
		direction = direction || 'top';
		space = space || 0;
		if( direction === 'top' || direction === 'bottom' ){
            left = referoffset.left  + referoffset.width / 2  - width / 2;
            if( direction === 'top' ){
                top = referoffset.top - height - space;
            }else{
                top = referoffset.top + referoffset.height + space;
            }
        }else if( direction === 'left' || direction === 'right' ){
            top = referoffset.top + referoffset.height / 2  - height / 2;      
            if( direction === 'left' ){
                left = referoffset.left - width - space;
            }else{
                left = referoffset.left + referoffset.width + space;  
            }
        }
        if($(document.body).css("position")!=="static"){
        	bodyoffset = offsetPosition(document.body);
        	left = left - bodyoffset.left;
        	top = top - bodyoffset.left;
        }
        return {
        	top: top,
			left: left
        };
	}

	function loacteTipContent(refer,target,direction,space){
		var contentPosition = relativeLocate(refer,target,direction,space),
			left = contentPosition.left >0 ? contentPosition.left + 'px': '0',
            top = contentPosition.top >0 ? contentPosition.top + 'px': '0',
            cssMap =  {
	        	top: top,
				left: left
        	};
        target.css( cssMap );
        return cssMap;
	}

	function loacteTipArrow(refer,tip,arrow,direction,space){
		var referoffset = offsetPosition(refer),
			tipoffset = offsetPosition(tip),
			width = arrow.outerWidth(),
			height = arrow.outerHeight(),
			left,top,cssMap = {};
		if( direction === 'top' || direction === 'bottom' ){
            left = Math.abs(tipoffset.left - referoffset.left) + referoffset.width/2 - width/2;
            if( direction === 'top' ){
                top = Math.abs(tipoffset.top - referoffset.top) - height -2;
            }else{
                top = -((Math.abs(tipoffset.top - referoffset.top)- referoffset.height - space) + height);
            }
        }else if( direction === 'left' || direction === 'right' ){
            top = Math.abs(tipoffset.top - referoffset.top) + referoffset.height/2  - height / 2;      
            if( direction === 'left' ){
                left = Math.abs(tipoffset.left - referoffset.left) - width -2;
            }else{
                left = -(Math.abs(tipoffset.left - referoffset.left- referoffset.width - space) + width);  
            }
        }
        cssMap ={
	        	top: top + 'px',
				left: left + 'px'
        	};
        arrow.css( cssMap );
        return cssMap;
	}

	module.exports = Tip;	
});