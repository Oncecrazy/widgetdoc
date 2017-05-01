var express = require('express');
var path = require('path');
var routes = require('./routes');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');

var fs = require('fs');
var accessLog = fs.createWriteStream('access.log', {flags: 'a'});
var errorLog = fs.createWriteStream('error.log', {flags: 'a'});

var index = require('./routes/index');
var component = require('./routes/component');
var src = require('./routes/src');
var standard = require('./routes/standard');


var app = express();

// all environments
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(logger('combined', {stream: accessLog}));
app.use(compression());    //启用压缩
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


var oneYear = 86400000*365;
app.use('/static', express.static(path.join(__dirname, 'public'),{maxAge: oneYear}));

app.use('/demos', express.static(path.join(__dirname, 'components')));

app.use('/', index);
app.use('/component', component);
app.use('/src', src);
app.use('/standard', standard);

app.use(function(req, res, next) {
  res.status(404).render('404');
});

// error handlers
app.use(function (err, req, res, next) {
    var meta = '[' + new Date() + '] ' + req.url + '\n';
    errorLog.write(meta + err.stack + '\n');
    next();
});


//初始化操作
var init = require('./init');
init();

if(!module.parent){
    //直接调用node app.js服务器会直接运行，但在其他模块中调用require('./app') 
    //则不会自动启动，需要再显式地调用 listen() 函数。
    app.listen(8090, function(){
        console.log("Components Server Start, Listen on 8090!");
    });
}

module.exports = app;

