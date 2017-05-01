;(function(global){
	if(window.reporter){return;}

  	var R = window.reporter = {};

	//性能数据
	var __STATS = R.__STATS =  R.__STATS || {
        start: +new Date(),
        points: {},
        add: function(point, time){
            this.points[point] = time ? time :(+new Date() - this.start);
        }
    };


    R.create = function(moduleName, factory){

    };

    R.use = function(moduleName){

    };

    R.monitor = function(moduleName){

    }

    R.create('err', function(){
    	var errMonitor = R.moinotor('err');
    	window.onerror = function(){
    		errMonitor.send();
    	}
    	return errMonitor;
    });

    R.use('err');

    R.create('log', function(){

    });


})(this);
