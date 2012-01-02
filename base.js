if(window["WebGLRenderingContext"]) {
window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
(function (){
	"use strict"; 

	// var METHODS ... 
	//= utils/glmethods
	var checkType = {
		"ArrayBufferView" : checkType("ArrayBuffer", "Float32Array", "Int32Array", "Array"), 
		"ArrayBuffer" : checkType("ArrayBuffer", "Float32Array", "Int32Array", "Array"), 
		"WebGLBuffer" : checkType("WebGLBuffer"), 
		"WebGLFrameBuffer" : checkType("WebGLFrameBuffer"), 
		"WebGLProgram" : checkType("WebGLProgram"), 
		"WebGLRenderbuffer" : checkType("WebGLRenderbuffer"), 
		"WebGLShader" : checkType("WebGLShader"), 
		"WebGLTexture" : checkType("WebGLTexture"), 
		"WebGLUniformLocation" : checkType("WebGLUniformLocation"), 
		"FloatArray" : checkType("Float32Array"), 
		"Int32Array" : checkType("Int32Array"), 
		"DOMString" : checkType("string"), 
	    "GLbitfield" : checkType("number"), 
		"GLboolean" : checkType("boolean"),  
		"GLclampf" : checkType("number"), 
		"GLenum" :  checkType("number"), 
		"GLfloat" : checkType("number"), 
		"GLint" : checkType("number"), 
		"GLintptr" : checkType("number"), 
		"GLsizei" : checkType("number"), 
		"GLsizeiptr" : checkType("number"), 
		"GLuint" : checkType("number") 
	};

	var checkValue = {
		"ArrayBufferView" : ok,
		"ArrayBuffer" : ok,
		"WebGLBuffer" : ok, 
		"WebGLFrameBuffer" : ok, 
		"WebGLProgram" : ok, 
		"WebGLRenderbuffer" : ok, 
		"WebGLShader" : ok, 
		"WebGLTexture" : ok, 
		"WebGLUniformLocation" : ok, 
		"FloatArray" : ok, 
		"Int32Array" : ok, 
		"DOMString" : ok, 
	    "GLbitfield" : isInt, 
		"GLboolean" : isBool, 
		"GLclampf" : isClampf, 
		"GLenum" : isInt, 
		"GLfloat" : isFloat, 
		"GLint" : isInt, 
		"GLintptr" : isInt, 
		"GLsizei" : isInt, 
		"GLsizeiptr" : isInt, 
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

			if(type === "function") {
				return [k, createSaveCaller(gl, val, k)]; 
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
			var i, argTypes, ret, funcDef; 

			funcDef = getFunctionDef(arguments, glMethods); 

			if(!funcDef) {
				throw new Error("couldn't apply arguments (" + argumentsToString(arguments) + ") to any of the possible schemas." + glMethods.map(function(m) { return "(" + m.argsStructure.toString() + ")" })); 
			}

			testArgumentValues(arguments, funcDef, funcname);
			
			//call original function 
			return func.apply(gl, arguments); 
		};
	}

	function argumentsToString(args) {
		var l = []; 
		for(var i = 0; i != args.length; i++ ) {
			l.push(args[i]); 
		}
		return l; 
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
				throw new Error("Argument '" + name + "' in function " + funcname + " was expected to be '" + type + "' but instead was called with value " + arg  + "."); 
			}
		}
	}

	function getFunctionDef(args, glMethods) {
			var argTypes, glMethod, glType, i, j; 
			//get Correct reference function
			argTypes = []; 

			for( i = 0; i != args.length; i++ ) {
				argTypes[i] = toType( args[i] ); 
			}

			checkMethodsLoop: 
			for( i = 0; i != glMethods.length; i++ ) {
				glMethod = glMethods[i]; 

				if(glMethod.args.length !== args.length) {
					continue; 
				}
			
				for( j = 0; j != args.length; j++ ) {
					glType = glMethod.args[j].type; 

					if(!checkType[glType](args[j])) {
						continue checkMethodsLoop; 
					}
				}

				return glMethod; 
			}

			return null; 
	}

	// ~~~ Type checking methods ~~~  
	function checkType() {	
		var types = arguments; 	
		return function(v) {
			for(var i = 0; i != types.length; i++) {
				if(v === null || toType(v) === types[i].toLowerCase()) {
					return true; 
				} 
			}
			return false; 
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

