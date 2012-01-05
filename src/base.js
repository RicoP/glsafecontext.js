"use strict"; 

// var METHODS ... 
//= utils/glmethods

var checkType = {
	//OpenGL Type                      JS Types 
	"ArrayBuffer"          : checkType("null", "ArrayBuffer", "Float32Array", "Int32Array", "Array"), 
	"ArrayBufferView"      : checkType("null", "ArrayBuffer", "Float32Array", "Int32Array", "Array"), 
	"DOMString"            : checkType("null", "string"), 
	"FloatArray"           : checkType("null", "Float32Array", "Array"), 
	"GLbitfield"           : checkType("number"), 
	"GLboolean"            : checkType("boolean"),  
	"GLclampf"             : checkType("number"), 
	"GLenum"               : checkType("number"), 
	"GLfloat"              : checkType("number"), 
	"GLint"                : checkType("number"), 
	"GLintptr"             : checkType("number"), 
	"GLsizei"              : checkType("number"), 
	"GLsizeiptr"           : checkType("number"), 
	"GLuint"               : checkType("number"),
	"HTMLCanvasElement"    : checkType("null", "HTMLCanvasElement"),
	"HTMLImageElement"     : checkType("null", "HTMLImageElement"), 
	"HTMLVideoElement"     : checkType("null", "HTMLVideoElement"), 
	"ImageData"            : checkType("null", "ImageData"), 
	"Int32Array"           : checkType("null", "Int32Array", "Array"), 
	"WebGLBuffer"          : checkType("null", "WebGLBuffer"), 
	"WebGLFrameBuffer"     : checkType("null", "WebGLFrameBuffer"), 
	"WebGLProgram"         : checkType("null", "WebGLProgram"), 
	"WebGLRenderbuffer"    : checkType("null", "WebGLRenderbuffer"), 
	"WebGLShader"          : checkType("null", "WebGLShader"), 
	"WebGLTexture"         : checkType("null", "WebGLTexture"), 
	"WebGLUniformLocation" : checkType("null", "WebGLUniformLocation"), 
	"float"                : checkType("number"), 
	"long"                 : checkType("number") 
};

var checkValue = {
	//OpenGL Type            Way to check the correct value 
	"ArrayBuffer"          : isArrayBuffer,  
	"ArrayBufferView"      : isArrayBuffer, 
	"DOMString"            : ok, 
	"FloatArray"           : isFloatArray, 
	"GLbitfield"           : isInt, 
	"GLboolean"            : isBool, 
	"GLclampf"             : isClampf, 
	"GLenum"               : isInt, 
	"GLfloat"              : isFloat, 
	"GLint"                : isInt, 
	"GLintptr"             : isInt, 
	"GLsizei"              : isInt, 
	"GLsizeiptr"           : isInt, 
	"GLuint"               : isInt, 
	"HTMLCanvasElement"    : ok, 
	"HTMLImageElement"     : ok, 
	"HTMLVideoElement"     : ok, 
	"ImageData"            : ok, 
	"Int32Array"           : isInt32Array, 
	"WebGLBuffer"          : ok, 
	"WebGLFrameBuffer"     : ok, 
	"WebGLProgram"         : ok, 
	"WebGLRenderbuffer"    : ok, 
	"WebGLShader"          : ok, 
	"WebGLTexture"         : ok, 
	"WebGLUniformLocation" : ok, 
	"float"                : isFloat, 
	"long"                 : isInt
};

function saveContext (gl) { 
	var key, value, i, pair, savegl, map, keys; 

	keys = []; 

	for	(key in gl) {
		if(key === "getSaveContext") {
			continue; //ignore myself
		}
		keys.push(key); 
	}

	map = keys.map(function(key) {
		var val, type; 
		val = gl[key]; 
		type = typeof val; 

		if(type === "function") {
			return [key, createSaveCaller(gl, val, key)]; 
		}
	
		return [key]; 
	});

	savegl = { "isSaveContext" : true }; 

	//Add static properties. 
	for(i = 0; i != map.length; i++) {
		pair = map[i]; 
		key = pair[0]; 
		value = pair[1]; 
	
		if(value) {
			//override behaviour with my own function 
			savegl[key] = value; 
		} else {
			(function(key) { 
				//same behaviour as the original gl context. 
				Object.defineProperty(savegl, key, {
					get : function() { return gl[key]; }, 
					set : function(v) { gl[key] = v; }, 
					enumerable : true 
				}); 
			}(key)); 
		}
	}

	return savegl; 
}

function createSaveCaller (gl, func, funcname) {
	var glMethods = METHODS[funcname]; 
	if( !glMethods ) {
		console.warn("couldn't find reference definition for method " + funcname + "."); 
		//default behaviour
		return function() {
			return func.apply(gl, arguments); 	
		};
	}

	return function() {
		var funcDef = getFunctionDef(argumentsToArray(arguments), glMethods); 

		if(!funcDef) {
			throw new Error("couldn't apply arguments (" 
				+ argumentsToArray(arguments).join(", ") 
				+ ") to any of the possible schemas:\n" 
				+ glMethods.map(function(m) { 
					return "(" + m.args.map(function(arg) { return arg.type; }).join(", ") + ")" 
				  }).join("\n,") 
			); 
		}

		testArgumentValues(argumentsToArray(arguments), funcDef, funcname);
		
		//call original function 
		return func.apply(gl, arguments); 
	};
}

function argumentsToArray(args) {
	return Array.prototype.slice.call(args); 
}

function testArgumentValues(args, funcDef, funcname) {
	var arg, type, name, i; 
	//check Arguments 
	//check if type is correct
	for( i=0; i != args.length; i++) {
		arg = args[i]; 
		type = funcDef.args[i].type; 
		name = funcDef.args[i].name; 

		if(!checkValue[type](arg)) {
			throw new Error("Argument '" + name + "' in function '" + funcname + "' was expected to be of type '" + type + "' but instead was called with value: " + arg); 
		}
	}
}

function getFunctionDef(args, glMethods) {
		var args, glMethod, glType; 
		//get Correct reference function
		args = args.map(function(arg) { return arg; }); ; 

		return glMethods.filter(function(glMethod) {				
			if(glMethod.args.length !== args.length) { 
				return false; 
			} 

			var i = 0; 
			return glMethod.args.every(function(glarg) {
				var ret = checkType[glarg.type](args[i++]); 
				return ret; 
			});
		})[0]; //undefined for no matches 
}

// ~~~ Type checking methods ~~~  
function checkType() {
	var possibleTypes = argumentsToArray(arguments).map(function(type) { return type.toLowerCase(); });
	return function(value) {
		var valueType = toType(value); 
		return possibleTypes.some(function(type) { return valueType === type; }); 
	}
}

function ok() {
	//Value allready passed the typecheck and so the value is also correct. 
	return true; 
}

function isArrayBuffer(v) {
	return isFloatArray(v) || isInt32Array(v) || toType(v) === "arraybuffer" || toType(v) === "arraybufferview"; 
}

function isFloatArray(v) {
	var type = toType(v); 
	if(type === "float32array" || type === "floatarray") {
		return true;
	}

	if(type === "array") {
		for(var i = 0; i != v.length; i++) {
			if(!isFloat(v[i])) {
				return false; 
			}
		}
		return true; 
	}

	return false; 
}

function isInt32Array(v) {
	var type = toType(v); 
	if(type === "int32array") {
		return true; 
	}

	if(type === "array") {
		for(var i = 0; i != v.length; i++) {
			if(!isInt(v[i])) {
				return false; 
			}
		}
		return true; 
	}

	return false; 
}

function isString(v) {
	return v === null || typeof v === "string"; 
}

function isFloat(v) {
	return typeof v === "number"; 
}

function isInt(v) {
	return typeof v === "number" && v === ~~v; 
}

function isBool(v) {
	return v === true || v === false; 
}

function isClampf(v) {
	return isFloat(v) && v >= 0 && v <= 1; 
}

//Fixing typeof http://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/ 
function toType (obj) {
	return ({}).toString.call(obj).match(/\s([a-zA-Z0-9]+)/)[1].toLowerCase();
}
