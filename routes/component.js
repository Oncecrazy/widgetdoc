var express = require('express');
var router = express.Router();

router.get(['/:cate/:name.html'], function(req, res) {
    var cate = req.params.cate;
    var name = req.params.name;
    var component = null;

    for(var i=0;i<components.length;i++){
        if(components[i].name === name){
            component = components[i];
        }
    }

    if(component){
        /*var grabFile = require('../grabfile');
        var sortFile = require('../sortfile');
        var realPath = process.cwd() + "/public/components/demos/"+ name;
        console.log(realPath);
        var fileList = GrabFile.grabFile(realPath);
        console.log(fileList);
        SortFile.sortFile(fileList,'ctime');*/
        component.title = name + '组件';
        res.render('component', component);
        
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.write("This Component: " + name + " was not found on this server.");
        res.end();
    }
});

module.exports = router;
