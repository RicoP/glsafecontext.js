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

	return function() { return saveContext(this); };  

	function saveContext (gl) { 
		var key, value, i, pair, savegl, map, keys; 

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

			//HACK: texImage2D overloads are much diverse. 
			if(type === "function" && k !== "texImage2D") {
				return [k, createSaveCaller(gl, val, k)]; 
			}

			if(k === "texImage2D") {
				return [k, function() { val.apply(gl, arguments); }]; 
			}
			
			return [k]; 
		});

		savegl = { "isSaveContext" : true }; 

		//Add static properties. 
		for(i = 0; i != map.length; i++) {
			pair = map[i]; 
			key = pair[0]; 
			value = pair[1]; 
		
			if(typeof value === "function") {
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
			var i, arg, argTypes, ret, type, name, funcDef; 

			argTypes = []; 
			//get Correct reference function
			
			for( i = 0; i != arguments.length; i++ ) {
				argTypes[i] = toType( arguments[i] ); 
			}

			for( i = 0; i != glMethods.length; i++ ) {
				if(glMethods[i].argsStructure.toString() === argTypes.toString()) {
					funcDef = glMethods[i]; 
				}
			}

			if(!funcDef) {
				throw new Error("couldn't apply arguments (" + argTypes.toString() + ") to any of the possible schemas."); 
			}

			//check Arguments 
			//check if type is correct
			for( i=0; i != arguments.length; i++) {
				arg = arguments[i]; 
				type = funcDef.args[i].type; 
				name = funcDef.args[i].name; 

				if(!typeChecker[type](arg)) {
					throw new Error("Argument '" + name + "' in function " + funcname + " was expected to be '" + type + "' but instead was called with value " + arg  + "."); 
				}
			}

			//call original function 
			return func.apply(gl, arguments); 
		};
	}

	// ~~~ Type checking methods ~~~  
	function checkType(type) {
		var lowerType = type.toLowerCase(); 
		return function(v) {
			return v === null || toType(v) === lowerType; 
		}
	}

	function isArrayBuffer(v) {
		return isFloatArray(v) || isInt32Array(v) || toType(v) === "arraybuffer" || toType(v) === "arraybufferview"; 
	}

	function isFloatArray(v) {
		if(toType(v) === "float32array" || toType(v) === "floatarray") {
			return true;
		}

		if(toType(v) === "array") {
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
		if(toType(v) === "int32array") {
			return true; 
		}

		if(toType(v) === "array") {
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

