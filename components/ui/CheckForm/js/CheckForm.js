/*
(1)require                 必填
(3)email                 输入正确格式的电子邮件
    ip                     IP
	url                    输入正确格式的url地址
qq                         输入QQ

(7)number                 输入合法的数字(负数，小数)
(8)integer                 输入整数
letter  				   输入英文

 tel                    电话，包括手机、座机
 mobile                 手机
 idcard:true             身份证(true:检验成年,false:检验未成年，默认不校验是否成年)
   
(10)equalTo:"#password"        输入值必须和#password相同

(12)maxlen:5                输入长度最多是5的字符串(汉字算一个字符)
(13)minlen:10               输入长度最小是10的字符串(汉字算一个字符)
rangelen:[5,10]

(16)max:5                      输入值不能大于5
(17)min:10                     输入值不能小于10
range:[5,10]
*/



define(function(require, exports, module) {

	var Base = require('Base'),
	    Event = require('Events'),
		$ = require('jquery'),
		CheckElem = require('CheckElem');

	var defaults = {
		form: '',       		 	      //表单
		triggerType : 'formsubmit',       //触发校验的事件, 默认formsubmit : 提交表单时校验
		checkbreak: false,                //遇错中断校验
		skipHidden: true,          		  //如果 DOM 隐藏是否进行校验
		sort: true,						  //是否按照DOM顺序进行校验
		ruleset: require('checkRuleSet'), //校验规则集
		showError: null,       			  //展示错误信息   
		hideError: null 				  //隐藏错误信息
	}

	var CheckForm = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	Base.implement(CheckForm, Event);

	/* 表单初始化 */
	CheckForm.prototype.init = function(option) {
		var config = this.config = $.extend({}, defaults, option);
		this.form = $(config.form);
		this.checkElems = [];
		initElem(this);
		initEvent(this);
	}

	/* 校验表单 */
	CheckForm.prototype.check = function(callback) {
		var self = this,
			errors = [],
			func = this.config.checkbreak ? "forEachSeries" : "forEach",
			sortedElems = [];
		sortedElems = this.config.sort? $.unique(_map(this.checkElems)):
							_map(this.checkElems);
		async[func](sortedElems, function(item, idx, callback){  // iterator
			var checkElem = self.get(item)[0];
			checkElem.check(function( err ){
				if(err){
					errors.push({
						elem : checkElem.elem,
					 	msg : checkElem.msg
					});
				}
				callback( err );
			});
		},function( err ){ // complete callback
			self.emit( 'checkend', errors );
			callback(err);
		});
		
		return this;
	}

	/* 添加校验元素 */
	CheckForm.prototype.add = function(option) {
		var checkElems = this.checkElems,
			config = this.config,
			checkElem = null;
		if(!option || !option.elem || !option.elem.length){return this;}
		for(var i=0,len = checkElems.length; i<len; i++){
			if($(option.elem)[0] === checkElems[i].elem[0]){
				checkElems[i].add( option.rule, option.msg );
				return this;
			}
		}
		checkElem = new CheckElem({
			elem: option.elem,   
			rule: option.rule,
			msg: option.msg,   					 
			triggerType: option.triggerType || config.triggerType, 
			skipHidden: config.skipHidden,                          
			ruleset: config.ruleset,
			showError: option.showError || config.showError,
			hideError: option.hideError || config.hideError 
		});
		checkElems.push(checkElem);
		return this;
	}

	/* 移除校验元素 */
	CheckForm.prototype.remove = function(elems) {
		var checkElems = this.checkElems,
		    index = -1;
		if(!elems){
			for(var i=0,len = checkElems.length; i<len; i++){
				checkElems.destroy();
				checkElems = [];
			}
			return this;
		}

		if(Object.prototype.toString.call(elems)!= '[object Array]'){
			elems = [elems];
		}

		for(var i=0, len= elems.length; i<len; i++){
			for(var j=0,slen = checkElems.length; j<slen; j++){
				$(elems[i])[0] === checkElems[j].elem[0] && (index = j);
			}
			if(index!==-1){
				checkElems[index].destroy();
				checkElems.splice( index , 1 );
			}
		}

		return this;
	}

	/* 获取检验元素 */
	CheckForm.prototype.get = function(elem){
		var checkElems = [];
		if(!elem){
			checkElems = this.checkElems;
		}
		for(var i=0,len = this.checkElems.length; i<len; i++){
			if($(elem)[0] === this.checkElems[i].elem[0]){
				checkElems.push(this.checkElems[i]);
			}
		}
		return checkElems;
	}

	/* 注销表单组件 */
	CheckForm.prototype.destory = function(){
		/* 销毁check命名空间的事件 */
		this.remove();

		/* 调用父类的destory方法 */
		this.superclass.prototype.destory.call(this);
	}	

	function initElem(obj){
		obj.form.find( '[check-rule]' ).each(function(){
			obj.add( {elem: $(this)} );
		});
	}

	function initEvent(obj){
		obj.form.on( 'submit.check' , function( evt ){
			evt.preventDefault();
			obj.check(function(err){
				if(err){return;}
				if(obj.events['submit']){
					obj.emit( 'submit' );
				}else{
					obj.form.get(0).submit();
				}
			});
		}).on('reset', function(){
			var checkElems = obj.checkElems;
			for(var i = 0, len = checkElems.length; i < len; i++){
				checkElems[i].emit( 'clear' );
			}
		});
	}


	function _map(checkElems){
		var arr = [];
		for(var i=0,len=checkElems.length; i<len; i++){
		     arr[arr.length] = checkElems[i].elem[0];
		}
		return arr;
	}
	
	var async = {};

	function _forEach(arr, iterator) {
	  if (arr.forEach) {
	    return arr.forEach(iterator);
	  }
	  for (var i = 0; i < arr.length; i += 1) {
	    iterator(arr[i], i, arr);
	  }
	};

	async.forEach = function (arr, iterator, callback) {
	  callback = callback || function () {
	  };
	  if (!arr.length) {
	    return callback();
	  }
	  var completed = 0;
	  _forEach(arr, function (item, idx) {
	    iterator(item, idx, function (err) {
	      if (err) {
	        callback(err);
	        callback = function () {
	        };
	      }
	      else {
	        completed += 1;
	        if (completed === arr.length) {
	          callback(null);
	        }
	      }
	    });
	  });
	};

	async.forEachSeries = function (arr, iterator, callback) {
	  callback = callback || function () {
	  };
	  if (!arr.length) {
	    return callback();
	  }
	  var completed = 0;
	  var iterate = function () {
	    iterator(arr[completed], completed, function (err) {
	      if (err) {
	        callback(err);
	        callback = function () {
	        };
	      }
	      else {
	        completed += 1;
	        if (completed === arr.length) {
	          callback(null);
	        }
	        else {
	          iterate();
	        }
	      }
	    });
	  };
	  iterate();
	};
	
});