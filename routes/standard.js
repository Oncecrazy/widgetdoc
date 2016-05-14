var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
	var data = {
			title:"开发规范"
		};
	res.render('standard', data);
});

router.get('/html_css_code_guide.html', function(req, res) {
	var data = {
			title:"HTML/CSS开发规范"
		};
	res.render('guide/html_css_code_guide', data);
});

router.get('/js_code_guide.html', function(req, res) {
	var data = {
			title:"JavaScript开发规范"
		};
	res.render('guide/js_code_guide', data);
});

module.exports = router;
