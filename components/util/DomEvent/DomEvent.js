define('domevent', function(require , exports , module){

var eventHandlerMap = {};

/**
 * @description                      事件添加方法(已做兼容处理)，可以监听鼠标滚轮事件mousewheel
 * @param  {object}   elem           Dom对象
 * @param  {string}   type           事件类型
 * @param  {function} elem           事件处理函数
 * @param  {boolean}  capture  可选  事件触发顺序，userCapture若为true,则浏览器采用Capture,若为false则采用bubbing方式
 * @return {null}        
 */
var addEvent = (function(window, undefined) {        
        var fixEvent = function(event) {
            var type = event.type;
            if (type == 'DOMMouseScroll' || type == 'mousewheel') {
                /* Event.delta 增量 */
                event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
            }
            if (event.srcElement && !event.target) {
                event.target = event.srcElement;    
            }
            if (!event.preventDefault && event.returnValue !== undefined) {
                event.preventDefault = function() {
                    this.returnValue = false;
                };
            }
            if(!event.stopPropagation && event.cancelBubble !== undefined){
                event.stopPropagation = function(){
                    this.cancelBubble = true;
                }
            }
            /* ......其他一些兼容性处理 */
            return event;
        };
        if (window.addEventListener) {
            return function(elem, type, fn, capture) {
                if (type === "mousewheel" && document.mozHidden !== undefined) {
                    type = "DOMMouseScroll";
                }
                var handler = function(event) {
                    fn.call(elem, fixEvent(event));
                }
                eventHandlerMap[fn] = handler;
                elem.addEventListener(type, handler, capture || false);
            }
        } else if (window.attachEvent) {
            return function(elem, type, fn, capture) {
                var handler = function(event) {
                    event = event || window.event;
                    fn.call(elem, fixEvent(event));    
                }
                eventHandlerMap[fn] = handler;
                elem.attachEvent("on" + type, handler);
            }
        }
        return function() {};    
    })(window); 
/**
 * @description                      事件移除方法(已做兼容处理)，可以移除鼠标滚轮事件
 * @param  {object}   elem           Dom对象
 * @param  {string}   type           事件类型
 * @param  {function} elem           事件处理函数
 * @param  {boolean}  capture  可选  事件触发顺序，userCapture若为true,则浏览器采用Capture,若为false则采用bubbing方式
 * @return {null}        
 */
var removeEvent = (function(window, undefined) {        
        if (window.removeEventListener) {
            return function(elem, type, fn, capture) {
                if (type === "mousewheel" && document.mozHidden !== undefined) {
                    type = "DOMMouseScroll";
                }
                var handler = eventHandlerMap[fn];
                delete eventHandlerMap[fn];
                elem.removeEventListener(type, handler, capture || false);
            }
        } else if (window.detachEvent) {
            return function(elem, type, fn, capture) {
                var handler = eventHandlerMap[fn];
                delete eventHandlerMap[fn];
                elem.detachEvent("on" + type, handler);
            }
        }
        return function() {};    
    })(window);  

    exports.addEvent = addEvent; 
    exports.removeEvent = removeEvent; 
}
