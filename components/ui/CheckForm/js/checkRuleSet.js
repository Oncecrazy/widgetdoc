define(function(require, exports, module) {
	var CheckRule = require('CheckRule');
	var checkRuleSet = module.exports = {
		rule : {
		        required : /\S+/,           		//非空
		        number : /^-?\d+(\.\d+)?$/,         //数字(负数，小数)
		        integer : /^-?[1-9]\d*$|0/,         //整数
		        letter: /^[A-Z_a-z]+$/,             //字母
		        pwd : /^[^\s]{6,16}$/,      		//6到16位密码
		        email : /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/,   //邮箱
		        url : /^(http:|ftp:|https)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/,   //url地址
		        tel : /^(\(\d{2,3}\))?\d{3,4}-\d{7,8}|1[3,4,5,7,8]\d{9}$/, //电话，包括手机座机
		        mobile : /^1[34578]\d{9}$/, //手机
		        money : /^\d{1,9}(\.\d{1,2})?$/, //金额
		        qq : /^[1-9]\d{4,10}$/,    //QQ
		        //ip地址
		        ip : /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/,
		        //身份证验证
				idcard : idcard,
				equalTo: equalTo,
				minlen: minlen,
				maxlen: maxlen,
				rangelen: rangelen,
				min: min,
				max: max,
				range: range
		},
		add : function(name, oper){
			if(!name){return this;}
			if(name.constructor == CheckRule){
				this.rule[name.name] = name;
			}else{
				this.rule[ name ] = oper;
			}
			return this;
		},
		get : function(name){
			var data;
			if(!name){return null;}
			name = name.replace(/(^\s*)|(\s*$)/g, "");
		    data = parse(this, name);
			if(!data.oper){
				throw 'The rule "' + data.name + '" doesn\'t exists';
			}else if(data.oper.constructor == CheckRule){
				return data.oper;
			}else{
				return new CheckRule(name, data.oper, data.param);
			}
		}
	}
	
	function parse( obj, name ){
		var exp = name.split(":");
		return {
			name: exp[0],
			oper: obj.rule[exp[0]],
			param: exp[1]?exp[1].split(","):[]
		}
	}

	function idcard( value, element, param ){ //第一个参数为身份证号，第二个参数为是否成年判断
		if(!/^\d*$/.test((value).substr(0 , 17)) || value.length !== 18){
			//检查前17位是否为数字 || 身份长度是否为18位 
			return false;
		}
		var addr = value.substr(0 , 6);    //地址码
		var time = Number(value.substr(6 , 8));    //出生日期
		var date = new Date();
		var now = Number(date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2));  //当前日期数字
		var adult = true;       
		if(param[0]){  
			//是否成年
			adult = Number(value.substr(6 , 4)) < Number(date.getFullYear() - 18);
		}
		if( time > now || time < 18500101 || !adult){ 
			// (time < 18500101)妖怪?,(time > now)从未来穿越来的?
			return false;
		}
		//身份证前17位系数
		var checkNum = [7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2];
		//取余结果对应数组
		var modRes = [1 , 0 , 'X' , 9 , 8 , 7 , 6 , 5 , 4 , 3 , 2];      
		var sum = 0;
		for(var i=0;i<value.length - 1;i++){
			sum += Number(value[i]) * checkNum[i];
		}
		if(('' + modRes[sum % 11]).toUpperCase() == value.slice( -1 )){    //与身份证最后一位校验码做对比
			return true;
		}
		return false;
	}

	function equalTo( value, element, param ) {
		return value === $( param[0] ).val();
	}

	function minlen( value, element, param ) {
		if(value && value.nodeType==1){
			value = value.value;
		}else{
			value = ('' + value).replace(/(^\s*)|(\s*$)/g , '');  	
		}
		var length = $.isArray( value ) ? value.length : getLength( value, element );
		return length >= +param[0];
	}

	function maxlen( value, element, param ) {
		var length = $.isArray( value ) ? value.length : getLength( value, element );
		return length <= +param[0];
	}

	function rangelen( value, element, param ) {
		var length = $.isArray( value ) ? value.length : getLength( value, element );
		return  length >= +param[ 0 ] && length <= +param[ 1 ] ;
	}

	function min( value, param ) {
		return value >= +param[0];
	}

	function max( value, param ) {
		return value <= +param[0];
	}

	function range( value, param ) {
		return value >= +param[ 0 ] && value <= +param[ 1 ];
	}


	function getLength( value, element ) {
		switch ( element[0].nodeName.toLowerCase() ) {
		case "select":
			return $( "option:selected", element ).length;
		case "input":
			if (( /radio|checkbox/i ).test( element[0].type )) {
				return element.filter( ":checked" ).length;
			}
		}
		return value.length;
	}
});