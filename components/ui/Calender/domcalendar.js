define('domcalendar' , function(require , exports , module){

	var Calendar = require('calendar');

	var DomCalendar = Calendar.expand(function( Super ){

		Super();

		var __calendars = DomCalendar.__calendars;

		this.calendarId = __calendars.length;

		__calendars.push(this);

	});

	DomCalendar.__calendars = [];		//页面内所有的日历对象

	DomCalendar.__calendarId = 0;		//当前显示的日历对象索引

	// 月份数组
	DomCalendar.monthes = {
		cn : ['一' , '二' , '三' , '四' , '五' , '六' , '七' , '八' , '九' , '十' , '十一' , '十二'],
		en : ['Jan' , 'Feb' , 'Mar' , 'Apr' , 'May' , 'Jun' , 'Jul' , 'Aug' , 'Sep' , 'Oct' , 'Nov' , 'Dec']
	};

	// 星期数组
	DomCalendar.days = {
		cn : ['日' , '一' , '二' , '三' , '四' , '五' , '六'],
		en : ['Sun' , 'Mon' , 'Tue' , 'Wed' , 'Thu' , 'Fri' , 'Sat']
	};

	DomCalendar.addProperty({

		/**
		 * @method getInput
		 * @description 获取触发日历的文本框,继承类必须实现该方法
		 * @return {jQueryObj} 返回一个jquery对象
		 */
		getInput : function(){},

		/**
		 * @method getCalendar
		 * @description 获取日历容器,继承类必须实现该方法
		 * @return {jQueryObj} 返回一个jquery对象
		 */
		getCalendar : function(){},

		/**
		 * @method hide
		 * @description 隐藏日历
		 * @return {void} 
		 */
		hide : function(){

			var calendar = this.getCalendar();

			calendar && calendar.hide();

		},

		/**
		 * @method show
		 * @description 显示日历
		 * @return {void} 
		 */
		show : function(){

			var calendar = this.getCalendar();

			if(calendar){

				calendar.show();

				setCalendarPos(this);

			}

			DomCalendar.__calendarId = this.calendarId;

		},

		/**
		 * @method toString
		 * @return {String} 组件信息描述
		 */
		toString : function(){

			return '[t8t-domcalendar object]';

		}

	});

	/**
	 * @method DomCalendar.hideExcept
	 * @description 隐藏calendarId不等于index的日历
	 * @param  {Number} index 不想被隐藏的日历id,若找不到对应index的日历,则隐藏全部日历
	 * @return {void}       
	 */
	DomCalendar.hideExcept = function( index ){

		var __calendars = DomCalendar.__calendars;

		for(var i=0;i<__calendars.length;i++){

			if(__calendars[i].calendarId === index)continue;

			__calendars[i].hide();

		}
	}

	// 设置日历位置
	function setCalendarPos(obj){
		var ipt = obj.getInput();
		if(!ipt)return;
		var offset = ipt.offset();
		var outerH = ipt.outerHeight();
		obj.getCalendar().css({
			left : offset.left +  'px',
			top : offset.top + outerH + 'px'
		});
	}

	// document上绑定click事件
	$(document).on('click' , function(ev){

		ev.which < 2 && DomCalendar.hideExcept();

	});

	// 监听window的resize事件
	$(window).on('resize' , function(ev){

		setCalendarPos(DomCalendar.__calendars[DomCalendar.__calendarId]);

	});

	module.exports = DomCalendar;

});