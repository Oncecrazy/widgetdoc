var EOL = process.platform ==='win32'? '\r\n': '\n';

var ANNOTATION_RE = /\/\*\*(\s|.)*?\*\//g;
var ANNOTATION_INNER_RE = /\/\*\*([\s\S]*)?\*\//;
var PRIVATE_RE = /@private\s+[^\*]+/;
var FILEOVERVIEW_RE = /@fileOverview\s+([^\*]+)/g;
var AUTHOR_RE = /@author\s+([^\*]+)/g;
var SEE_RE = /@see\s+([^\*]+)/g;
var EXAMPLE_RE = /@example\s+([^\*]+)/g;
var EXAMPLE_INNER_RE = /@example\s+([\s\S]*)[^@]/;

var DESCRIPTION_RE = /@description\s+([^\*]+)/g;
var IMPLEMENT_RE = /@implement\s+([^\*]+)/;
var EXTENDS_RE = /@extends\s+(\w+)+/;
var TYPE_RE = /@type\s+{\s*(\w+)\s*}/;
var RETURN_RE = /@return\s+[^\*]+/;
var RETURN_DETAIL_RE = /@return\s+{\s*(\w+)\s*}\s+(.+)[^\*]+/g;
var PARAM_RE = /@param\s+[^\*]+/g;
var PARAM_DETAIL_RE = /@param\s+{\s*(\w+)\s*}\s+(\w+)\s+(.*)/;
var DEFINE_RE = /\[(\w+)\s+([^\]]+)\]/;


function firstUpperCase(str){
	return str.replace(str.charAt(0), str.charAt(0).toUpperCase());
}

function readAnnotation(data){
    var m = data.match(ANNOTATION_RE);
    return m ? m : [];
}

function parse(id, name, filename, data){
	var annotations = readAnnotation(data),
		component = {
			category : {id:id, name:name},
			name: filename,
			attributes:[],
			methods:[]
		}, annotation = '';
	for(var i=0,len = annotations.length; i<len; i++){

		annotations[i].match(ANNOTATION_INNER_RE);
		annotation = RegExp.$1;
 
		if(PRIVATE_RE.test(annotation)){
			continue;
		}
		if(FILEOVERVIEW_RE.test(annotation)){
			component.fileOverview = RegExp.$1;
		}
		if(AUTHOR_RE.test(annotation)){
			component.author = RegExp.$1;
		}
		if(SEE_RE.test(annotation)){
			component.see = RegExp.$1;
		}
		if(EXAMPLE_RE.test(annotation)){
			annotation.match(EXAMPLE_INNER_RE);
			component.example  = RegExp.$1;
			component.example = component.example.replace(new RegExp('(' + EOL + ')\\s*\\*','g'),'$1');
		}

		if(new RegExp('\\[\\s*\\b'+ component.name + '\\b').test(annotation)){
			annotation.match(DESCRIPTION_RE);
			component.description = RegExp.$1;
			annotation.match(IMPLEMENT_RE);
			component.impl = RegExp.$1;
			annotation.match(EXTENDS_RE);
			component.ext =  RegExp.$1;
		}

		
		if(TYPE_RE.test(annotation)){
			var attribute = {};
			attribute.type = RegExp.$1;
			annotation.match(DEFINE_RE);
			attribute.name = RegExp.$1;
			attribute.description = RegExp.$2;
			component.attributes.push(attribute);
		}

		if(RETURN_RE.test(annotation)){
			var method = {}, params = null, rtn = null;
			annotation.match(DEFINE_RE);
			method.name = RegExp.$1;
			method.description = RegExp.$2;
			
			method.parameters = [];
			if(params = annotation.match(PARAM_RE)){
				for(var j=0,paramsLen=params.length; j<paramsLen; j++){
					params[j].match(PARAM_DETAIL_RE);
					method.parameters.push({
						type : RegExp.$1,
						name : RegExp.$2,
						description : RegExp.$3
					});
				}
			}

			annotation.match(RETURN_DETAIL_RE);
			method.res = {
				type : RegExp.$1,
				description : RegExp.$2
			};

			component.methods.push(method);
		}
	};
	return component;
}

module.exports = parse;