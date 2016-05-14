var express = require('express');
var router = express.Router();


router.get(['/'], function(req, res) {
	var data = {
			title:"组件文档",
			components:{}
		};
	for(var item in config){
		data.components[item] = {
			name:config[item].name,
			list:[]
		};
		for(var i=0,len=components.length; i<len; i++){
			if(item === components[i].category.id){
				data.components[item].list.push({
					name: components[i].name,
					description : components[i].description
				});
			}
		}
	}
	res.render('index', data);
});

module.exports = router;
