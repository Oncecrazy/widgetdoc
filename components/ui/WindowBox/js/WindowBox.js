/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('WindowBox',['Base','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		target: null,
		box : 'windowbox',
		title : '',
		content : null,
   		width: 480,
    	height: null,
		zIndex : 9999,
		hasMask: true,
		btnName: {confirm : '确定', cancel : '取消', close : '&times'},
		requires : ['title' , 'close' , 'confirm' , 'cancel']
	};

	/**
	 * [WindowBox WindowBox]
	 * @description 这是一个弹窗组件                   
	 * @extends  	Base               	
	 * @implement   Events
	 * @param  {object}    config       配置参数  	                                
	 */
	var WindowBox = Base.extend(Base, function(config){
		var option = $.extend({}, defaults, config);
		this.init(option);
	});

	Base.implement(WindowBox,Event);

	/**
	 * [init 初始化]
	 * @param  {object} option 配置参数
	 * @return {void}   
	 */
	WindowBox.prototype.init = function(option){
		this.config = option;
		this.box = null;
		this.cover = null;
		this.render();
		initEvent(this);
	}
	
	/**
	 * [render 组件渲染]
	 * @return {void}       
	 */
	WindowBox.prototype.render = function(){
		var partscontent = {
			title : this.config.title,
			close : this.config.btnName.close,
			content : this.config.content,
			confirm : this.config.btnName.confirm,
			cancel : this.config.btnName.cancel
		};
		this.box = $('<div class="'+ this.config.box +'"></div>');
		this.cover = this.config.hasMask ? tools.createCoverlayer() : $();
		tools.constructParts(this.box , this.config.requires, partscontent);
		$(document.body).append(this.box);
	}

	/**
	 * [show 打开弹窗]
	 * @return {void}       
	 */
	WindowBox.prototype.show = function(){
		tools.hideScroll(this);
		this.cover.show();
		defaults.maxzIndex = defaults.maxzIndex || this.config.zIndex;
		this.cover.css('zIndex' , ++defaults.maxzIndex);
		this.box.css('zIndex' , ++defaults.maxzIndex);
		this.box.show();
		tools.resizeWindowBox(this.box);
	}

	/**
	 * [close 关闭弹窗]
	 * @return {void}       
	 */
	WindowBox.prototype.close = function(){
		this.box.hide();
		this.box.css('zIndex' , --defaults.maxzIndex);
		if(defaults.maxzIndex-1 === this.config.zIndex){
			this.cover.hide();
		}
		this.cover.css('zIndex' , --defaults.maxzIndex);
		tools.showScroll(this);
	}


	/**
	 * [alert 打开自定义alert弹窗]
	 * @param  {string} content 展示内容
	 * @return {void}       
	 */
	WindowBox.alert = function(content){
		var windowbox = new WindowBox({content : content ,requires : ['confirm']});
		windowbox.show();
	}

	/**
	 * [alert 打开自定义confirm弹窗]
 	 * @param  {string} content  展示内容
 	 * @param  {string} callback 点击确定后的回调函数
	 * @return {void}       
	 */
	WindowBox.confirm = function(content , callback){
		var windowbox = new WindowBox({content : content ,requires : ['confirm' , 'cancel']});
		windowbox.off('confirm');
		windowbox.off('cancel');
		windowbox.on('confirm' , callback);
		windowbox.on('cancel' , callback);
		windowbox.show();
	}

	/**
	 * [alert 打开自定义prompt弹窗]
	 * @param  {string} title           标题
 	 * @param  {string} defaultContent  默认内容
 	 * @param  {string} callback        回调函数
	 * @return {void}       
	 */
	WindowBox.prompt = function(title , defaultContent , callback){
		if(typeof title === 'function'){
			callback = title;
			title = defaultContent = '';
		}else if(typeof defaultContent === 'function'){
			callback = defaultContent;
			defaultContent = '';
		}
		title = title || '';
		defaultContent = defaultContent || '';
		callback = callback || function(){};
		var windowbox = new WindowBox({
			title : title,
			content : '<input type="text" value="' + defaultContent + '" class="windowbox_prompt" />',
			requires : ['title' , 'confirm' , 'cancel']});
		windowbox.off('confirm');
		windowbox.off('cancel');
		windowbox.on('confirm' , callback);
		windowbox.on('cancel' , callback);
		windowbox.show();
	}

	function initEvent(obj){
		$(obj.config.target).on("click", function(){
			obj.show();
		});
		//自适应处理
        $(window).bind("resize",function() {
            tools.resizeWindowBox(obj.box); 
        });
		$.each(['confirm' , 'close' , 'cancel'] , function(i , v){
			obj.box.on( 'click' , '.windowbox_' + v , function(evt){
				obj.emit( v , !i);
				obj.close();
				evt.stopPropagation();
			});
		});
	}

	//工具方法
	var tools = {
		createCoverlayer : function(zIndex){
			var cover = $('.windowbox_coverlayer').length ? $('.windowbox_coverlayer') :
							 $('<div class="windowbox_coverlayer"></div>');
			var bodyheight = $(document.body).outerHeight();
			cover.css("height",bodyheight);
			!$('.windowbox_coverlayer').length && $(document.body).append(cover);
			return cover;
		},

		createParts : function(elem , name, content){
			var part;
			content = content || '';
			part = $('<div class="windowbox_' + name + '">'+ content +'</div>');
			elem.append(part);
			return part;
		},

		resizeWindowBox : function(elem ){
			var left = ($(window).width() - elem.width())/2;
			var top = $(window).scrollTop() + ($(window).height() - elem.height())/2;
			elem.css({
				position: 'absolute',
				left : left + 'px',
				top : top + 'px'
			});
		},

		requireParts : function(parts , part){
			return this.indexOf(parts , part) >= 0 ? true : false;
		},

		constructParts : function(elem , parts , partscontent){
			var createParts = this.createParts,
				requireParts = this.requireParts,
				requireTitle = requireParts.call(this, parts, 'title'),
				requireClose = requireParts.call(this, parts, 'close'),
				requireConfirm = requireParts.call(this, parts, 'confirm'),
				requireCancel = requireParts.call(this, parts, 'cancel'),
				part;
			elem.html('');
			if(requireTitle || requireClose){
				part = createParts(elem , 'header');
				requireTitle && createParts(part , 'title', partscontent['title']);
				requireClose && createParts(part , 'close', partscontent['close']);
			}
			createParts(elem , 'content', partscontent['content']);
			if(requireConfirm || requireCancel){
				part = createParts(elem , 'footer');
				requireConfirm && createParts(part , 'confirm', partscontent['confirm']);
				requireCancel && createParts(part , 'cancel', partscontent['cancel']);
			}
		},

		hideScroll : function(obj){
			obj.oldHtmlOverflow = $("html").css("overflow");
			obj.oldBodyOverflow = $("body").css("overflow");
			$("html").css("overflow","hidden");
            $("body").css("overflow","hidden");
		},
		
		showScroll : function(obj){
			$("html").css("overflow",obj.oldHtmlOverflow);
            $("body").css("overflow",obj.oldBodyOverflow);
		},

		indexOf : function(arr , value){
			if(!arr){return -1;}
			for(var i = 0; i < arr.length; i++){
				if(arr[i] === value){return i;}
			}
			return -1;
		}
	};

	module.exports = WindowBox;
});