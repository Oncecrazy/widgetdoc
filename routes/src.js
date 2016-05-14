var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get(['/:cate/:name'], function(req, res) {
    var cate = req.params.cate;
    var name = req.params.name;
    var realPath = process.cwd() + "/components/"+ cate + '/' + name + '/js/'+ name +'.js';
    fs.exists(realPath, function (exists) {
        if (!exists) {
            res.writeHead(404, {'Content-Type': 'text/plain'});
            res.write("This Component: " + name + " was not found on this server.");
            res.end();
        } else {
            var data = {};
            data.cate = cate;
            data.name = name;
            data.code = fs.readFileSync(realPath,"utf-8");
            data.title = name +"源代码";
            res.render('src', data);
        }
    });
});

module.exports = router;
