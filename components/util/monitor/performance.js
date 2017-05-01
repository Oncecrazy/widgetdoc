
var performance = (function(global){

    var __STATS = window.__STATS,
        performance = window.webkitPerformance || window.performance;

    function _keys(obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    }

    function _forEach (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    }

    function _addEventListener(elem, eventType, handler){
        if(window.addEventListener){
            elem.addEventListener(eventType, handler, false);
        }else if(window.attachEvent){
            elem.attachEvent('on'+eventType, handler);
        }
        return function(){};
    }

    function _removeEventListener(elem, eventType, handler){
        if(window.removeEventListener){
            elem.removeEventListener(eventType, handler, false);
        }else if(window.detachEvent){
            elem.detachEvent('on'+eventType, handler);
        }
        return function(){};
    }

    function domReady(callback){
        var domReadyMonitorId = null, 
            domReadyMonitorRunTimes = 0;
        domReadyMonitorId = window.setInterval(_domReadyMonitor, 50);
        window.addEventListener && document.addEventListener('DOMContentLoaded', function(){
            _domReadyMonitor(true);
        }, false);
        
        function _domReadyMonitor(domContentLoaded){
            var isReady = false;
            //对于非iframe嵌套的ie浏览器, 使用doScroll判断Dom Ready.
            if(window.attachEvent && !window.frameElement){
                try {
                    doc.documentElement.doScroll("left");
                    isReady = true;
                } catch (e) {}
            //非ie浏览器
            //如果window.onload和DOMContentLoaded事件都绑定失败, 则使用定时器函数判断readyState.               
            }else if(document.readyState === "complete" || domContentLoaded){
                isReady = true;
            }
            //对于某些特殊页面, 如果readyState永远不能为complete, 设置了一个最大运行时间5分钟. 
            //超过了最大运行时间则销毁定时器. 定时器销毁不影响window.onload和DOMContentLoaded事件的触发.
            else {
                if (domReadyMonitorRunTimes > 300000) {
                    window.clearInterval(domReadyMonitorId);
                    domReadyMonitorId = null;
                    domReadyMonitorRunTimes = null;
                    return;
                }
            }
            //执行ready集合中的所有函数
            if (isReady) {
                callback();
                window.clearInterval(domReadyMonitorId);
                domReadyMonitorId = null;
            }
        }
    }

    function _onCompleted(){
        console.log(1);
        __STATS.add('dom_ready');
        //_removeEventListener(document, "DOMContentLoaded", _onCompleted);
    }

    function _onload(){
        console.log(2);
        __STATS.add('onload');
        _removeEventListener(window, "load", _onload);
    }

    //_addEventListener(document, 'DOMContentLoaded', _onCompleted);
    domReady(_onCompleted);
    _addEventListener(window, 'load', _onload);

    function calcFristScreenTime() {
        var images = document.images,
            resources, fristScreenImages;
        if ( !performance || !("getEntriesByType" in performance) ||
            !("getBoundingClientRect" in document.body) ) {
            return 0;
        }
        resource = performance.getEntriesByType("resource");
        fristScreenImages = filterImages(images);
        if (fristScreenImages.length) {
            var map = {},
                duration = 0;
            _forEach(resource, function(item){
                "img" === item.initiatorType && (map[item.name] = item);
            });
            _forEach(fristScreenImages, function(item){
                var src = item.getAttribute("src");
                if (src && src in map && map[src].duration > duration) {
                    duration = parseInt(map[src].duration);
                }
            });
            return duration;
        }
        return 0;
    }

    function filterImages(images) {
        var res = [];
        for (var i = 0, len = images.length; i < len; i++) {
            if (inScreen(images[i])) {
                res.push(images[i]);
            }else if(res.length) {
                break;
            }
        }
        return res;
    }

    function inScreen(a) {
        var rect = a.getBoundingClientRect(),
            clientHeight = document.documentElement.clientHeight;
        return rect.top >= 0 ? clientHeight > rect.top : rect.top > -rect.height;
    }

    function analyse() {
        var performanceTiming = performance ? performance.timing : null,
            performancePoint = {
                // t0: ["redirectStart", "redirectEnd"], //redirectTime
                // t1: ["domainLookupStart", "domainLookupEnd"], //dnsTime
                // t2: ["connectStart", "connectEnd"], //connectTime
                // t3: ["requestStart", "responseEnd"], //requestTime
                // t4: ["responseStart", "responseEnd"], //responseTime
                // t5:  ["domLoading", "domInteractive"], //domLoadingTime
                // t6: ["domInteractive", "domContentLoadedEventEnd"], //domInteractiveTime
                // t7: ["domContentLoadedEventStart", "domContentLoadedEventEnd"], //domContentLoadedTime
                // t8: ["domLoading", "domComplete"], //domCompleteTime
                // t9: ["loadEventStart", "loadEventEnd"] //loadEventTime
                t0: ["redirectStart", "redirectEnd"], //redirect
                t1: ["domainLookupStart", "domainLookupEnd"], //dns
                t2: ["connectStart", "connectEnd"], //connect
                t3: ["navigationStart", "connectEnd"], //network
                t4: ["requestStart", "responseStart"], //send
                t5: ["responseStart", "responseEnd"], //receive
                t6: ["requestStart", "responseEnd"], //backend
                t7: ["domLoading", "domComplete"], //domBuild 构建DOM树时间
                t8: ["navigationStart", "domContentLoadedEventStart"], //domReady 
                t9: ["loadEventStart", "loadEventEnd"], //eventLoad
                t10:["domLoading", "loadEventEnd"], //frontend
                t11: ["navigationStart", "loadEventEnd"] //load
            },pageMap = {
                head_load : 'p0',
                dom_ready: "p1",
                first_screen: "p2",
                onload: "p3"
            }, log = "";

        if (__STATS) {
            log = "?_t=" + (+ new Date());
            _forEach(_keys(__STATS.points), function(value, idx){
                var tag = pageMap[value];
                tag && (log +="&" + tag + "=" + __STATS.points[value]);
            });
            delete __STATS;
        }
        if (performanceTiming) {
            log || (log = "?_t=" + (+ new Date()));
            // if (performanceTiming.domContentLoadedEventStart === undefined) {
            //     performancePoint.t7 = ["domContentLoadedStart", "domContentLoadedEnd"];
            // }
            _forEach(_keys(performancePoint), function(value, idx){
                var tag = performancePoint[value],
                    time = performanceTiming[tag[1]] - performanceTiming[tag[0]];
                time >=0 && (log += "&" + value + "=" + time)
            });
        }
        return log;
    }

})(window);
