/**
 * @fileOverview 组件基类(整个文件信息，可选)
 * @author kongchao
 * @see The <a href="http://www.example.com">Example Base</a>.
 * @example 
 * 		 var b = new Base();
 *       b.init();
 *       b.destroy();
 */

define('navfloor', function(require, exports, module) {

	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var defaults = {
		container: window,   		//容器   
		nav: '',           			//导航
		floor: '',         			//楼层
		gap : 20,           		//允许空隙，默认20px
		effect : 'normal'           //滚动效果， normal/smooth
	}

	/**
	 * [Navfloor  Navfloor组件]
	 * @description 这是一个楼层导航组件                   
	 * @extends  	Base               	
	 * @implement   Events
	 * @param  {object}    option       配置参数
	 *                     container           容器
	 *                     nav                 导航
	 *                     floor	           楼层
	 *                     gap                 允许空隙，默认20px  
	 *                     effect      		 滚动效果， normal/smooth    	                                
	 */
	var Navfloor = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	Base.implement(Navfloor, Event);

	/**
	 * [init 初始化]
	 * @param  {object} option 配置参数
	 * @return {void}        
	 */
	Navfloor.prototype.init = function(option) {
		var config = $.extend({}, defaults, option);
		/**
		 * [config 配置对象]
		 * @type {object}
		 */
		this.config = config;
		/**
		 * [nav 导航对象]
		 * @type {jQuery object}
		 */
		this.nav = $(config.nav).filter(":visible");
		initEvent(this);
	}

	/**
	 * [gotoFloor 跳转到指定楼层]
	 * @param  {number}  no     		楼层
	 * @param  {function}  callback     回调函数
	 * @return {null} 
	 */
	Navfloor.prototype.gotoFloor = function(no, callback) {
		var self = this,
			effect = this.config.effect,
			gap = this.config.gap,
			floors =  getFloorsTop(this),
			top = floors[no],
			duration = effect === 'normal'? 0: 1000;
		if(this.config.container == window){
			$('html').animate({scrollTop : top - gap}, duration);
			$('body').animate({scrollTop : top - gap}, duration, function(){
				self.emit('goto', no);
				callback && callback();
			});
		}else{
			$(this.config.container).animate({scrollTop : top - gap}, duration, function(){
				self.emit('goto', no);
				callback && callback();
			});
		}
	}

	/**
	 * [initEvent 事件初始化]
	 * @private
	 * @param  {object} obj   导航对象
	 * @return {void}  
	 */
	function initEvent(obj){
		var container = $(obj.config.container),
			nav = obj.nav;

		nav.on('click',function(){
			var idx = $(this).index();
			container.off("scroll.nav");
			obj.gotoFloor(idx, function(){
				setTimeout(function(){
					container.on("scroll.nav", _scroll);
				}, 10);
			});
		});

		container.on("scroll.nav", _scroll);

		function _scroll(){
			var top = container.scrollTop(),
				floors = getFloorsTop(obj);
				gap = obj.config.gap;
			var floorNo = getFloorNo(top, floors, gap);
			obj.emit('goto', floorNo);
		}
	}

	/**
	 * [getFloorsTop 获取所有楼层Top值]
	 * @private
	 * @param  {object} obj   导航对象
	 * @return {void}
	 */
	function getFloorsTop(obj){
		var floor = $(obj.config.floor),
			floors = [],
			container = obj.config.container;
		for(var i=0, len = floor.length; i<len; i++){
			floors[i] = container == window ? floor.eq(i).offset().top : 
						floor.eq(i).offset().top - $(container).offset().top + $(container).scrollTop();
		}
		return floors;
	}

	/**
	 * [getFloorNo 计算要跳转的楼层]
	 * @private
	 * @param  {number} top    当前容器top值
	 * @param  {array} floors  所有楼层top值数组
	 * @param  {number} gap    允许空隙
	 * @return {number}        楼层
	 */
	function getFloorNo(top, floors, gap){
		var len = floors.length;
		if(top + gap <= floors[0]){
			return 0;
		}
		if(top + gap >= floors[len-1]){
			return len-1;
		}
		for(var i=0; i<len; i++){
			if(top + gap >= floors[i] && (top + gap < floors[i+1])){
				return i;
			}
		}
	}
});