define('checkrule', function(require, exports, module) {
	var Base = require('Base');

	var CheckRule = module.exports = Base.extend(Base, function(name, rule) {
		this.init(name, rule);
	});

	CheckRule.prototype.init = function( name, rule){
		this.name = name;
		this.rules = [{rule: rule, oper: 'and'}];
	}

	CheckRule.prototype.check = function( data ){
		var rules = this.rules;
		var result = subResult = true;
		for(var i=0,len= rules.length; i<len; i++){
			subResult = typeof rules[i].rule === 'function' ? rules[i].rule( data ) : rules[i].rule.test( data );
			if(rules[i].oper === 'and'){
				result = result && subResult;
			}else if(rules[i].oper === 'or'){
				result = result || subResult;
			}else if(rules[i].oper === 'not'){
				result = result && !subResult;
			}	
		}
		return result; 
	}

	CheckRule.prototype.and = function(rule, newName){
		if(rule.constructor !== CheckRule){return this;}
		this.rules.push({rule:rule.rules.rule, oper: 'and'});
		newName && (this.name = newName);
		return this;
	}

	CheckRule.prototype.or = function(rule, newName){
		if(rule.constructor !== CheckRule){return this;}
		this.rules.push({rule:rule.rules.rule, oper: 'or'});
		newName && (this.name = newName);
		return this;
	}

	CheckRule.prototype.not = function(rule, newName){
		if(rule.constructor !== CheckRule){return this;}
		this.rules.push({rule:rule.rules.rule, oper: 'not'});
		newName && (this.name = newName);
		return this;
	}

});