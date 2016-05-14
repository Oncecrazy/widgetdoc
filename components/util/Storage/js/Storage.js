/**
 * 客户端的本地存储组件.
 *
 * 注意：当客户端发起HTTP请求时，存储的数据，不会传递给服务器端，和Cookie不同.
 *
 * 》使用到的技术特性：
 * 1. localStorage（支持：IE8+、FF3.5+、Chrome4+、Safari4+、Opera10.5+）
 * 2. sessionStorage（支持：IE8+、FF3.5+、Chrome4+、Safari4+、Opera10.5+）
 * 3. userData，IE专有特性，单个文件128KB，单个域1024KB，
 * 详见 http://msdn.microsoft.com/en-us/library/ms531424(v=vs.85).aspx（在IE6、IE7下使用）
 *
 * 新的API接口 应该是这样的：
 * var Storage = require("Storage");
 * var storage = new Storage("local"); //local为持久存储， session为会话存储。
 * storage.get(key);
 * storage.set(key, value);
 * storage.remove(key);
 */

define(function(require, exports, module){
                      
    var $ = require('jquery');

    var Storage = function(){

    }
    
    Storage.prototype.get = function(key){

    }

    Storage.prototype.set = function(key, value){

    }

    Storage.prototype.remove = function(key){

    }

    Storage.prototype.clear = function(){
        
    }

    // IE UserData特性
    var UserData = function(sname){
        this.sname = sname;
        this.tname = sname + '_names';
                          
        this.isSession = sname.split('_')[0] === 'session';
                          
        this.init();
    };
    UserData.prototype = {
        init: function(){
            if (this.isSession) {
                this.names = this.getItem(this.tname) || '';
                                  
                this.restore();
            }
        },
                          
        eStore: function(){
            return $('<span class="jxc-ie-userdata"/>').appendTo(document.body)[0];
        }(),
                          
        getItem: function(name){
            this.eStore.load(this.sname);
            return this.eStore.getAttribute(name);
        },
                          
        setItem: function(name, value){
            this.addName(name);
                              
            this.eStore.expires = getUTCString('3y');
            this.eStore.setAttribute(name, value);
            this.eStore.save(this.sname);
        },
                          
        removeItem: function(name){
            this.delName(name);
                              
            this.eStore.removeAttribute(name);
            this.eStore.save(this.sname);
        },
                          
        // 临时存储，要想刷新页面，不清除数据，那么每条数据都必须重新设置下
        // 直接改过期日期还不行，我x，太变态了，why？
        restore: function(){
            if (this.names) {
                var names  = this.names.split(' '),
                    eStore = this.eStore;
                                  
                eStore.load(this.sname);
                                  
                eStore.expires = getUTCString('3y');
                                  
                for (var i = 0, name; name = names[i]; i++) {
                    eStore.setAttribute(name, eStore.getAttribute(name));
                }
                                  
                eStore.save(this.sname);
            }
        },
                          
        addName: function(name){
            if (this.isSession) {
                name += ' ';
                                  
                if (this.names.indexOf(name) < 0) {
                    this.names += name;
                                      
                    this.eStore.setAttribute(this.tname, this.names);
                }
            }
        },
                          
        delName: function(name){
            if (this.isSession) {
                this.names = this.names.replace(name + ' ', '');
                                  
                this.eStore.setAttribute(this.tname, this.names);
            }
        },
                          
        // 刷新页面时，设置5s作为缓冲时间，这期间完成数据恢复
        // 如果关闭浏览器，5s没有重新打开页面，那么数据就失效了
        clear: function(){
            this.eStore.expires = getUTCString('5s');
            this.eStore.save(this.sname);
        }
    };
                      
    /**
     * 持久化存储.
     */
    exports.Local = function(){
        var oStore = window.localStorage;
                          
        if (!oStore) {
            oStore = new UserData('local_' + location.hostname);
        }
                          
        return {
            read:   bind(oStore.getItem, oStore),
            save:   bind(oStore.setItem, oStore),
            remove: bind(oStore.removeItem, oStore)
        };
    }();
                      
    /**
     * 临时存储.
     */
    exports.Session = function(){
        var oStore = window.sessionStorage;
                          
        if (!oStore) {
            oStore = new UserData('session_' + location.hostname);
                              
            addUnloadEvent(oStore);
        }
                          
        return {
            read:   bind(oStore.getItem, oStore),
            save:   bind(oStore.setItem, oStore),
            remove: bind(oStore.removeItem, oStore)
        };
    }();
                      
    // 绑定函数的this对象
    function bind(fn, context) {
        return function(){
            return fn.apply(context, arguments);
        };
    };
                      
    // 窗口关闭时，清除userdata，但刷新不清除
    function addUnloadEvent(oStore) {
        window.attachEvent('onunload', function(){
            window.detachEvent('onunload', arguments.callee);
                              
            oStore.clear();
        });
    };
                      
    // expires = number + y|M|d|h|m|s
    // expires = 360d // 360天
    function getUTCString(expires) {
        expires += '';
                          
        var a = /([^yMdhms]+)(\w)?/.exec(expires),
            n = a ? a[1] : 0,
            f = a ? a[2] : 'y';
                          
        switch (f) {
            case 'y': n*=365*24*3600*1000; break;
            case 'M': n*=30*24*3600*1000; break;
            case 'd': n*=24*3600*1000; break;
            case 'h': n*=3600*1000; break;
            case 'm': n*=60*1000; break;
            case 's': n*=1000; break;
            default:  n*=1000; break;
        }
                          
        var d = new Date();
        d.setMilliseconds( d.getMilliseconds() + n );
                          
        return d.toUTCString();
    };
                      
});