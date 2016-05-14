define(function(require, exports, module) {

	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery'),
		CheckRule = require('CheckRule');

	var defaults =	{
		elem: '',   					  //表单元素
		disable: false,                   //表单元素失效
		triggerType : 'blur',             //触发校验的事件, blur : 失去焦点时校验
		rule : null,                      //校验规则, 规则名（String）,自定义函数(Function)或者规则对象（Object）数组
		skipHidden: true,          		  //如果 DOM 隐藏是否进行校验
		ruleset: require('checkRuleSet'), //校验规则集
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

		/* 出错提示 */
		this.msg = null;

		/* 规则 */
		initAttr( this, 'rule' );

		/* 规则对应的错误提示 */
		initAttr( this, 'msg' );

		/* 触发事件 */
		if(config.triggerType === 'formsubmit'){
			config.triggerType = this.elem.attr('check-event') || 'formsubmit'
		}else{
			config.triggerType = getTriggerType(this);
		}

		/* 校验规则集 */
		config.ruleset = config.ruleset || require('checkRuleSet'); 

		initEvent(this);
	}

	/* 校验表单元素 */
	CheckElem.prototype.check = function(callback){
		var self = this;
			value = $.trim(getElementValue(this.elem)),
			config = this.config;

		this.msg = null

		//如果检查元素失效或者隐藏，直接返回
		if(config.disable || config.skipHidden && this.elem.css("display") == "none"){
			callback && callback(null);
			return this;
		}

		async.forEachSeries(config.rule,  function (item, idx, callback) {  // iterator
			var temp;
			if( isType('String')(item) || item.constructor === CheckRule ){
				//规则名 或者 规则对象
				var rule = isType('String')(item)?config.ruleset.get(item):item;
				rule.check(value, self.elem, function(err){
					if(err){
						self.msg = config.msg[idx];
					}
					callback( err );
				});
			}else if( isType('RegExp')(item) ){
				//正则表达式
				temp = value === "" || item.test( value );
				!temp && ( self.msg = config.msg[idx] );
				callback( !temp );
			}else if( isType('Function')( item ) ){
				//自定义函数
				if(value === ""){
					callback(null);
					return;
				}
				temp = item.call( self, value, self.elem, function(res){
					!res && ( self.msg = config.msg[idx] );
					callback( !res );
				});
				//如果此自定义函数不调用回调函数，则依据返回值，判断校验结果。
				if(temp == false){
					self.msg = config.msg[idx];
					callback( !temp );
				}
			}else{
				callback();
			}
		}, function (err) {  // complete callback
			self.emit( 'checkend', self.msg );
			callback && callback( err )
		});

		return this;
	}

	/* 添加校验规则 */
	CheckElem.prototype.add = function(rule, msg) {
		!isType('Array')(rule) && (rule = [rule]);
		!isType('Array')(msg) && (msg = [msg]);
		for(var i=0,len=rule.length; i<len; i++){
			if($.inArray(rule[i], this.config.rule)<0){
				this.config.rule.push(rule[i]);
				this.config.msg.push(msg[i] || '');
			}
		}
		return this;
	}

	/* 删除校验规则 */
	CheckElem.prototype.remove = function(rule) {	
		var index;
		if(!rule){
			this.config.rule = [];
			this.config.msg = [];
			return this;
		}
		if(!isType('Array')(rule)){
			rule = [rule];
		}
		for(var i=0,len=rules.length; i<len; i++){
			if((index = $.inArray(rule[i], this.config.rule))<0){
				this.config.rule.splice( index, 1 );
				this.config.msg.splice( index, 1 );
			}
		}
		return this;
	}

	CheckElem.prototype.disable = function(){
		this.config.disable = true;
		return this;
	}

	CheckElem.prototype.enable = function(){
		this.config.disable = false;
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
		obj.on('checkend', function(msg){
			obj.emit('clear');
			if(!msg){ return; }
			var showError = obj.config.showError;
			showError && showError(obj.elem, msg);
		});
	}

	function initAttr(obj, attr){
		var tagAttr = attr === 'rule' ? 'check-rule' : 'check-msg';
		if(!obj.config[attr]){
			obj.config[attr] = obj.elem.attr(tagAttr)? 
								   obj.elem.attr(tagAttr).replace(/(^\s*)|(\s*$)/g, "").split(/\s+/) : [];
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