define(function(module, exports, require){
	var _isSupport;
	
	function isSupportStorage(cb){
		var supportwebp = window.localStorage && window.localStorage.getItem('supportwebp');
		if(supportwebp != null){
			cb && cb(supportwebp === 'true');
			return;
		}
		isSupportWebP(function(isSupport){
			window.localStorage && window.localStorage.setItem('supportwebp', isSupport);
			cb && cb(isSupport);
		});
	}

	function isSupportWebP(cb){
		var img = new Image(), loaded;
	    img.onload = img.onerror = img.onabort = function () {
	    	if (!loaded) {
				loaded = true;
				cb && cb(img.width === 2 && img.height === 2);
			}
	        img.onload = img.onerror = img.onabort = null;
	        img = null;
	    };
	    setTimeout(function () {
			if (!loaded) {
				loaded = true;
				cb && cb(false);
			}
		}, 16);
	    img.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
	}

	var webp = {
		isSupport: function(cb){
			if(_isSupport === undefined){
				isSupportWebP(function(isSupport){
					_isSupport = isSupport;
					cb && cb(isSupport);
				});
			}
			cb && cb(_isSupport);
		}
	};

	return webp; 
});