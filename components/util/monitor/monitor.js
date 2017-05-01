/*//<head>
//监控数据
var __STATS = __STATS || {
	start: +new Date(),
	points: {},
	add: function(point, time){
		this.points[point] = time ? time :(+new Date() - this.start);
	}
}


//<scirpt>__STATS.add('head_load');</script>
//</head>*/


var __STATS = window.__STATS,
	performance = window.webkitPerformance || window.performance,
    url = "http://localhost/timing";


function _onMonitor(){
	setTimeout(monitor, 0);
}

_addEventListener(window, "load", _onMonitor);


function monitor() {
    var firstScreenTime = calcFristScreenTime(),
    	data;
    if (__STATS && firstScreenTime) {
        __STATS.add("first_screen", firstScreenTime);
    }

    if (data = analyse()){
        sender( url + data );
    }
    _removeEventListener(window, "load", _onMonitor);
}


//参考alogs
;(function(global){
    if(window.reporter){return;}

    var  M = window.reporter = {};

    //性能数据
    var __STATS = M.__STATS =  M.__STATS || {
        start: +new Date(),
        points: {},
        add: function(point, time){
            this.points[point] = time ? time :(+new Date() - this.start);
        }
    };

    M.create = function(moduleName, factory){

    };

    M.use = function(moduleName){

    };

    M.create('err', function(){
        var errMonitor = M.module('err');
        window.onerror = function(){
            errMonitor.send();
        }
        return errMonitor;
    });

    M.use('err');

})(this);
