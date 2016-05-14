define('cascadeselect' , function(require , exports , module){

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
    var CascadeSelect = Base.extend(Base,function(config){
        this.config = $.extend({},defaults,config);
        this.element = $(this.config.element);
        if(this.config.options && this.config.options.length>0){
            this.options = this.config.options;
        }else{
            this.loadInitOption();
        }
        CascadeSelect.instance.push(this);
    });

    Base.implement(CascadeSelect, Event);

    //CascadeSelect 所有实例
    CascadeSelect.instance = [];

    CascadeSelect.prototype.init = function(){
        this.initEvent();
        this.render();
    }


    CascadeSelect.prototype.initEvent = function(){
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
            var value = $(this).attr('value'),
                son = $(this).children('ul.cascadeselect_son_options');
            if(!son.length){
                _this.setSelectedByValue(value);
                _this.hide();
                _this.emit('select',_this.getSelected());
            }
            evt.stopPropagation();
        });
        $(document).on('click',function(){
            _this.hide();
        });
    }

    CascadeSelect.prototype.render = function(){
        var innerHtml = '',
            text = '',
            options = this.options,
            selectElem = $(this.config.selectElem),
            list = createList(options);

        //默认选中第一个
        text = list.text;
        innerHtml = list.html;
        selectElem.html(innerHtml);
        this.element.html(text);
    }

    function createList(items){
        var listHtml = '<ul class="' + (arguments[1] ? 'cascadeselect_son_options':'cascadeselect_options') + '">',
            defaultText = '', temp, son;
        for(var i = 0,len = items.length; i < len;i++){
            if(items[i].selected){
                listHtml += '<li class="cascadeselect_option" value="' + items[i].value +'" selected="true"><span>'+ items[i].text+'</span>';
                defaultText += items[i].text;
            }else{
                listHtml += '<li class="cascadeselect_option" value="' + items[i].value +'"><span>'+ items[i].text +'</span>';
            }
            if(son = items[i].son){
                temp = createList(son, true);
                listHtml += temp.html;
                defaultText += temp.text;
            }
            listHtml += '</li>';
        }
        listHtml += '</ul>';
        return {html:listHtml , text: defaultText};

    }

    /**
     *  加载初始化options属性（如果创建对象的时候没有传options值，则会自动调用）
     */
    CascadeSelect.prototype.loadInitOption = function(){
        var containerUL = $(this.config.selectElem).children('ul.cascadeselect_options');
        this.options = _loadInitOption();

        function _loadInitOption(){
            var options = [], value = '', text ='', selected = false, son,
                node = arguments[0] || containerUL,
                sonNode;
            node.children('li.cascadeselect_option').each(function(){
                value = $(this).attr('value');
                text = $(this).children('span').html();
                selected = $(this).attr('selected') || false;
                sonNode = $(this).children('ul.cascadeselect_son_options');
                son = null;
                if(sonNode.length){
                    son = _loadInitOption(sonNode);
                }
                options.push({value:value,text:text,selected:selected,son:son});
            });
            return options;
        }
    }

    CascadeSelect.prototype.show = function(){
        var cascadeSelect = CascadeSelect.instance;
        for(var i= 0,len = cascadeSelect.length;i<len;i++){
            cascadeSelect[i].hide();
        }
        $(this.config.selectElem).show();
    }

    CascadeSelect.prototype.hide = function(){
        $(this.config.selectElem).hide();
    }

    CascadeSelect.prototype.removeOptionByValue = function( values ){
        var options = arguments[1] || this.options,
            son;
        isArray(values) || (values = [values]);
        for(var i = 0, valuesLen = values.length; i < valuesLen; i++){
            for(var j = 0, optionsLen = options.length; j < optionsLen; j++){
                son = options[j].son;
                if(options[j].value === values[i]){
                    options.splice(j , 1);
                }else if(son){
                    this.removeOptionByValue(values[i], son);
                }
            }
        }
        this.render();
    }

    /**
     *
     * @param  {[type]} index   [插入位置]
     * @param  {[type]} options [ {value:1,text:1,son:[{},{}]} , {value:2,text:2,son:[{},{}]} ]
     * @return {[type]}         [description]
     */
    CascadeSelect.prototype.addOption = function(index, options){
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

    CascadeSelect.prototype.setSelectedByValue = function(value){
        var _this = this, parent, son;
        _setSelectedByValue(value);
        this.render();

        function _setSelectedByValue(value){
            var options = arguments[1] || _this.options;
            for(var i = 0,len = options.length; i<len; i++){
                parent = arguments[2] || [];
                if(options[i].value === value){
                    options[i].selected = true;
                    for(var j= 0,plen = parent.length; j<plen; j++){
                        parent[j].selected = true;
                    }
                }else{
                    options[i].selected = false;
                }
                if(son = options[i].son){
                    parent.push(options[i]);
                    _setSelectedByValue(value,son,parent);
                }
            }
        }
    }

    CascadeSelect.prototype.cancelSelectedbyValue = function(value){
        var _this = this, parent, son;
        _cancelSelectedbyValue(value);
        this.render();

        function _cancelSelectedbyValue(){
            var options = arguments[1] || _this.options;
            for(var i = 0,len = options.length; i<len; i++){
                parent = arguments[2] || [];
                if(options[i].value === value){
                    options[i].selected = false;
                    for(var j= 0,plen = parent.length; j<plen; j++){
                        parent[j].selected = false;
                    }
                }
                if(son = options[i].son){
                    parent.push(options[i]);
                    this.setSelectedByValue(son.value,son,parent);
                }
            }
        }
    }

    CascadeSelect.prototype.getSelected = function(){
        var _this = this,res = [],son;
        return _getSelected() ;

        function _getSelected(){
            var options = arguments[0] || _this.options;
            for(var i = 0,len = options.length; i<len; i++){
                son = options[i].son;
                if(options[i].selected){
                    res.push({index:i,value:options[i].value,text:options[i].text});
                    if(son){
                        res.push(_getSelected(son));
                    }
                    break;
                }
            }
            return res;
        }
    }

    function isArray(v){
        return Object.prototype.toString.call(v) === '[object Array]';
    }

    module.exports = CascadeSelect;

});