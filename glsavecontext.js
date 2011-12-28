if(window["WebGLRenderingContext"]) {
window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
(function (){
	"use strict"; 
	/* This is autogenerated. Don't eddit by hand. */
	var METHODS = [{"name":"getContextAttributes","length":0},{"name":"isContextLost","length":0},{"name":"getSupportedExtensions","length":0},{"name":"getExtension","length":1},{"name":"activeTexture","length":1},{"name":"attachShader","length":2},{"name":"bindAttribLocation","length":3},{"name":"bindBuffer","length":2},{"name":"bindFramebuffer","length":2},{"name":"bindRenderbuffer","length":2},{"name":"bindTexture","length":2},{"name":"blendColor","length":4},{"name":"blendEquation","length":1},{"name":"blendEquationSeparate","length":2},{"name":"blendFunc","length":2},{"name":"blendFuncSeparate","length":4},{"name":"bufferData","length":3},{"name":"bufferData","length":3},{"name":"bufferData","length":3},{"name":"bufferSubData","length":3},{"name":"bufferSubData","length":3},{"name":"checkFramebufferStatus","length":1},{"name":"clear","length":1},{"name":"clearColor","length":4},{"name":"clearDepth","length":1},{"name":"clearStencil","length":1},{"name":"colorMask","length":4},{"name":"compileShader","length":1},{"name":"copyTexImage2D","length":8},{"name":"copyTexSubImage2D","length":8},{"name":"createBuffer","length":0},{"name":"createFramebuffer","length":0},{"name":"createProgram","length":0},{"name":"createRenderbuffer","length":0},{"name":"createShader","length":1},{"name":"createTexture","length":0},{"name":"cullFace","length":1},{"name":"deleteBuffer","length":1},{"name":"deleteFramebuffer","length":1},{"name":"deleteProgram","length":1},{"name":"deleteRenderbuffer","length":1},{"name":"deleteShader","length":1},{"name":"deleteTexture","length":1},{"name":"depthFunc","length":1},{"name":"depthMask","length":1},{"name":"depthRange","length":2},{"name":"detachShader","length":2},{"name":"disable","length":1},{"name":"disableVertexAttribArray","length":1},{"name":"drawArrays","length":3},{"name":"drawElements","length":4},{"name":"enable","length":1},{"name":"enableVertexAttribArray","length":1},{"name":"finish","length":0},{"name":"flush","length":0},{"name":"framebufferRenderbuffer","length":4},{"name":"framebufferTexture2D","length":5},{"name":"frontFace","length":1},{"name":"generateMipmap","length":1},{"name":"getActiveAttrib","length":2},{"name":"getActiveUniform","length":2},{"name":"getAttachedShaders","length":1},{"name":"getAttribLocation","length":2},{"name":"getParameter","length":1},{"name":"getBufferParameter","length":2},{"name":"getError","length":0},{"name":"getFramebufferAttachmentParameter","length":3},{"name":"getProgramParameter","length":2},{"name":"getProgramInfoLog","length":1},{"name":"getRenderbufferParameter","length":2},{"name":"getShaderParameter","length":2},{"name":"getShaderInfoLog","length":1},{"name":"getShaderSource","length":1},{"name":"getTexParameter","length":2},{"name":"getUniform","length":2},{"name":"getUniformLocation","length":2},{"name":"getVertexAttrib","length":2},{"name":"getVertexAttribOffset","length":2},{"name":"hint","length":2},{"name":"isBuffer","length":1},{"name":"isEnabled","length":1},{"name":"isFramebuffer","length":1},{"name":"isProgram","length":1},{"name":"isRenderbuffer","length":1},{"name":"isShader","length":1},{"name":"isTexture","length":1},{"name":"lineWidth","length":1},{"name":"linkProgram","length":1},{"name":"pixelStorei","length":2},{"name":"polygonOffset","length":2},{"name":"readPixels","length":7},{"name":"renderbufferStorage","length":4},{"name":"sampleCoverage","length":2},{"name":"scissor","length":4},{"name":"shaderSource","length":2},{"name":"stencilFunc","length":3},{"name":"stencilFuncSeparate","length":4},{"name":"stencilMask","length":1},{"name":"stencilMaskSeparate","length":2},{"name":"stencilOp","length":3},{"name":"stencilOpSeparate","length":4},{"name":"texImage2D","length":9},{"name":"texImage2D","length":6},{"name":"texImage2D","length":6},{"name":"texImage2D","length":6},{"name":"texImage2D","length":6},{"name":"texParameterf","length":3},{"name":"texParameteri","length":3},{"name":"texSubImage2D","length":9},{"name":"texSubImage2D","length":7},{"name":"texSubImage2D","length":7},{"name":"texSubImage2D","length":7},{"name":"texSubImage2D","length":7},{"name":"uniform1f","length":2},{"name":"uniform1fv","length":2},{"name":"uniform1fv","length":2},{"name":"uniform1i","length":2},{"name":"uniform1iv","length":2},{"name":"uniform1iv","length":2},{"name":"uniform2f","length":3},{"name":"uniform2fv","length":2},{"name":"uniform2fv","length":2},{"name":"uniform2i","length":3},{"name":"uniform2iv","length":2},{"name":"uniform2iv","length":2},{"name":"uniform3f","length":4},{"name":"uniform3fv","length":2},{"name":"uniform3fv","length":2},{"name":"uniform3i","length":4},{"name":"uniform3iv","length":2},{"name":"uniform3iv","length":2},{"name":"uniform4f","length":5},{"name":"uniform4fv","length":2},{"name":"uniform4fv","length":2},{"name":"uniform4i","length":5},{"name":"uniform4iv","length":2},{"name":"uniform4iv","length":2},{"name":"uniformMatrix2fv","length":3},{"name":"uniformMatrix2fv","length":3},{"name":"uniformMatrix3fv","length":3},{"name":"uniformMatrix3fv","length":3},{"name":"uniformMatrix4fv","length":3},{"name":"uniformMatrix4fv","length":3},{"name":"useProgram","length":1},{"name":"validateProgram","length":1},{"name":"vertexAttrib1f","length":2},{"name":"vertexAttrib1fv","length":2},{"name":"vertexAttrib1fv","length":2},{"name":"vertexAttrib2f","length":3},{"name":"vertexAttrib2fv","length":2},{"name":"vertexAttrib2fv","length":2},{"name":"vertexAttrib3f","length":4},{"name":"vertexAttrib3fv","length":2},{"name":"vertexAttrib3fv","length":2},{"name":"vertexAttrib4f","length":5},{"name":"vertexAttrib4fv","length":2},{"name":"vertexAttrib4fv","length":2},{"name":"vertexAttribPointer","length":6},{"name":"viewport","length":4}];
	

	var UNKNOWN = -1; 

	return function() { return safeContext(this); };  

	function safeContext (gl) { 
		var key, value, i, pair, safegl, map, keys; 

		keys = []; 

		for	(key in gl) {
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
		var requiredLength, referenceFuncDef; 
		//check Length			
		referenceFuncDef = METHODS.filter(function(f) { return f.name === funcname; })[0];
		if( !referenceFuncDef ) {
			requiredLength = UNKNOWN; 
			console.warn("glSaveContext.js: couldn't find reference definition for method " + funcname + "."); 
		} else {
			requiredLength = referenceFuncDef.length; 
		}		

		return function() {
			var i, arg; 
			//check Arguments 
			//check Length			
			if(requiredLength !== UNKNOWN && requiredLength !== arguments.length) {
				throw new Error("function " + funcname + " was called with the wrong amount of arguments. " + arguments.length + " instead of " + requiredLength + "."); 
			}
			
			//check type is undefined
			for( i=0; i != arguments.length; i++) {
				arg = arguments[i]; 
				if( arg === undefined ) {
					throw new Error("Argument number " + i + " in function " + funcname + " must not be " + arg + "!"); 
				}
			}
			//call original function 
			return func.apply(gl, arguments); 	
		};
	} 
}()); 
}


