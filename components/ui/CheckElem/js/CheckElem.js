define('checkelem', function(require, exports, module) {

	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery'),
		CheckRule = require('checkrule');

	var defaults =	{
		elem: '',   					  //表单元素
		disable: false,                   //表单元素失效
		triggerType : 'blur',             //触发校验的事件, blur : 失去焦点时校验
		rules : null,                     //校验规则, 规则名（String）,自定义函数(Function)或者规则对象（Object）数组
		ruleset: require('checkruleset'), //校验规则集
		showError: null,       			  //展示错误信息   
		hideError: null 				  //隐藏错误信息
	}

	var CheckElem = module.exports = Base.extend(Base, function(option) {
		this.init(option);
	});

	Base.implement(CheckElem, Event);

	/* 表单元素初始化 */
	CheckElem.prototype.init = function(option) {
		var config = this.config = $.extend({}, defaults, option);
		this.elem = $(config.elem);
		this.disable = config.disable;

		/* 规则 */
		initAttr( this, 'rules' );

		/* 规则对应的错误提示 */
		initAttr( this, 'errMsgs' );

		/* 出错提示 */
		this.errMsg = null;

		/* 触发事件 */
		config.triggerType === 'formsubmit' && (config.triggerType = this.elem.attr('check-event') || 'formsubmit');
		config.triggerType = getTriggerType(this);

		/* 校验规则集 */
		config.ruleset = config.ruleset || require('checkruleset'); 

		initEvent(this);
	}

	/* 校验表单元素 */
	CheckElem.prototype.check = function(){
		var _this = this;
			data = $.trim(getElementValue(this.elem)),
			config = this.config,
			/*rules = config.rules,*/
			result = true;
		this.errMsg = null;

		//如果检查元素失效，直接返回
		if(this.disable){return true;}

		async.forEachSeries(config.rules,  function (item, idx, callback) {  // iterator
			var temp, flag = false;
			if( isType('String')(item) ){
				//规则名
				var rule = config.ruleset.get(item);
				temp = rule.check( data );

				!temp && (_this.errMsg = config.errMsgs[idx]);

				callback( !temp );
			}else if( isType('RegExp')(item) ){
				//正则表达式
				temp = item.test( data );

				!temp && ( _this.errMsg = config.errMsgs[idx] );

				callback( !temp );
			}else if( isType('Function')( item ) ){
				//自定义函数
				var flag = true;
				temp = item.call( this, data, function(res){
					flag = false;

					!res && (_this.errMsg = config.errMsgs[idx]);

					callback( !res );
				});
				//如果此自定义函数调用了回调方法，则不处理自定义函数的retun结果
				if(flag){
					!temp && (_this.errMsg = config.errMsgs[idx]);
					callback( !temp );
				}
			}else if(item.constructor === CheckRule){
				//规则对象
				callback( !item.check( data ) );
			}
		}, function (err) {  // complete callback
			result = !err;
			_this.emit( 'checkend', _this.errMsg );
		});

		return result;

		/*
		for(var i =0, len = rules.length; i<len; i++){
			if( isType('String')(rules[i]) ){
				//规则名
				var rule = config.ruleset.get(rules[i]);
				result = rule.check( data );
			}else if( isType('RegExp')(rules[i]) ){
				//正则表达式
				result = rules[i].test( data );
			}else if( isType('Function')(rules[i]) ){
				//自定义函数
				if(rules[i].call( this, data, callback) !== undefined){
					result = !! rules[i].call( this, data );
				}else{
					//返回undefined时，为异步回调
					rules[i].call( this, data, function(res){
						result = res;
					});
				}
			}else if(rules[i].constructor === CheckRule){
				//规则对象
				result = rules[i].check( data );
			}
			if(!result){
				this.errMsg = this.config.errMsgs[i]; 
				break;
			} 
		}
		this.emit( 'checkend', this.errMsg );
		return result;
		*/	
	}

	/* 添加校验规则 */
	CheckElem.prototype.add = function(rules, errMsg) {
		!isType('Array')(rules) && (rules = [rules]);
		for(var i=0,len=rules.length; i<len; i++){
			if($.inArray(rules[i], this.config.rules)<0){
				this.config.rules.push(rules[i]);
			}
		}
		return this;
	}

	/* 删除校验规则 */
	CheckElem.prototype.remove = function(rules) {	
		var index;
		if(!rules){
			this.config.rules = [];
			return this;
		}
		if(!isType('Array')(rules)){
			rules = [rules];
		}
		for(var i=0,len=rules.length; i<len; i++){
			if((index = $.inArray(rules[i], this.config.rules))<0){
				this.config.rules.splice( index, 1 );
			}
		}
		return this;
	}

	/* 注销表单元素组件 */
	CheckElem.prototype.destory = function(){

		/* 销毁check命名空间的事件 */
		this.elem.off(obj.triggerType +'.check');

		/* 调用父类的destory方法 */
		this.superclass.prototype.destory.call(this);

	}

	function initEvent(obj){
		obj.elem.on(obj.config.triggerType +'.check', function(){
			obj.check();
		});
		obj.elem.on( 'focus .check' , function(){
			obj.emit('clear');
		});
		obj.on('clear', function(){
			var hideError = obj.config.hideError;
			hideError && hideError(obj.elem);
		});
		obj.on('checkend', function(errMsg){
			obj.emit('clear');
			if(!errMsg){ return; }
			var showError = obj.config.showError;
			showError && showError(obj.elem, errMsg);
		});
	}

	function initAttr(obj, attr){
		var tagAttr = attr === 'rules' ? 'check-rule' : 'check-msg';
		if(!obj.config[attr]){
			obj.config[attr] = obj.elem.attr(tagAttr)? 
								   obj.elem.attr(tagAttr).split(/\s+/) : [];
		}else{
			!isType('Array')(obj.config[attr]) && (obj.config[attr] = [obj.config[attr]]);
		}
	}

	function getTriggerType(obj){
		var triggerType = obj.config.triggerType
	        type = obj.elem.attr('type');
	    // 将 select, radio, checkbox 的 blur 和 key 事件转成 change
	    var special = obj.elem.is("select") || type == 'radio' || type == 'checkbox';
	    if (special && (triggerType.indexOf('blur') > -1 || triggerType.indexOf('key') > -1)){
	    	return 'change'
	    }else{
	    	return triggerType;
	    }
	}

	function getElementValue(elem){
		var type = elem.attr('type'),
			value = '';
		//分别获取 radio, checkbox的值
	    if( type == 'radio' ){
	    	value = elem.filter(':checked').val();
	    }else if( type == 'checkbox' ){
	    	elem.filter(':checked').each(function(){
	    		value += $(this).val() + ',';
	    	});
	    	value = value.substring(0,value.length-1);
	    }else{
	    	value = elem.val();
	    }
	    return value;
	}

	function isType(type) {
	  	return function(obj) {
	    	return Object.prototype.toString.call(obj) == "[object " + type + "]"
	  	}
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