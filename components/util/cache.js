define(function(require, exports, module){
    var $ = require("$");
    /**
     * [采用LRU算法]
     * 1. 新数据插入到链表头部；
     * 2. 每当缓存命中（即缓存数据被访问），则将数据移到链表头部；
     * 3. 当链表满的时候，将链表尾部的数据丢弃。
     */
    
    var defaults = {
        limit: 100,
        maxAge: 10*60
    };

    function Entry (key, value, now, maxAge) {
        this.key = key;
        this.value = value;
        this.now = now;
        this.maxAge = maxAge || 0;
    }

    function LRUList(limit){
        this.limit = limit;
        this.list = [];
    }

    LRUList.prototype.push = function(key){
        if(this.list.length > this.limit){
            this.list.pop();
            this.list.unshift(key);
        }else{
            this.list.unshift(key);
        }
    }

    LRUList.prototype.hit = function(key){
        var list = this.list;
        var index = -1;
        for(var i=0,len=list.length; i<len; i++){
            if(list[i] === key){
                index = i;
            }
        }
        if(index>=0){
            list.splice(index, 1);
            this.add(key);
        }

        return index;
    }

    LRUList.prototype.keys = function(key){
        return this.list;
    }

    LRUList.prototype.clear = function(key){
        var list = this.list;
        if(typeof key !== "undefined"){
            for(var i=0,len=list.length; i<len; i++){
                if(list[i] === key){
                    list.splice(i, 1);
                    break;
                }
            }
        }else{
            list = [];
        }
    }

    var Cache = function(option){
        this.config = $.extend({}, defaults, option);
        this.map = {};
        this.lruList = new LRUList(option.limit);
    }

    Cache.prototype.keys = function(){
        return this.lruList.keys();
    }

    Cache.prototype.has = function(key){
        return this.lruList.has(key);
    }

    Cache.prototype.values = function(){
        var map = this.map;
        var values = [];
        for(var item in map){
            values.push(map[item]);
        }
        return values;
    }

    Cache.prototype.length = function(){
        return this.lruList.length;
    }

    Cache.prototype.clear = function(key){
        if(typeof key == 'undefined'){
            this.map = {};
            this.lruList = new LRUList();
        }else{
            delete map[key];
            this.lruList.clear(key);
        }
    }

    Cache.prototype.set = function(key, value, maxAge){
        if(!key){return;}
        maxAge = maxAge || this.config.maxAge;
        var now = Date.now();
        this.map[key] = new Entry(key, value, now, maxAge);
        var oldKey = this.lruList.push(key);
        if(typof oldKey !== "undefined"){
            delete this.map[oldKey];
        }
    }

    Cache.prototype.get = function(key){
        var entry = this.map(key);
        var now = Date.now();
        if(typoef entry !== "undefined"){
            if(now - entry.now <= entry.maxAge){
                this.lruList.hit(key);
            }
        }else{
            return undefined;
        }
    }

    module.exports = Cache;

});