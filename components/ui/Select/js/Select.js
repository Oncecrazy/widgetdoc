define('select' , function(require , exports , module){

	var Base = require('base'),
        Event = require('Events'),
        $ = require('jquery');

    var defaults = {
        element : null, //下拉控件输入框对象
        selectElem : null, //下拉控件选项对象
        multi : false,   //是否多选
        options : []     //初始选项
    }
	// 构造函数
    var Select = Base.extend(Base,function(config){
        this.config = $.extend({},defaults,config);
        this.options = this.config.options;
        this.element = $(this.config.element);
        Select.instance.push(this);
    });

    Base.implement(Select, Event);

    //Select的实例对象
    Select.instance = [];


	Select.prototype.init = function(){
        this.initEvent();
		this.render();
	}

    Select.prototype.initEvent = function(){
    }

	Select.prototype.render = function(){
	}

    Select.prototype.show = function(){
        //关闭其他下拉框
        var selects = Select.instance;
        for(var i= 0,len = selects.length;i<len;i++){
            selects[i].hide();
        }
        this.render(); 
        $(this.config.selectElem).show();
    }

    Select.prototype.hide = function(){
        $(this.config.selectElem).hide();
    }

	/**
	 * 
	 * @param  {[type]} index   [插入位置]
	 * @param  {[type]} options [{value:'man',text:'男',selected:true},{value:'woman',text:'女'}]
	 * @return {[type]}         [description]
	 */
	Select.prototype.addOption = function(index, options){
        isArray(options) || (options = [options]) ;
        this.options = this.options.slice( 0 , index )
                    .concat( options )
                    .concat( this.options.slice( index ) );
        /*
        for(var i = options.length -1; i>=0; i--){
            this.options.splice(index,0,options[i]);
        }
        */
        this.render();
	}

	Select.prototype.removeOptionByIndex = function(indexs){
		var options = this.options;
        isArray(indexs) || (indexs = [indexs]);
		for(var i = 0, len = indexs.length; i < len ; i++){
			if(options[index[i]]){
				options.splice(index , 1);
			}
		}
		this.render();
	}

	Select.prototype.removeOptionByValue = function(values){
		var options = this.options;
        isArray(values) || (values = [values]);
		for(var i = 0, valuesLen = values.length; i < valuesLen; i++){
			for(var j = 0, optionsLen = options.length; j < optionsLen; j++){
				if(options[j].value === values[i]){
					options.splice(j , 1);
				}
			}
		}
		this.render();
	}

	Select.prototype.removeOptionByText = function(texts){
		var options = this.options;
        isArray(texts) || (texts = [texts]);
		for(var i = 0,textsLen = texts.length; i < textsLen; i++){
			for(var j = 0,optionsLen = options.length; j<optionsLen; j++){
				if(options[j].text === texts[i]){
					options.splice(j , 1);
				}
			}
		}
		this.render();
	}

	Select.prototype.setSelectedByIndex = function(indexs){
		/*var options = this.options,
            multi = this.config.multi;
        isArray(indexs) || (indexs = [indexs]);
        if(!multi){
            var index = indexs[0];
            for(var i = 0, len = options.length; i < len ; i++){
                if(i === index){
                    options[i].selected = true;
                }else{
                    options[i].selected = false;
                }
            }
        }else{
            for(var i = 0, len = indexs.length; i < len ; i++){
                if(options[indexs[i]]){
                    options[indexs[i]].selected = true;
                }
            }
        }
		this.render();*/
        changeStatus(this, indexs, 'index', 'select');
        this.render();
	}

	Select.prototype.setSelectedByValue = function(values){
        /*var options = this.options,
            multi = this.config.multi;
        isArray(values) || (values = [values]);
        if(!multi){
            var value = values[0];
            for(var i = 0, len = options.length; i < len; i++){
                if(options[i].value === value){
                    options[i].selected = true;
                }else{
                    options[i].selected = false;
                }
            }
        }else{
            for(var i = 0, valuesLen = values.length; i < valuesLen; i++){
                for(var j = 0, optionsLen = options.length; j < optionsLen; j++){
                    if(options[j].value === values[i]){
                        options[j].selected = true;
                    }
                }
            }
        }
		this.render();*/
        changeStatus(this, values, 'value', 'select');
        this.render();
	}

	Select.prototype.setSelectedByText = function(texts){
        changeStatus(this, texts, 'text', 'select');
        this.render();
	}

    Select.prototype.cancelSelectedbyIndex = function(indexs){
        changeStatus(this, indexs, 'index', 'cancel');
        this.render();
    }

    Select.prototype.cancelSelectedbyValue = function(values){
        changeStatus(this, values, 'value', 'cancel');
        this.render();
    }

    Select.prototype.cancelSelectedByText = function(texts){
        changeStatus(this, texts, 'text', 'cancel');
        this.render();
    }

	Select.prototype.getSelected = function(){
		var options = this.options,
			res = [];
		for(var i = 0,len = options.length; i<len; i++){
			if(options[i].selected){
				res.push({index:i,value:options[i].value,text:options[i].text});
			}
		}
        if(res.length === 0 && options.length !==0){
            res.push({index:0,value:options[0].value,text:options[0].text});
        }
		return res;
	}

    function changeStatus(obj, datas, type, state){
        var options = obj.options,
            multi = obj.config.multi;
        isArray(datas) || (datas = [datas]);
        if(!multi){
            singleHandler(options, datas, type, state);
        }else{
            multiHandler(options, datas, type, state);
        }
    }

    function singleHandler(options,datas,type,state){
        var data = datas[0],
            len = options.length;
        if(type ==='index'){
            if(state === 'select'){
                for(var i = 0;  i< len; i++){
                    i === data ? (options[i].selected = true) : (options[i].selected = false);
                }
            }else{
                options[data].selected = false;
            }
        }else{
            if(state === 'select'){
                for(var i = 0;  i< len; i++){
                    options[i][type] === data ? (options[i].selected = true) : (options[i].selected = false);
                }
            }else{
                for(var i = 0;  i< len; i++){
                    options[i][type] === data && (options[i].selected = false);
                }
            }

        }
    }

    function multiHandler(options,datas,type,state){
        for(var i = 0 , datasLen = datas.length; i < datasLen; i++){
            for(var j = 0,len = options.length; j < len; j++){
                if(type ==='index'){
                    if(i === data){
                        options[i].selected =  (state === 'select'? true : false);
                    }
                }else{
                    if(options[j][type] === datas[i]){
                        options[j].selected =  (state === 'select'? true : false);
                    }
                }
            }
        }
    }

	function isArray(v){
		return Object.prototype.toString.call(v) === '[object Array]';
	}

	module.exports = Select;

});