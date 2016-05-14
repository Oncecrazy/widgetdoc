define('ImagePPT', ['jquery'],function(require , exports , module){
	var $ = require('jquery');
	var defaults = {
		oCover:".cover",//cover pannel
		oImg :'img', //image
		oList :'imglist', //image list
		oClass: 'select', //image list select class
		oDel:".del",//shutdown
		oPrev:".prev",//left row
		oNext:".next",//right row
		confirmCb: function(){}
	}

	var ImagePPT = function(option){
		this.init(option);
	}
	ImagePPT.prototype.init = function(option){
		var config = $.extend({}, defaults, option);
		this.config = config;
		var orgData= getImgData(); 
		this.data = parseImgData(orgData);
		this.imgIdx = 0;//当前显示图片序号
		this.selectItem( this.imgIdx );
		eventsInit(this);
	}
	ImagePPT.prototype.render = function(idx,refresh){
		var _this = this,
			config = this.config,
			data = this.data;
		//预加载图片，以获取图片尺寸
		loadImage(getpicDomain(data[idx].src),function(){
			var width = this.width,
				height = this.height;
				size = adjustImgSize(width, height);
			$(config.oImg).attr('width',size[0]);
			$(config.oImg).attr('height',size[1]);
		});
		$(config.oImg).attr('src', getpicDomain(data[idx].src));
		$(config.oImg).attr('alt', data[idx].alt);
		if(refresh){
			$(config.oList).html(createImgList(data));
		}
		this.open();
	}

	ImagePPT.prototype.destory = function(){
		this.close();
		this.config = null;
	}

	ImagePPT.prototype.open = function(){
		$(this.config.oCover).show();
	}

	ImagePPT.prototype.close = function(){
		$(this.config.oCover).hide();
	}


	ImagePPT.prototype.next = function(){		
		this.selectItem(this.imgIdx + 1);
	}

	ImagePPT.prototype.prev = function(){
		this.selectItem(this.imgIdx - 1);
	}

	ImagePPT.prototype.selectItem = function(index){
		this.imgIdx = index;
		if(index >= 0 && index <= this.data.length -1){
			this.render(index, false);
		}else{
			var orgData= getImgData(); 
			this.data = parseImgData(orgData);
			if(index < 0){
				this.imgIdx = this.data.length -1;
				this.render(this.imgIdx, true);
			}
			if(index > this.data.length -1){
				this.imgIdx = 0;
				this.render(0, true);
			}
		}
	}

	function getImgData(){
		var data = [{src:'1501/26/20150126_d2b3bd5f82dcdab121d16tps9nvdeh88.jpg',
					alt:'111'},
					{src:'1501/26/20150126_ccefd82d508767adc64dt8daxi21ohza.jpg',
					alt:'222'},
					{src:'1501/13/20150113_f7e84a717a03b4b6693bvsvf7ur3b4yq.jpg',
					alt:'333'}];
		/*$.ajax({
				type:'post',
				url:'/riji/ajaxpost.php',
				data:data, 
				dataType:'json',
				success:function(data){
					return data;
				}
			});*/
		return data;
	}

	function parseImgData(data){
		return data;
	}

	/**
	 * @description            组件事件初始化
	 * @param  {object} obj    PPT组件对象
	 * @return {null}        
	 */
	function eventsInit(obj){
		var config = obj.config,
			confirmCb = config.confirmCb;
		//切换图片事件	
		$(config.oCover).on("click", config.oNext, function(event){
			obj.next();
			event.stopPropagation();
		}).on("click", config.oPrev, function(event){
			obj.prev();
			event.stopPropagation();
		}).on("click", config.oDel, function(event){
			obj.close();
			event.stopPropagation();
		});
		//图片缩略图列表点击事件
		$(config.oList).on("click",'div', function(){
			$(this).addClass(config.oClass).siblings().removeClass(config.oClass);
			var index = $(this).index();
			obj.selectItem(index);
			event.stopPropagation();
		});
		$(document.body).on("keydown",function(event){
			keyDownListen(obj, event, confirmCb);
		});	
		//调整浏览器窗口
		$(window).bind("resize",function() {
			var width = $(config.oImg).attr('width'),
				height = $(config.oImg).attr('height'),
				size = adjustImgSize(width, height);
			$(config.oImg).attr('width',size[0]);
			$(config.oImg).attr('height',size[1]);	
		});
		//鼠标滑轮事件
		var mousewheelHandler = function(event){
			mouseScrollListen(obj, event);
			removeMousewheel($(config.oCover)[0], mousewheelHandler, 400);
		}
		addMousewheel($(config.oCover)[0],mousewheelHandler);
	}

	/**
	 * @description                	监听按键事件
	 * @param  {object}   obj      	PPT组件对象
	 * @param  {object}   event    	按键事件
	 * @param  {Function} callback 	确认(enter)后回调函数
	 * @return {null}           
	 */
	function keyDownListen(obj, event, callback){
		var which = event.which;	
    	if(which === 37 ){ // left
    		obj.prev();
    		event.preventDefault();
    	}else if(which === 39){ // right
    		obj.next();
    		event.preventDefault();
    	}else if(which === 13 || which === 108){ // enter
			//callback && callback.call(null,$.trim(obj.elements.val()));
			event.preventDefault();
    	}else if(which === 27){ //	escape
    		//obj.close();
    		event.preventDefault();
    	}	     
    }

    /**
	 * @description                	监听滚轮事件
	 * @param  {object}   obj      	PPT组件对象
	 * @param  {object}   event    	按键事件
	 * @return {null}           
	 */
    function mouseScrollListen(obj, event){
    	var delta = event.delta;
    	if(delta > 0){
    		obj.next();
    		event.preventDefault();
    	}else{
    		obj.prev();
    		event.preventDefault();
    	}
    }

    function createImgList(data){
    	var list = '';
    	for(var i = 0; i < data.length; i++){
    		list += '<div class="thumb"><img src="'+ getpicDomain(data[i].src,'s')+'" alt="'+ data[i].alt +'"></div>';
		}
		return list;
    }

    function adjustImgSize(width,height){
    	var ch = (document.documentElement.clientHeight || document.body.clientHeight)-240,
            cw = (document.documentElement.clientWidth || document.body.clientWidth)-240,
            //cp = width / height,
 			cwp = cw / width,
            chp = ch / height;
			  
		if(height > ch && width > cw) {
			if(chp > cwp){
				return [parseInt( width * cwp ),parseInt( height * cwp )];
			}else{
				return [parseInt( width * chp ),parseInt( height * chp )];
			}	
		} else if(height > ch && width <= cw) {
			return [parseInt( width * chp ),parseInt( height * chp )];	
		} else if(height <= ch && width > cw) {
			return [parseInt( width * cwp ),parseInt( height * cwp )];	
		} else {
			return [parseInt(width), parseInt(height)];	
		}
	}

	function getpicDomain(filename ,type){
	    var fileText,filetype;
	    var domain = "http://pic1.to8to.com/case";
	    if(type ==='s'){
	        domain = domain.replace('case','smallcase');
	        filename = filename.replace('.','_s.');
	    }else{
	    	fileText = filename.substring(filename.lastIndexOf("."),filename.length);
            filetype = fileText.toLowerCase();
            if($.inArray(filetype , ['.jpg','png']) !=-1)
            {
                filename =filename.substr(0,(filename.length-10))+'l1'+filename.substr(filename.length-8);
                filename = filename.replace(/.(jpg|png)$/,"_sp\.$1");
            }
	    }
	    return domain+'/'+filename;
	}

	//绑定鼠标滚轮事件
	function addMousewheel(obj, Fn) {
	    if (obj.addEventListener) {
	        obj.onmousewheel === undefined ? obj.addEventListener('DOMMouseScroll', Fn, false) : 
	        								 obj.addEventListener('mousewheel', Fn, false);
	    }else {
	        obj.attachEvent('onmousewheel', Fn);
	    }
	}

	//删除鼠标滚轮事件
	function removeMousewheel(obj, Fn, delay) {
		if(obj.removeEventListener){
			obj.onmousewheel === undefined ? obj.removeEventListener('DOMMouseScroll', Fn, false) : 
	        								 obj.removeEventListener('mousewheel', Fn, false);
		}else{
			obj.detachEvent('onmousewheel', Fn);;
		}
		if(delay){
			setTimeout(function(){
				addMousewheel(obj, Fn);
			},delay);
		}
	}

	//图片预加载
	function loadImage(url, callback) {
		var img = new Image(); //创建一个Image对象，实现图片的预下载
		img.src = url;
		if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
			callback.call(img);
			return; // 直接返回，不用再处理onload事件
		}
		img.onload = function() { //图片下载完毕时异步调用callback函数。
			callback.call(img); //将回调函数的this替换为Image对象
		};
	};

	module.exports = ImagePPT;
});