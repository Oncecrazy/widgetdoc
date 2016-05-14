var fs = require('fs');  
  
/**
 * �ݹ鴦���ļ�,�ļ��� 
 * path ·�� 
 * handleFile �ļ�������  
*/  
function explorer(path, filelist, handleFile) {  
    if(typeof filelist ==='function'){
        handleFile = filelist;
        filelist = null;
    }
    fs.readdir(path, function(err, files) {  
        if (err) {  
        	console.log('read dir:'+path +' error');
            return;  
        } else {  
            files.forEach(function(file) {  
                var tmpPath = path + '/' + file;  
                fs.stat(tmpPath, function(err1, stats) {  
                    if (err1) {  
                        console.log('stat error'); 
                        return; 
                    } else {  
                        if (stats.isDirectory()) {  
                            explorer(tmpPath, filelist, handleFile);  
                        } else {  
                            if(filelist){
                                filelist === file && handleFile(tmpPath);;
                            }else{
                                handleFile(tmpPath);
                            }
                        }  
                    }  
                })  
            });  
        }  
    }); 
} 

/*function explorer(path, handleFile) {  
    fs.stat(path, function(err1, stats) {  
        if (err1) {  
            console.log('stat error'); 
            return; 
        } else {  
            if (stats.isDirectory()) {  
                explorer(path, handleFile);  
            } else {  
                handleFile(path);  
            }  
        }  
    });
}  */


  
module.exports = explorer;  