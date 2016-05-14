define('multiRoleTree',['AccordionMenu','Events','jquery'],function(require,exports,module){
	var Base = require('Base'),
		AccordionMenu = require('AccordionMenu'),
		$ = require('jquery');

	var defaults = {
        element : null   
    }

	var MultiRoleTree = Base.extend(AccordionMenu,function(config){
		this.config = $.extend({},defaults,config);
		AccordionMenu.call(this,this.config.element);
        this.loadInitNodes();
	});

	
	MultiRoleTree.prototype.render = function(){
		//this.fold();
	}

	MultiRoleTree.prototype.initEvent = function(){
		var self = this,
            item,arrow,id;
		this.element.on('click','li > div',function(evt){
            item = $(this).parent();
            arrow = $(this).find('[name=switch]');
            if(!arrow.length){return;}
            if(arrow.attr('class').indexOf('icon_tree_switch_up') < 0){
                self.fold(item);
            }else{
                self.unfold(item);
            }
            evt.stopPropagation();
		});

		initOperation(this);
	}

	function initOperation(obj){
		var operations = {
				'dir_up': 'moveup',
				'dir_down': 'movedown',
				'dir_move': 'move',
				'dir_rename': 'rename',
				'dir_del': 'delete'
			}, node;
		obj.element.on('click','a',function(evt){
			var opr = operations[$(this).attr('class').toLowerCase()];
			if(!opr){return;}
			node = $(this).parents('li').first();
			obj.emit(opr,node);
			evt.stopPropagation();
		});
	}

    /**
     *  加载初始化nodes属性
     */
    MultiRoleTree.prototype.loadInitNodes = function(){
        var  containerUL = this.element.children('ul');
        this.nodes = _loadInitOption();

        function _loadInitOption(){
            var nodes = [], text ='', son,
                node = arguments[0] || containerUL,
                sonNode;
            node.children('li').each(function(){
                id = $(this).children('div').attr('id');
                sonNode = $(this).children('ul');
                son = null;
                if(sonNode.length){
                    son = _loadInitOption(sonNode);
                }
                nodes.push({id:id,son:son});
            });
            return nodes;
        }
    }

	MultiRoleTree.prototype.moveTo = function(node, target){
		var tempnode = node.clone();
		target.append(tempnode);
		node.remove();
	}

	MultiRoleTree.prototype.moveUp = function(node){
		if(!node){return;}
		var target = node.prev();
        if (target.length > 0) {
            target.insertAfter(node);
        }
	}

	MultiRoleTree.prototype.moveDown = function(node){
		if(!node){return;}
		var target = node.next();
        if (target.length > 0 ) {
            target.insertBefore(node);
        }
	}

    MultiRoleTree.prototype.rename = function(node,newName){
    	if(!node){return;}
    	node.children('div').find('a.node').text(newName);
    }

    MultiRoleTree.prototype.remove = function(node){
		if(!node){return;}
		node.remove();
    }

	MultiRoleTree.prototype.getNodeById = function(nodeid){
		var node = $('#'+nodeid).parent();
		return node;
	}

	module.exports = MultiRoleTree;
});