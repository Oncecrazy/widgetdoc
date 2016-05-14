var fs = require('fs'),
	fileList = [];

function grabFile(path) {
	var dirList = fs.readdirSync(path);
	dirList.forEach(function(item) {
		var tmpPath = path + '/' + item;
		var stats = fs.statSync(tmpPath);
		if (stats.isDirectory()) {
			grabFile(tmpPath);
		} else {
			var fileinfo = {};
			fileinfo.path = tmpPath;
			fileinfo.name = item;
			fileinfo.stats = stats;
			fileList.push(fileinfo);
		}
	});
	return fileList;
}
module.exports = grabFile;