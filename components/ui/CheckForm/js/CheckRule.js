define(function(require, exports, module) {
	var Base = require('Base');

	var CheckRule = module.exports = Base.extend(Base, function(name, oper, param) {
		this.init(name, oper, param);
	});

	CheckRule.prototype.init = function(name, oper, param){
		this.name = name;
		if(isType('RegExp')(oper)){
			this.operator = function(value, element, callback){
				callback(!(name !== "required" && value === "" || oper.test(value)));
			}
		}else{
			this.operator = function(value, element, callback){
				var temp;
				if(value === ""){
					callback(null);
					return;
				}
				temp = oper.call(null, value, element, param, callback);
				if(temp !== undefined){
					callback(!temp);
				}
			};
		}
	}

	CheckRule.prototype.check = function(value, element, callback){
		var operator = this.operator;
		operator.call(this, value, element, callback);
	}

	CheckRule.prototype.and = function(rule, newName){
		var self = this;
		if(rule.constructor !== CheckRule){return this;}
		return new CheckRule(newName, function(value, element, param, callback){
				_andOper(value, element, self.operator, function(){
					_andOper(value, element, rule.operator, function(){
						callback(null);
					}, callback)
				}, callback)
			}
		);
	}

	CheckRule.prototype.or = function(rule, newName){
		var self = this;
		if(rule.constructor !== CheckRule){return this;}
		return new CheckRule(newName, function(value, element, param, callback){
				_orOper(value, element, self.operator, function(){
					_orOper(value, element, rule.operator, function(){
						callback(true);
					}, callback)
				}, callback)
			}
		);
	}

	CheckRule.prototype.not = function(newName){
		var self = this;
		return new CheckRule( newName, function(data, callback){
				var temp = self.operator(data, function(err){
					callback(!err);
				});
				//如果operator不调用回调函数，则依据返回值，判断校验结果。
				if(temp !== undefined){
					callback(!temp);
				}
			}
		);
	}

	function isType(type) {
	  	return function(obj) {
	    	return Object.prototype.toString.call(obj) == "[object " + type + "]"
	  	}
	}

	function _andOper(data, element, oper, success, fail){
		var temp = oper(data, element, function(err){
				if(err){
					fail(err);
					return;
				}
				success();
			});
		if(temp !== undefined){
			if(!temp){
				fail(!temp);
				return;
			}
			success();
		}
	}

	function _orOper(data, element, oper, success, fail){
		var temp = oper(data, element, function(err){
				if(!err){
					fail(null);
					return;
				}
				success();
			});
		if(temp !== undefined){
			if(temp){
				fail(null);
				return;
			}
			success();
		}
	}
});