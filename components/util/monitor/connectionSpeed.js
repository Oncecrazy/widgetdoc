/**
 * It's possible to some extent but won't be really accurate, the idea is load image with a known file size then in its onload event measure how much time passed until that event was triggered, and divide this time in the image file size.
 Important things to keep in mind:

1. The image being used should be properly optimized and compressed. If it isn't, then default compression on connections by the web server might show speed bigger than it actually is. Another option is using uncompressible file format, e.g. jpg. (thanks Rauli Rajande for pointing this out and Fluxine for reminding me).
2. The cache buster mechanism described above might not work with some CDN servers, which can be configured to ignore query string parameters, hence better setting cache control headers on the image itself. 
 */

function measureConnectionSpeed(options){
	var imageURL = options.imageURL || "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg",
		downloadSize  = options.downloadSize || 4995374, //bytes
		retry = options.retry || 3,
        load = options.load || function(){};

	function _measure(){
		var download = new Image(),
			startTime, 
            endTime, 
            duration,
            bitsLoaded,
            speedBps; //bit pro second
			
	    download.onload = function () {
	        endTime = (new Date()).getTime();
	        duration = (endTime - startTime) / 1000;
	        bitsLoaded = downloadSize * 8;
	        speedBps = (bitsLoaded / duration).toFixed(2);
            load && load(speedBps);
	        retry = 0;
	        download.onload = null;
	    }
	    
	    download.onerror = function (err, msg) {
	    	if(--retry){
	    		_measure();
	    	}
    		download.onerror =  null;
	    }

	    startTime = (new Date()).getTime();
	    download.src = imageURL + "?t=" + startTime;
	}

	_measure();	
}

