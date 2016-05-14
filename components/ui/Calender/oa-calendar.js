define('oacalendar' , function(require , exports , module){

	var DomCalendar = require('domcalendar');
	var $ = require('jquery');

	//构造函数
	var OaCalendar = DomCalendar.expand(function(Super , args){
		if(!args.element)return;
		this.element = $(args.element);
		this.lang = args.lang || 'en';
		this.box = $('<div class="oa_calendar_box"></div>');
		this.yearElem = getYearElem(this);
		this.monthElem = getMonthElem(this);
		this.dateElem = getDateElem(this);
		$(document.body).append(this.box);
		bindEvents(this);
	});

	OaCalendar.addProperty({

		//渲染
		render : function(){
			this.renderYear();
			this.renderMonth();
			this.renderDate();			
		},

		//年份渲染
		renderYear : function(){
			this.yearElem.html(this.year);
		},

		//月份渲染
		renderMonth : function(){
			this.monthElem.html(this.month + 1);
		},

		//日期渲染
		renderDate : function(){
			var days = this.days;
			var fDay = this.getFirstDay();
			var temp = days + fDay;
			var dates = temp + 7 - (temp % 7 == 0 ? 7 : temp % 7);
			var html = '';
			for(var i=0;i<dates;i++){
				var inner = i - fDay + 1;
				if(i % 7 === 0){
					html += '<tr>';
				}
				if(i < fDay || inner > days){
					html += '<td>&nbsp;</td>';
				}else{
					if(i % 7 === 0 || i % 7 === 6){
						html += '<td class="oa_isweekend hasdate">' + inner + '</td>';
					}else{
						html += '<td class="hasdate">' + inner + '</td>';
					}
				}
				if(i % 7 === 6){
					html += '</tr>';
				}
			}
			this.dateElem.html(html);
			this.dateElem.find('.hasdate').removeClass('oa_date_selected');
			this.dateElem.find('.hasdate').eq(this.date -1).addClass('oa_date_selected');
		},

		// 获取日历容器
		getCalendar : function(){
			return this.box;
		},

		// 获取触发日历的文本框
		getInput : function(){
			return this.element;
		}

	});

	// 获取年份容器
	function getYearElem(obj){
		var html = '<div class="oa_year_content">\
						<div class="oa_year_elem"></div>\
						<div class="oa_year_btns">\
							<input type="button" value="&and;" />\
							<input type="button" value="&or;" />\
						</div>\
					</div>';
		obj.box.append(html);
		return obj.box.find('.oa_year_elem');
	}

	// 获取月份容器
	function getMonthElem(obj){
		var html = '<div class="oa_month_content">\
						<div class="oa_month_elem"></div>\
						<div class="oa_month_btns">\
							<input type="button" value="&and;" />\
							<input type="button" value="&or;" />\
						</div>\
					</div>';
		obj.box.append(html);
		return obj.box.find('.oa_month_elem');
	}

	// 获取日期容器
	function getDateElem(obj){
		var html = '<table class="oa_date_content">\
						<thead>' + getWeekHtml(obj.lang) + '</thead>\
						<tbody class="oa_date_btns"></tbody>\
					</table>';
		obj.box.append(html);
		return obj.box.find('.oa_date_btns');
	}

	// 获取星期html
	function getWeekHtml(lang){
		var html = '<tr>';
		var week = DomCalendar.days[lang];
		for(var i=0;i<week.length;i++){
			if(i % 7 === 0 || i % 7 === 6){
				html += '<th class="oa_isweekend">' + week[i] + '</th>';
			}else{
				html += '<th>' + week[i] + '</th>';
			}
		}
		html += '</tr>';
		return html;
	}

	// 事件绑定
	function bindEvents(obj){
		var box = obj.box,
			elem = obj.element,
			yearBtns = box.find('.oa_year_btns input'),
			monthBtns = box.find('.oa_month_btns input'),
			dateBtns = obj.dateElem;

		//日历上的点击阻止事件往上冒泡
		box.click(function(ev){
			ev.stopPropagation();
		});

		//上一年按钮点击事件
		yearBtns.eq(0).click(function(){
			obj.pre('year');
		});

		//下一年按钮点击事件
		yearBtns.eq(1).click(function(){
			obj.next('year');
		});

		//上一月按钮点击事件
		monthBtns.eq(0).click(function(){
			obj.pre('month');
		});

		//下一月按钮点击事件
		monthBtns.eq(1).click(function(){
			obj.next('month');
		});

		//日期点击事件
		dateBtns.on('click' , '.hasdate' , function(ev){
			var target = ev.currentTarget;
			obj.toDate(obj.year , obj.month , +target.innerHTML);
			elem.val( obj.year  + ('0' + (obj.month + 1) ).slice( -2 )  + ('0'+obj.date).slice(-2));
			obj.hide();
		});

		//鼠标移上日期
		dateBtns.on('mouseover' , '.hasdate' , function(ev){
			$(ev.currentTarget).addClass('over_date');
		});

		//鼠标移出日期
		dateBtns.on('mouseout' , '.hasdate' , function(ev){
			$(ev.currentTarget).removeClass('over_date');
		});

		//文本框点击事件
		elem.click(function(ev){
			obj.show();
			ev.stopPropagation();
			DomCalendar.hideExcept(obj.calendarId);
		});

	}

	module.exports = OaCalendar;

});