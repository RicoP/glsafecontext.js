if(window["WebGLRenderingContext"]) {
window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
(function (){
	"use strict"; 

	// var METHODS ... 
	//= utils/glmethods

	var typeChecker = {
		"ArrayBufferView" : isArrayBuffer,
		"ArrayBuffer" : isArrayBuffer,
		"WebGLBuffer" : checkType("WebGLBuffer"), 
		"WebGLFrameBuffer" : checkType("WebGLFrameBuffer"), 
		"WebGLProgram" : checkType("WebGLProgram"), 
		"WebGLRenderbuffer" : checkType("WebGLRenderbuffer"), 
		"WebGLShader" : checkType("WebGLShader"), 
		"WebGLTexture" : checkType("WebGLTexture"), 
		"WebGLUniformLocation" : checkType("WebGLUniformLocation"), 
		"FloatArray" : isFloatArray, 
		"Int32Array" : isInt32Array, 
		"DOMString" : isString, 
	    "GLbitfield" : isInt, 
		"GLboolean" : isBool, 
		"GLclampf" : isClampf, 
		"GLenum" : isInt, 
		"GLfloat" : isFloat, 
		"GLint" : isInt, 
		"GLintptr" : isInt, 
		"GLsizei" : isInt, 
		"GLsizeiptr" : isSizeiptr, 
		"GLuint" : isInt
	};

	return function() { return safeContext(this); };  

	function safeContext (gl) { 
		var key, value, i, pair, safegl, map, keys; 

		keys = []; 

		for	(key in gl) {
			if(key === "getSaveContext") {
				continue; //ignore myself
			}
			keys.push(key); 
		}

		map = keys.map(function(k) {
			var val, type; 
			val = gl[k]; 
			type = typeof val; 

			if(type === "function") {
				return [k, createSafeCaller(gl, val, k)]; 
			}
			return [k]; 
		});

		safegl = {}; 

		//Add static properties. 
		for(i = 0; i != map.length; i++) {
			pair = map[i]; 
			key = pair[0]; 
			value = pair[1]; 
		
			if(typeof value === "function") {
				//override behaviour with my own function 
				safegl[key] = value; 
			} else {
				(function(key) { 
					//same behaviour as the original gl context. 
					Object.defineProperty(safegl, key, {
						get : function() { return gl[key]; }, 
						set : function(v) { gl[key] = v; }, 
						enumerable : true 
					}); 
				}(key)); 
			}
		}

		return safegl; 
	}

	function createSafeCaller (gl, func, funcname) {
		var referenceFuncDef = METHODS[funcname]; 
		if( !referenceFuncDef ) {
			console.warn("glSaveContext.js: couldn't find reference definition for method " + funcname + "."); 
			//default behaviour
			return function() {
				return func.apply(gl, arguments); 	
			};
		}

		return function() {
			var i, arg, ret, type, name; 
			//check Arguments 
			//check Length			
			if(referenceFuncDef.args.length !== arguments.length) {
				throw new Error("function " + funcname + " was called with the wrong amount of arguments. " + arguments.length + " instead of " + referenceFuncDef.args.length + "."); 
			}
			
			//check if type is undefined
			for( i=0; i != arguments.length; i++) {
				arg = arguments[i]; 
				type = referenceFuncDef.args[i].type; 
				name = referenceFuncDef.args[i].name; 

				if(!typeChecker[type](arg)) {
					throw new Error("Argument " + name + " in function " + funcname + " was expected to be " + type + " but instead was called with " + arg  + "."); 
				}
			}
			//call original function 
			ret = func.apply(gl, arguments); 

			//TODO Test return value. 

			return ret;
		};
	}

	// ~~~ Type checking methods ~~~  
	function checkType(type) {
		return function(v) {
			return v === null || toType(v) === type.toLowerCase(); 
		}
	}

	function isArrayBuffer(v) {
		return isFloatArray(v) || isInt32Array(v) || toType(v) === "arraybuffer" || toType(v) === "arraybufferview"; 
	}

	function isFloatArray(v) {
		if(toType(v) === "floatarray" || toType(v) === "float32array") 
			return true;

		if(toType(v) === "array") {
			for(var i = 0; i != v.length; i++) {
				if(!isFloat(v)) {
					return false; 
				}
			}
			return true; 
		}

		return false; 
	}
	
	function isInt32Array(v) {
		if(toType(v) === "int32array") 
			return true; 

		if(toType(v) === "array") {
			for(var i = 0; i != v.length; i++) {
				if(!isInt(v)) {
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
		return typeof v === "number" && v === (~~v); 
	}

	function isSizeiptr(v) {
		return isInt(v) || isArrayBuffer(v); 
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

}()); 
}

