
//TAB切换
;(function($) {
    var defaults = {
        target: 'li',
        togClass: 'on',
        togDiv: '',
        togDivClass: '', //Div样式变化
        btnEvent: 'mouseover', //触发事件
        showType: 'normal',  //展示风格
        prevBtn: '',   //上一个按钮
        nextBtn: ''    //下一个按钮
    };
    $.fn.SwitchTab = function(settings) {
        var settings = $.fn.extend({}, defaults, settings);
        return this.each(function() {
            var self = $(this),
                target = self.find(settings.target),
                togDiv = self.find(settings.togDiv),
                prevBtn = self.find(settings.prevBtn),
                nextBtn = self.find(settings.nextBtn);
            target.on(settings.btnEvent, function() {
                var idx = target.index(this);
                render(target,idx,togDiv,settings);
            });
            prevBtn.on('click',function(){
                var idx = target.index(target.filter('.'+settings.togClass)),
                    len =target.length;
                idx = idx - 1 < 0 ? len -1 : idx - 1;
                render(target,idx,togDiv,settings);
            });
            nextBtn.on('click',function(){
                var idx = target.index(target.filter('.'+settings.togClass)),
                    len =target.length;
                idx = (idx + 1)%len;
                render(target,idx,togDiv,settings);
            });
        });
    };

    function render(target,selectIdx,togDiv,settings){
        //$(this).addClass(settings.togClass).siblings().removeClass(settings.togClass);
        settings.togClass && domSwitch(target,selectIdx,function(){
            this.addClass(settings.togClass);
        },function(){
            this.removeClass(settings.togClass);
        });
        /*if (settings.togDivClass) {
            togDiv.removeClass(settings.togDivClass).eq(idx).addClass(settings.togDivClass);
        }*/
        settings.togDivClass && domSwitch(togDiv,selectIdx,function(){
            this.addClass(settings.togDivClass);
        },function(){
            this.removeClass(settings.togDivClass);
        });
        showTab(togDiv,selectIdx,settings.showType);
    }

    function showTab(container,selectIdx,showType){
        if(typeof showType ==="function"){
            showType.call(container,selectIdx);
        }else if(showType ==="normal"){
            //container.hide().eq(selectIdx).show();
            domSwitch(container,selectIdx,function(){
                    this.show();
                },function(){
                    this.hide();
            });
        }else if(showType ==="fade"){
            //container.fadeOut().eq(selectIdx).fadeIn();
            domSwitch(container,selectIdx,function(){
                    this.fadeIn();
                },function(){
                    this.fadeOut();
            });
        }else if(showType ==="slide"){
            //container.slideUp().eq(selectIdx).slideDown();
            domSwitch(container,selectIdx,function(){
                    this.slideDown();
                },function(){
                    this.slideUp();
            });
        }
    }

    function domSwitch(container,selectIdx,selfCallback,siblingsCallback){
        var self = container.eq(selectIdx),
            siblings = [];
        container.each(function(i){
            if(i != selectIdx){
                siblings.push(this);
            }  
        });
        selfCallback && selfCallback.call(self);
        siblingsCallback && siblingsCallback.call($(siblings));
    }

})(jQuery);