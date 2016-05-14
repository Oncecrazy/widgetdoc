define('multiselect' , function(require , exports , module){

	var Base = require('base'),
        Select = require('select'),
        $ = require('jquery');

	// 构造函数
    var MulitSelect = Base.extend(Select,function(config){
        Select.call(this,config);
        this.config.multi = true;
        if(this.config.options && this.config.options.length>0){
            this.options = this.config.options;
        }else{
            this.loadInitOption();
        }
    });

    MulitSelect.prototype.initEvent = function(){
        var _this = this,
            selectedArr = [],
            cancelSelectedArr = [];
        bindElementEvent(this);
        bindSelectElemEvent(this);
        $(document).on('click',function(){
            _this.hide();
        });
    }

    MulitSelect.prototype.render = function(){
        var innerHtml = '<table><tr>',
            options = this.options,
            selectElem = $(this.config.selectElem),
            text = '';
        for(var i = 0,count = 0,len = options.length; i < len; i++,count++){
            if(count === 0){
                innerHtml += '<td><ul class="multiselect_options">';
            }
            if(options[i].selected){
                innerHtml += '<li class="multiselect_option" value="' + options[i].value + '" selected="true"><input name="line" type="checkbox" value="" checked="true"/>'+ options[i].text +'</li>';
                text += options[i].text + " ";
            }else{
                innerHtml += '<li class="multiselect_option" value="' + options[i].value +'"><input name="line" type="checkbox" value="" />'+ options[i].text +'</li>';
            }
            if(count === 9){
                innerHtml += '</ul></td>';
                count = -1;
            }
        }
        var leftOption =  this.options.length -  this.getSelected().length;
        innerHtml += '<td><div class="multiselect_action"><input type="button" value="确定" class="multiselect_button">' +
                        '<div class="multiselect_leftoption">还可以选中'+ leftOption +'项</div></div></td>';
        innerHtml += '</tr></table>';
        selectElem.html(innerHtml);
        text = text ? text: (options[0] ? options[0].text : '');
        this.element.html(text);
	}

    /**
     *  加载初始化options属性（如果创建对象的时候没有传options值，则会自动调用）
     */
    MulitSelect.prototype.loadInitOption = function(){
        var _this = this,
            value = '',
            text ='',
            selected = false;
        _this.options = [];
        $(_this.config.selectElem).find('li.multiselect_option').each(function(){
            value = $(this).attr('value');
            text = $(this).text();
            selected = $(this).attr('selected') || false;
            _this.options.push({value:value,text:text,selected:selected});
        });
    }

    function bindElementEvent(obj){
        var selectElem = $(obj.config.selectElem);
        obj.element.on('click',function(evt){
            selectedArr = [];
            cancelSelectedArr = [];
            if(selectElem.is(":hidden")){
                obj.show();
            }else{
                obj.hide();
            }
            evt.stopPropagation();
        });
    }

    function bindSelectElemEvent(obj){
        var selectElem = $(obj.config.selectElem),
            leftOption = obj.options.length,
            util = require('util');
        selectElem.on('click','li',function(evt){
            evt.stopPropagation();
        }).on('click','li > input[type=checkbox]',function(evt){
            var value = $(this).parent().attr('value');
            if($(this).prop('checked')){
                selectedArr.push(value);
            }else{
                cancelSelectedArr.push(value);
            }
            leftOption = obj.options.length - obj.getSelected().length - selectedArr.length + cancelSelectedArr.length;
            $('div.multiselect_leftoption').html('你还可以选择' + leftOption +'项');
            evt.stopPropagation();
        }).on('click','input.multiselect_button',function(evt){
            obj.setSelectedByValue(selectedArr);
            obj.cancelSelectedbyValue(cancelSelectedArr);
            obj.hide();
            evt.stopPropagation();
            obj.emit('select',obj.getSelected());
        });
    }

	module.exports = MulitSelect;

});