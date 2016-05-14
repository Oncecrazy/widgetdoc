var util = require('util');
/**
 * [sortFile 对文件排序]
 * @param  {Array} filelist [文件信息数组]
 * @param  {string} type     [排序方式]
 */
function sortFile(filelist, type) {
	var sortFun;
	type = type || 'ctime';
	switch (type) {
		case 'ctime':
			sortFun = sortByCtime;
			break;
		case 'mtime':
			sortFun = sortByMtime;
			break;
		case 'size':
			sortFun = sortBySize;
			break;
	}
	filelist.sort(sortFun); //从小到大排序
}
/**
 * [sortByCtime 按照创建时间排序]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function sortByCtime(a,b){
	var ctime1 = a.stats.birthtime ,
		ctime2 = b.stats.birthtime ;
	return ctime1>ctime2? 1:-1;
}

/**
 * [sortByMtime 按照修改时间排序]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function sortByMtime(a,b){
	var mtime1 = a.stats.mtime,
		mtime2 = b.stats.mtime;
	return mtime1>mtime2 ? 1:-1;
}

/**
 * [sortByctime 按照修改时间排序]
 * @param  {[type]} a [description]
 * @param  {[type]} b [description]
 * @return {[type]}   [description]
 */
function sortBySize(a,b){
	var size1 = a.stats.size,
		size2 = b.stats.size;
	return size1>size2 ? 1:-1;
}

module.exports = sortFile;