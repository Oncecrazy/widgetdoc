;(function($){
	$.fn.placeholder = function(config){
		var settings = $.extend({},$.fn.placeholder.defaults,config);
		return this.each(function(){
			var $_this = $(this),
				$tip = typeof settings.tip !=='object'? $_this.siblings(settings.tip): settings.tip;
			handler($_this,$tip,settings);
			$_this.on("input propertychange",function(){
				$tip.hide();
			}).on("blur",function(){
				handler($_this,$tip,settings);
			});
			$tip.on("click",function(){
				$_this.focus();
			});
		});
		function handler($input,$tip,settings){
			$input.val()==="" ? $tip.show():$tip.hide();
		}
	}
	$.fn.placeholder.defaults = {
		tip: "span" //占位控件
	};

	$.fn.numCharLeft = function(config){
		var settings = $.extend({},$.fn.numCharLeft.defaults,config),
			getLengthFun = settings.getLengthFun;
		return this.each(function(){
			var $_this = $(this),
				$limit = typeof settings.limit !=='object'? $_this.siblings(settings.limit): settings.limit;	
			handler($_this,$limit,settings);
			$_this.on("input propertychange",function(){
				handler($_this,$limit,settings);
			});	
		});
		function handler($input,$limit,settings){
			var len = getLength($input.val(),getLengthFun);
			if(len>settings.maxLen){
				$input.val($input.val().substr(0,settings.maxLen));
				$limit.html(settings.overMaxTip); 
			}else{
				$limit.html(settings.lessMaxTip.replace("{0}",settings.maxLen - len));	
			}
		}
	}
	$.fn.numCharLeft.defaults = {
		limit: "span",     							//字数限制控件
		maxLen: "100",     							//可输入最大长度
		lessMaxTip: "还可以输入 <em>{0}</em> 字",   //未超过最大长度时的提示
		overMaxTip: "已达到最大字数限制",  		    //超过最大长度时的提示
		getLengthFun: null 						    //计算字符长度的函数
	};
	function getLength(text,callback){
		if(callback){
			return callback.call(null,text);
		}else{
			return text.length;
		}
	}
})(jQuery);