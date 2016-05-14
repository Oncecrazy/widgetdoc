define('AccordionMenu',['Base','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		Event = require('Events'),
		$ = require('jquery');

	var AccordionMenu = Base.extend(Base,function(menu){
		this.element = $(menu);
	});

	Base.implement(AccordionMenu, Event);

	AccordionMenu.prototype.init = function(){
		this.initEvent();
		this.render();
	}
	
	AccordionMenu.prototype.render = function(){
		//this.fold();
	}

	AccordionMenu.prototype.initEvent = function(){
		var self = this,
            item,arrow;
		this.element.on('click','li > div',function(evt){
            item = $(this).parent();
            arrow = $(this).find('[name=switch]');
            if(!arrow.length){return;}
            if(arrow.attr('class').indexOf('icon_tree_switch_up') < 0){
                self.fold(item);
            }else{
                self.unfold(item);
            }
		});
	}

	/**
	 * [折叠节点]
	 * @param  {object} nodes [操作节点]
	 * @return 
	 */
	AccordionMenu.prototype.fold = function(nodes){
		if(!nodes){
			nodes = this.element.find('li');
		}
		nodes.each(function(){
			var sonItem = $(this).children('ul');
            if(sonItem.length){
                // 隐藏子节点
                sonItem.hide();
                // 修改折叠箭头
                $(this).children('div').find('[name=switch]').removeClass('icon_tree_switch_down').addClass('icon_tree_switch_up');
            }else{
                //本节点为末级节点
                $(this).children('div').removeClass('on');
            }
		});
	}

	/**
	 * [展开节点]
	 * @param  {object} nodes [操作节点]
	 * @return 
	 */
	AccordionMenu.prototype.unfold = function(nodes){
		var self = this;
		if(!nodes){
			nodes = this.element.find('li');
		}
		nodes.each(function(){
			var sonItem = $(this).children('ul');
            if(sonItem.length){
                // 显示子节点
                sonItem.show();
                // 修改折叠箭头
                $(this).children('div').find('[name=switch]').removeClass('icon_tree_switch_up').addClass('icon_tree_switch_down');
            }else{
                //本节点为末级节点
                var brotherNodes = $(this).siblings();
                brotherNodes.each(function(){
                    $(this).children('div').removeClass('on');
                });
                $(this).children('div').addClass('on');
                self.emit('select');
            }
			//展开父节点
			var fatherNodes = $(this).parents('li');
			self.unfold(fatherNodes);
		});

	}

	module.exports = AccordionMenu;
});