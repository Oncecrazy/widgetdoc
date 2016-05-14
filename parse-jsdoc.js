var fs = require('fs');

var reg = /\/\*{2}([\s\S]+?)\*\//g;

var ltimes = {};

var dialogs = {};

var slice = [].slice;

// jsdoc解析
module.exports = function( filepath ){

	var mtime = fs.statSync( filepath ).mtime;

	var ltime = ltimes[filepath];

	var dialog = dialogs[filepath];

	if(!ltime || !dialog || mtime !== ltime){

		dialog = dialogs[filepath] = fs.readFileSync( filepath , 'utf8' );

		ltimes[filepath] = mtime;

	}

	return execStr( dialog , reg , str2json , []);

}

// 正则扫描
function execStr( str , reg , callback , obj ){

	var pos;

	reg.lastIndex = 0;

	while( pos = reg.exec( str ) ){

		typeof callback === 'function' && callback( pos , obj );

	}

	return obj;

}

// 将注释转换成json对象
function str2json( str , arr ){

	var reg = /\*\s*@([\w\d_]+)\s*(?:\{(\w*)\})?\s*(.*)\s+/g;

	arr.push( execStr( str[0] , reg , function( pos , json ){

		json[pos[1]] = ( (pos[2] || '') + ' ' + pos[3]).trim().split(/\s+/);

	} , {} ) );

}