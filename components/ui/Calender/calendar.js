define('calendar' , function(require , exports , module){

	var Base = require('base');

	var Events = require('events');

	var __date = new Date();

	var __dateArray = [ 'year' , 'month' , 'date' , 'hour' , 'minute' , 'second' ];

	/**
	 * @method Calendar
	 * @description 日历构造函数
	 * @param  {Number} year          年
	 * @param  {Number} month         月
	 * @param  {Number} date	   	  日
	 * @param  {Number} hour          时
	 * @param  {Number} minute        分
	 * @param  {Number} second	   	  秒
	 */
	var Calendar = Base.expand(function(Super , year , month , date , hour , minute , second){

		this.year = year || __date.getFullYear();

		this.month = month || __date.getMonth();

		this.date = date || __date.getDate();

		this.hour = hour || __date.getHours();

		this.minute = minute || __date.getMinutes();

		this.second = second || __date.getSeconds();

		this.days = getDays(this.year , this.month);

		bindEvents(this);

	});

	// 日历构造函数继承Events的方法
	Calendar.getPropertyFrom(Events);

	Calendar.addProperty({

		/**
		 * @method    toDate
		 * @description 跳转到指定日期
		 * @param  {Number} year  指定年
		 * @param  {Number} month 指定月
		 * @param  {Number} date  指定日
		 * @return {void} 
		 */
		toDate : function( year , month , date , hour , minute , second ){

			var _ = getDateByPara( year , month , date , hour , minute , second );

			var methods = ['renderYear' , 'renderMonth' , 'renderDate' ,

						 'renderHour' , 'renderMinute' , 'renderSecond' ];

			var emits = ['beforeYearChange' , 'beforeMonthChange' , 'beforeDateChange' , 

						'beforeHourChange' , 'beforeMinuteChange' , 'beforeSecondChange'];

			var _this = this , flag = false , year = this.year , month = this.month;

			if(isChanged(_ , this) && this.emit( 'beforeChange' , _ ) === false){

				return;

			}

			for(var i=0;i<6;i++){

				if( ( (i == 2 && (this.year !== year || this.month !== month) ) || 

					this[__dateArray[i]] !== _[i] ) && this.emit( emits[i] , _, this[__dateArray[i]] !== _[i] ) !== false){

					changeDate( i );

					flag = true;

				}

			}

			function changeDate( index ){

				_this[__dateArray[index]] = _[index];

				_this.days = getDays( _this.year , _this.month );

				_this[methods[index]]();

			}

			return flag;

		},

		/**
		 * @method getFirstDay
		 * @description 获取月份中的第一天是星期几
		 * @return {Number}
		 */
		getFirstDay : function(){

			return new Date(this.year , this.month , 1).getDay();

		},

		/**
		 * @method   pre
		 * @description 到上一年(月/日)
		 * @param  {String} type 必须,'year'到上一年,'month'到上一月,'date'到上一天
		 * @return {void} 
		 */
		pre : function(type){

			return this.next(type , -1);

		},

		/**
		 * @method   next
		 * @description 到下一年(月/日)
		 * @param  {String} type 必须,'year'到下一年,'month'到下一月,'date'到下一天
		 * @return {void} 
		 */
		next : function(type , which){

			which = which || 1;

			var temp = [this.year , this.month , this.date , this.hour , this.minute , this.second];

			for(var i=0,len=temp.length;i<len;i++){

				if(type === __dateArray[i]){

					temp[i] = temp[i] + which;

				}

			}

			return this.toDate.apply(this , temp);

		},

		/**
		 * @method toString
		 * @return {String} 组件信息描述
		 */
		toString : function(){

			return '[t8t-calendar object]';

		},

		/**
		 * @method renderYear
		 * @description  渲染年份
		 * @return {void}
		 */
		renderYear : function(){},

		/**
		 * @method renderMonth
		 * @description  渲染月份
		 * @return {void}
		 */
		renderMonth : function(){},

		/**
		 * @method renderDate
		 * @description  渲染日
		 * @return {void}
		 */
		renderDate : function(){},

		/**
		 * @method renderHour
		 * @description  渲染小时
		 * @return {void}
		 */
		renderHour : function(){},

		/**
		 * @method renderMinute
		 * @description  渲染分钟
		 * @return {void}
		 */
		renderMinute : function(){},

		/**
		 * @method renderSecond
		 * @description  渲染秒
		 * @return {void}
		 */
		renderSecond : function(){},

		/**
		 * @method beforeYearChange
		 * @description  年份改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动年份
		 */
		beforeYearChange : function(){},

		/**
		 * @method beforeMonthChange
		 * @description  月份改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动月份
		 */
		beforeMonthChange : function(){},

		/**
		 * @method beforeDateChange
		 * @description  日期改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动日期
		 */
		beforeDateChange : function(){},

		/**
		 * @method beforeHourChange
		 * @description  小时改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动小时
		 */
		beforeHourChange : function(){},

		/**
		 * @method beforeMinuteChange
		 * @description  分钟改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动分钟
		 */
		beforeMinuteChange : function(){},

		/**
		 * @method beforeSecondChange
		 * @description  秒改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动秒
		 */
		beforeSecondChange : function(){},

		/**
		 * @method beforeChange
		 * @description  年|月|日中有改变之前的回调事件
		 * @return {Boolean} 如果return false则不改动任何一个,且年|月|日对应的回调函数也不触发
		 */
		beforeChange : function(){}

	});

	//事件绑定
	function bindEvents(obj){

		obj.on('beforeYearChange' , obj.beforeYearChange);

		obj.on('beforeMonthChange' , obj.beforeMonthChange);

		obj.on('beforeDateChange' , obj.beforeDateChange);

		obj.on('beforeHourChange' , obj.beforeHourChange);

		obj.on('beforeMinuteChange' , obj.beforeMinuteChange);

		obj.on('beforeSecondChange' , obj.beforeSecondChange);

		obj.on('beforeChange' , obj.beforeChange);

	}

	//返回指定年份与指定月份的天数
	function getDays(year , month){
		var date = 28;
		var nextMonth = month;
		while(nextMonth === month){
			nextMonth = new Date(year , month , ++date).getMonth();
		}
		return date - 1;
	}

	//日期是否有变动
	function isChanged(_ , obj){

		return _[0] !== obj.year || _[1] !== obj.month || _[2] !== obj.date ||

			   _[3] !== obj.hour || _[4] !== obj.minute || _[5] !== obj.second;

	}

	//通过指定参数获取时间
	function getDateByPara( year , month , date , hour , minute , second ){

		var _date = new Date();

		year = isNaN(+year) ? _date.getFullYear() : +year;

		month = isNaN(+month) ? _date.getMonth() : +month;

		date = isNaN(+date) ? _date.getDate() : +date;

		hour = isNaN(+hour) ? _date.getHours() : +hour;

		minute = isNaN(+minute) ? _date.getMinutes() : +minute;

		second = isNaN(+second) ? _date.getSeconds() : +second;

		_date = new Date( year , month , date , hour , minute , second );

		return [ _date.getFullYear() , _date.getMonth() , _date.getDate() ,

				_date.getHours() , _date.getMinutes() , _date.getSeconds() ];

	}

	module.exports = Calendar;

});