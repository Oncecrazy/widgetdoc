/*//加载并解析文件
var realPath = process.cwd() + "/public/components/src";
var JsdocParse = require("./jsdocParse");
var explorer = require('./explorer');
var grabFile = require('./grabfile');
var sortFile = require('./sortfile');

//设置全部变量components保存解析数据
global.components = [];

var handle = function(file){
	global.components.push(JsdocParse.parse(file));
}

function init(){
	var fileList = grabFile(realPath);
	sortFile(fileList,'ctime');
	for(var i=0;i<fileList.length;i++){
		explorer(fileList[i].path, handle);
	}
}
*/


var explorer = require('./explorer');
var fs = require('fs');
var parse = require("./parse");

//设置全部变量config保存配置数据
global.config = JSON.parse(fs.readFileSync(process.cwd() + "/config.json","utf-8"));
//设置全部变量components保存解析数据
global.components = [];

function init(){
	var path = process.cwd() + "/components/",
		name, list;

	for(var item in config){
		name = config[item].name;
		list = config[item].list;
		for(var i=0,len = list.length; i<len; i++){
			(function(item, name, list, i){
				explorer(path + item + '/'+ list[i].name +"/js", list[i].name + '.js' , function(file){
					var data = fs.readFile(file, "utf-8", function(err, data){
						if(err){
							console.log('readfile', file);
		                    console.log('readfile', err.message);
		                    process.exit(1);
						}
						var component = parse(item, name, list[i].name, data) || {};
						component.usecases = list[i].usecases;
						global.components.push(component);
					});
				});

			})(item, name, list, i);
		}
	}
}


module.exports = init;


