define('timecalendar' , function(require , exports , module){

    var DomCalendar = require('domcalendar');
    var $ = require('jquery');
    var util = require('util');

	//构造函数
	var TimeCalendar = DomCalendar.expand(function(Super , args){
        if(!args.element)return;
        this.element = $(args.element);
        this.lang = args.lang || 'en';
        this.box = $('<div class="oa_calendar_box"></div>');
        this.yearElem = getYearElem(this);
        this.monthElem = getMonthElem(this);
        this.dateElem = getDateElem(this);
        this.timeElem = getTimeElem(this);
        this.focusTimePart = 'second';
        $(document.body).append(this.box);
        bindEvents(this);
	});

    TimeCalendar.addProperty({

		//渲染
		render : function(){
			this.renderYear();
			this.renderMonth();
			this.renderDate();
            this.renderHour();
            this.renderMinute();
            this.renderSecond();
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
        },

        //时间渲染
        renderHour:function(){
            this.timeElem.find('input[name=hour]').val(this.hour);
        },
        renderMinute:function(){
            this.timeElem.find('input[name=minute]').val(this.minute);
        },
        renderSecond:function(){
            this.timeElem.find('input[name=second]').val(this.second);
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

	// 获取日期容器
	function getTimeElem(obj){
        var html = '<div class="oa_time_content"><span class="title">时间</span>' +
                    '<input type="text" class="timeinput" name ="hour" maxlength="2" >' +
                    '<span class="separator">:</span>' +
                    '<input  type="text" class="timeinput" name="minute" maxlength="2" >' +
                    '<span class="separator">:</span>' +
                    '<input  type="text" class="timeinput" name="second" maxlength="2" >' +
                    '<div class="oa_time_btns">' +
                    '<input type="button" value="∧">' +
                    '<input type="button" value="∨">' +
                    '</div><span class="submit">确定</span></div>';
		obj.box.append(html);
		return obj.box.find('.oa_time_content');
	}


	// 事件绑定
	function bindEvents(obj){
        var box = obj.box,
            elem = obj.element,
            yearBtns = box.find('.oa_year_btns input'),
            monthBtns = box.find('.oa_month_btns input'),
            dateBtns = obj.dateElem,
            timeInput = box.find('.oa_time_content input.timeinput'),
            timeBtns = box.find('.oa_time_btns input[type=button]'),
            confirmBtn = box.find('.submit');

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
            obj.toDate(obj.year , obj.month , +target.innerHTML, obj.hour, obj.minute, obj.second);
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
            var value = util.stringToDate($(this).val(),'yyyyMMdd HH:mm:ss');
            if(!value){
                value =  new Date();
            }
            obj.toDate(value.getFullYear(),value.getMonth(),value.getDate(),value.getHours(),value.getMinutes(),value.getSeconds());
            obj.show();
            ev.stopPropagation();
            DomCalendar.hideExcept(obj.calendarId);
        });

        timeInput.on('click',function(){
            obj.focusTimePart = $(this).attr('name');
        });

        //上一刻按钮点击事件
        timeBtns.eq(0).click(function(){
            obj.pre(obj.focusTimePart);
        });

        //下一刻按钮点击事件
        timeBtns.eq(1).click(function(){
            obj.next(obj.focusTimePart);
        });

        //时刻输入框blur事件
        timeInput.on('blur',function(){
            var part = $(this).attr('name');
            obj[part] = $(this).val();
            obj.toDate(obj.year , obj.month , obj.date, obj.hour, obj.minute, obj.second);
        });

        //点击确认按钮
        confirmBtn.click(function(){
            var month = ('0' + (obj.month + 1) ).slice( -2),
                date = ('0'+obj.date).slice(-2),
                hour = ('0'+obj.hour).slice(-2),
                minute = ('0'+obj.minute).slice(-2),
                second = ('0'+obj.second).slice(-2);
            elem.val( obj.year  + month  + date + " " + hour + ":" + minute + ":"  + second);
            obj.hide();
        });
	}

	module.exports = TimeCalendar;

});