function sender(url, data, callback){
	if(!callback){callback = function(){};}
    if(!data){return callback();}
    var rnd = +new Date +"." + Math.floor(Math.random()*1000),
        name = "reporterImage_" + rnd,
        img = window[name] = new Image(),
        items = [ '_='+rnd ];
    for (var key in data) {
        if (data[key]) {
            items.push(key + '=' + encodeURIComponent(data[key]));
        }
    }
    url = url + (url.indexOf('?') < 0 ? '?' : '&') +  items.join('&');
    //if(url.length > URLLength){return callback();}

    img.onload = img.onerror = img.onabort = function () {
    	callback();
        img.onload = img.onerror = img.onabort = null;
        window[name] = null;
    };
    img.src = url + (url.indexOf('?') < 0 ? '?' : '&') +  items.join('&');
}

var RE_FUNCTION = /^function\b[^\)]+\)/;
/**
* 获得函数名。
* @param {Function} func, 函数对象。
* @return {String} 函数名。
*/
function function_name(func){
	var match = String(func).match(RE_FUNCTION);
	return match ? match[0] : "";
}

/**
* 函数调用堆栈。
* XXX: 匿名函数的支持。
* @param {Function} call, function's caller.
* @return {String} stack trace.
*/
function stacktrace(call){
	var stack = [];

	while(call.arguments && call.arguments.callee && call.arguments.callee.caller){
	  call = call.arguments.callee.caller;
	  stack.push("at " + function_name(call));

	  // Because of a bug in Navigator 4.0, we need this line to break.
	  // c.caller will equal a rather than null when we reach the end
	  // of the stack. The following line works around this.
	  if (call.caller === call){break;}
	}
	return stack.join("\n");
}

// process error stack
// function processStackMsg(error) {
//     // error stack
//     var stack = error.stack.replace(/\n/gi, "")
//         .split(/\bat\b/).slice(0, 5).join("@").replace(/\?[^:]+/gi, "");
//     // error message
//     var msg = error.toString();
//     return stack.indexOf(msg) < 0 ? (msg + "@" + stack) : stack;
// };

function pareseStack(stack) {
    var errorUrl, location;
    errorUrl = stack.match("https?://[^\\)\\n]+");
	errorUrl = errorUrl ? errorUrl[0] : "";
	location = errorUrl.match(":(\\d+):(\\d+)");
    if (!location) {location = [-1, -1, -1];}
    errorUrl = errorUrl.replace(location[0], "");
    return {
    	file: errorUrl,
    	line: location[1]
    };
};


/**
* JavaScript 异常统一处理函数。
* @param {String} message, 异常消息。
* @param {String} file, 异常所在文件。
* @param {Number} line, 异常所在行。
* @param {Number,String} number, 异常编码，IE 支持。
* @return {Object} 主要用于单元测试，本身可以不返回。
*/
function baseerror(message, file, line, number, stack){
	var errorInfo;
	if(!stack && arguments.callee.caller){
	  stack = stacktrace(arguments.callee.caller);
	}

	errorInfo = pareseStack(stack);

	var data = {
	  profile: "jserror",
	  msg: message || "",
	  file: file || errorInfo.file,
	  line: line || errorInfo.line,
	  num: number || "",
	  stack: stack || ""
	};
	//M._DATAS.push(data);
	return data;
}

/**
* JavaScript 异常接口，用于监控 `try/catch` 中被捕获的异常。
* @param {Error} err, JavaScript 异常对象。
* @return {Object} 主要用于单元测试。
*/
var monitorerror = function(ex){
	if (!(ex instanceof Error)) {return;}
	var stack = ex.stack || ex.stacktrace;
	return error(
	  ex.message || ex.description,
	  ex.fileName,
	  ex.lineNumber || ex.line,
	  ex.number,
	  stack
	);
};


window.onerror = function(message, file, line, col, error) {
	var stack = error && error.stack ? error.stack : '',
		number = error && error.number ? error.number : '';
	baseerror(message, file, line, number, stack);
};


// window.onerror = function(msg, url, line, col, error){
//     var reportURL = 'http://localhost/jslog/?';
//     var newMsg = error && error.stack ? processStackMsg(error): msg;
//     sender(reportURL, {
//     	m:newMsg,
//     	f:url,
//     	r:line,
//     	c:col
//     });
// }

// function monitorerror(error){
//     var pageUrl = location.href,
//         debug = /debug=true/.test(location.href),
//         reportURL = 'http://localhost/jslog/?',
//         errorUrl, errorMsg, rowCols;

//     if(!stack && arguments.callee.caller){
//       stack = stacktrace(arguments.callee.caller);
//     }

// 	errorUrl = error.stack.match("https?://[^\\)\\n]+");
// 	errorUrl = errorUrl ? errorUrl[0] : "";
// 	rowCols = errorUrl.match(":(\\d+):(\\d+)");
//     if (!rowCols) {
//         rowCols = [0, 0, 0];
//     }
//     errorUrl = errorUrl.replace(rowCols[0], "");
//     errorMsg = processStackMsg(error);

//     sender(reportURL, {
//     	m:errorMsg,
//     	f:errorUrl,
//     	r:rowCols[1],
//     	c:rowCols[2]
//     });

//     if(debug){
//         //测试环境
//         var _onerror = window.onerror;
//         window.onerror = function() {};
//         setTimeout(function() {
//             window.onerror = _onerror;
//         }, 0);
//         throw error;
//     }
// }


function test(){
	// try{

		//var a = b.length;

	// }catch(error){

	// 	monitorerror(error);
	// }

}

test();