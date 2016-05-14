var ANNOTATION_RE = /\/\*(\s|.)*?\*\//g;
var FILEOVERVIEW_RE = /@fileOverview\s+([^\*]+)/g;
var AUTHOR_RE = /@author\s+([^\*]+)/g;
var SEE_RE = /@see\s+([^\*]+)/g;
var EXAMPLE_RE = /@example\s+([^\*]+)/g;
var DESCRIPTION_RE = /@description\s+([^\*]+)/g;
var IMPL_RE = /@impl\s+[^\*]+/;
var EXT_RE = /@ext\s+[^\*]+/;
var TYPE_RE = /@type\s+[^\*]+/;
var RETURN_RE = /@return\s+[^\*]+/;
var RETURN_DETAIL_RE = /@return\s+{(\w+)}\s+(.+)[^\*]+/g;
var PARAM_RE = /@param\s+[^\*]+/g;
var PARAM_DETAIL_RE = /@param\s+{(\w+)}\s+(\w+)\s+\[(.*)\]/;
var DEFINE_RE = /\[(\w+)\s+([^\]]+)\]/;

function firstUpCase(str){
	return str.replace(str.charAt(0), str.charAt(0).toUpperCase());
}

function readAnnotation(data){
    var m = data.match(ANNOTATION_RE);
    return m ? m : [];
}

function parse(id, name, filename, data){
	var annotations = readAnnotation(data);
	var component = {
		category : {id:id, name:name},
		name: firstUpCase(filename),
		attributes:[],
		methods:[]
	};

	for(var i=0,len = annotations.length; i<len; i++){
		if(FILEOVERVIEW_RE.test(annotations[i])){
			component.fileOverview = RegExp.$1;
		}
		if(AUTHOR_RE.test(annotations[i])){
			component.author = RegExp.$1;
		}
		if(SEE_RE.test(annotations[i])){
			component.see = RegExp.$1;
		}
		if(EXAMPLE_RE.test(annotations[i])){
			component.example = RegExp.$1;
		}

		if(new RegExp(component.name).test(annotations[i])){
			var m = annotations[i].match(DESCRIPTION_RE);
			component.description = m ? m[0] : '';
			m = annotations[i].match(IMPL_RE);
			component.impl = m ? m[0] : '';
			m = annotations[i].match(EXT_RE);
			component.ext = m ? m[0] : '';
		}

		if(TYPE_RE.test(annotations[i])){
			var attribute = {};
			annotations[i].match(DEFINE_RE);
			attribute.name = RegExp.$1;
			attribute.description = RegExp.$2;
			attribute.type = annotations[i].match(TYPE_RE)[0];
			component.attributes.push(attribute);
		}

		if(RETURN_RE.test(annotations[i])){
			var method = {}, params = null, rtn = null;
			annotations[i].match(DEFINE_RE);
			method.name = RegExp.$1;
			method.description = RegExp.$2;
			
			method.parameters = [];
			if(params = annotations[i].match(PARAM_RE)){
				for(var j=0,len=params.length; j<len; j++){
					params[j].match(PARAM_DETAIL_RE);
					method.parameters.push({
						type : RegExp.$1,
						name : RegExp.$2,
						description : RegExp.$3
					});
				}
			}

			annotations[i].match(RETURN_DETAIL_RE);
			method.res = {
				type : RegExp.$1,
				description : RegExp.$2
			};

			component.methods.push(method);

		}

	};

	//console.log('8888', component);

	return component;
}




module.exports = parse;