define('singleselect' , function(require , exports , module){

	var Base = require('base'),
        Select = require('select'),
        $ = require('jquery');


	// 构造函数
    var SingleSelect = Base.extend(Select,function(config){
        Select.call(this,config);
        this.config.multi = false;
        if(this.config.options && this.config.options.length>0){
            this.options = this.config.options;
        }else{
            this.loadInitOption();
        }
    });


    SingleSelect.prototype.initEvent = function(){
        var _this = this,
            selectElem = $(this.config.selectElem);
        this.element.on('click',function(evt){
            if(selectElem.is(":hidden")){
                _this.show();
            }else{
                _this.hide();
            }
            evt.stopPropagation();
        });
        selectElem.on('click','li',function(evt){
            var value = $(this).attr('value');
            _this.setSelectedByValue(value);
            _this.hide();
            _this.emit('select',_this.getSelected());
            evt.stopPropagation();
        });
        $(document).on('click',function(){
            _this.hide();
        });
    }

    SingleSelect.prototype.render = function(){
        var innerHtml = '<ul class="singleselect_options">',
            options = this.options,
            selectElem = $(this.config.selectElem),
            text = '';
        for(var i = 0,len = options.length; i < len;i++){
            if(options[i].selected){
                innerHtml += '<li class="singleselect_option" value="' + options[i].value +'" selected="true">'+ options[i].text +'</li>';
                text += options[i].text;
            }else{
                innerHtml += '<li class="singleselect_option" value="' + options[i].value +'">'+ options[i].text +'</li>';
            }
        }
        //默认选中第一个
        text = text ? text: (options[0] ? options[0].text : '');
        innerHtml += '</ul>';
        selectElem.html(innerHtml);
        this.element.html(text);
	}

    
    /**
     *  加载初始化options属性（如果创建对象的时候没有传options值，则会自动调用）
     */
    SingleSelect.prototype.loadInitOption = function(){
        var _this = this,
            value = '',
            text ='',
            selected = false;
        _this.options = [];
        $(_this.config.selectElem).find('li.singleselect_option').each(function(){
            value = $(this).attr('value');
            text = $(this).html();
            selected = $(this).attr('selected') || false;
            _this.options.push({value:value,text:text,selected:selected});
        });
    }

	module.exports = SingleSelect;

});