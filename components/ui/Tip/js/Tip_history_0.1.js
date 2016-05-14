define('Tip',['Base','jquery'],function(require,exports,module){
	var Base = require('Base'),
		$ = require('jquery');

	var defaults = {
		target      :   null,         // String   		目标元素
	    content     :   null,         // String|Object 	提示的内容
	    effects     :   'normal',     // String   		动画效果的名称  normal| fade | slide
	    maxWidth    :   200,          // Number   		提示的最大显示宽度
	    position    :   'top',        // String   		提示显示的方位
	    trigger     :   'hover',      // String   		触发提示的事件类型
	    zIndex      :   9900,         // Number   		提示的层级    
	    autoClose   :   false,        // Boolean  		提示是否自动关闭
	    waitTime    :   1000,		  // Number   		提示关闭等待时间，在设置autoClose为TURE后才生效
	    space       :   8,            // Number   		提示离触发元素的间距
	    listener    :   function(){}  // Function       自定义事件监听函数
	};

	var Tip = Base.extend(Base,function(option){
		this.init(option);
	});

	Tip.prototype.init = function(option){
		var _this = this,
		 	config = $.extend({}, defaults, option);
		this.config  = 	config;
		this.elements = $(config.target);
		this.closetimer = null;
		this.render();		
		initEvent(this);		
	}

	Tip.prototype.render = function(){
		var config  = this.config,
			content = config.content,
			tipElem = typeof content ==="object" ? $(content): $(createHtml(content));
		this.tipElem = tipElem;
		tipElem.appendTo(document.body);
		setStyle(tipElem, config);
		setPosition(this.elements, tipElem ,config);
		addListener(this);
		this.tipElem.hide();
	}


	Tip.prototype.destroy = function(){
		this.tipElem = null;
		this.elements = null;
		this.config = null;
	}

	Tip.prototype.open = function() {
		var _this = this,
			config = this.config,
			autoClose = config.autoClose,
			waitTime = config.waitTime,
			effects = config.effects;
		switch (effects) {
			case 'normal':
				this.tipElem.stop().show();
				break;
			case 'fade':
				this.tipElem.stop().fadeIn();
				break;
			case 'slide':
				this.tipElem.stop().slideDown();
				break;
		}
	}

	Tip.prototype.close = function() {
		var effects = this.config.effects;
		switch (effects) {
			case 'normal':
				this.tipElem.hide();
				break;
			case 'fade':
				this.tipElem.fadeOut();
				break;
			case 'slide':
				this.tipElem.slideUp();
				break;
		}
	}

	function initEvent(obj){
		if(obj.config.trigger ==='hover'){
			obj.elements.on("mouseenter",function(){
	            obj.open();
	        }).on("mouseleave",function(){
	            clearTimeout(obj.closetimer);
				obj.closetimer = setTimeout(function(){
					obj.close();
				},100);
	        }); 
		}else{
			obj.elements.on(obj.config.trigger,function(){	
				obj.open();
				if(obj.config.autoClose){
					clearTimeout(obj.closetimer);
					obj.closetimer = setTimeout(function(){
						obj.close();
					},obj.config.waitTime);
				}
			});
		}
	}

	function createHtml(content){
		var html = '<div class="tip">\
						<div class="tt_wrapper">\
							<s class="tt_arrow"></s>\
							<div class="tt_content">'+ content +'</div>\
						</div>\
					</div>'
		return html;
	}

	function setStyle(obj,option){
		var maxWidth = option.maxWidth,
			zIndex = option.zIndex,
			position = option.position,
			autoClose = option.autoClose;
        obj.css({
        	position: 'absolute',
 			top : '-1000px',
            zIndex: zIndex
        });
		obj.find("s").addClass("tt_arrow_"+position);	
	}

	function setPosition(refer,obj,option){
		var cssMap = {},
            space = option.space,
            position = option.position,
			/* 参考对象的位置 */
            referTop = refer.offset().top,
            referLeft = refer.offset().left,
            referWidth = refer.outerWidth(),
            referHeight = refer.outerHeight(),
            /* 提示框的宽高 */       
            tipWidth = obj.outerWidth(),
            tipHeight = obj.outerHeight();

        if( position === 'top' || position === 'bottom' ){
            cssMap.left = referLeft  + referWidth / 2  - tipWidth / 2 + 'px';
            if( position === 'top' ){
                cssMap.top = referTop - tipHeight - space + 'px';
            }
            else{
                cssMap.top = referTop + referHeight + space + 'px';
            }
        }
        else if( position === 'left' || position === 'right' ){
            cssMap.top = referTop + referHeight / 2  - tipHeight / 2 + 'px';      
            if(  position === 'left' ){
                cssMap.left = referLeft - tipWidth - space + 'px';
            }
            else{
                cssMap.left = referLeft + referWidth + space + 'px';  
            }
        }
        obj.css( cssMap );  
	}

	function addListener(obj){
		obj.tipElem.on("mouseenter",function(){
            clearTimeout(obj.closetimer);
            obj.open();
        }).on("mouseleave",function(){
            obj.close();
        }); 
        obj.config.listener.call(obj,obj.tipElem);
	}
	module.exports = Tip;	
});