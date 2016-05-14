define('checkruleset', function(require, exports, module) {

	var checkruleset = {
		rule : {
		        required : /\S+/,           		//非空
		        number : /^-?\d+(\.\d+)?$/,         //数字(负数，小数)
		        integer : /^-?[1-9]\d*$|0/,         //整数
		        psd : /^[^\s]{6,16}$/,      		//密码
		        email : /^[A-Z_a-z0-9-\.]+@([A-Z_a-z0-9-]+\.)+[a-z0-9A-Z]{2,4}$/,   //邮箱
		        url : /^(http:|ftp:|https)\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"])*$/,   //url地址
		        tel : /^((\(\d{2,3}\))|(\d{3}\-))?((1[345]\d{9})|(18\d{9}))$/,  //电话，包括手机座机
		        mobile : /^1[3458]\d{9}&/, //手机
		        money : /^\d{1,9}(\.\d{1,2})?$/, //金额
		        qq : /^[1-9]\d{4,10}$/,    //QQ
		        //ip地址
		        ip : /^(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5]).(0|[1-9]\d?|[0-1]\d{2}|2[0-4]\d|25[0-5])$/,
		        //身份证验证
				idcard : function (id , isadult){  //第一个参数为身份证号，第二个参数为是否成年判断
				  id = ('' + id).replace(/(^\s*)|(\s*$)/g , '');  //转成字符串
				  if(!/^\d*$/.test((id).substr(0 , 17)) || id.length !== 18){   //检查前17位是否为数字 || 身份长度是否为18位
				    return false;
				  }
				  var addr = id.substr(0 , 6);    //地址码
				  var time = Number(id.substr(6 , 8));    //出生日期
				  var date = new Date();
				  var now = Number(date.getFullYear() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2));  //当前日期数字
				  var adult = true;       
				  if(isadult){  //是否成年
				    adult = Number(id.substr(6 , 4)) < Number(date.getFullYear() - 18);
				  }
				  if( time > now || time < 18500101 || !adult){ // (time < 18500101)妖怪?,(time > now)从未来穿越来的?
				    return false;
				  }
				  var checkNum = [7 , 9 , 10 , 5 , 8 , 4 , 2 , 1 , 6 , 3 , 7 , 9 , 10 , 5 , 8 , 4 , 2]; //身份证前17位系数
				  var modRes = [1 , 0 , 'X' , 9 , 8 , 7 , 6 , 5 , 4 , 3 , 2];       //取余结果对应数组
				  var sum = 0;
				  for(var i=0;i<id.length - 1;i++){
				    sum += Number(id[i]) * checkNum[i];
				  }
				  if(('' + modRes[sum % 11]).toUpperCase() == id.slice( -1 )){    //与身份证最后一位校验码做对比
				    return true;
				  }
				  return false;
				}
		},
		add : function( name, rule, msg ){
			this.rule[ name ] = rule;
			return this;
		},
		get : function(name){
			var CheckRule = require('checkrule'),
			    rule = this.rule[ name ];
			if(!rule){
				throw 'The rule "' + name + '" doesn\'t exists';
			}
			return new CheckRule( name, rule );
		}
	}

	module.exports = checkruleset;

});