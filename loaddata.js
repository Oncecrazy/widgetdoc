//加载并解析文件
var realPath = process.cwd() + "/public/components/src";
var JsdocParse = require("./jsdocParse");
var Explorer = require('./explorer');
var GrabFile = require('./grabfile');
var SortFile = require('./sortfile');

//设置全部变量components保存解析数据
global.components = new Array();

var handle = function(file){
	global.components.push(JsdocParse.parse(file));
}

function init(){
	var fileList = GrabFile.grabFile(realPath);
	SortFile.sortFile(fileList,'ctime');
	for(var i=0;i<fileList.length;i++){
		Explorer.explorer(fileList[i].path, handle);
	}
}

moudule.exports = init();


