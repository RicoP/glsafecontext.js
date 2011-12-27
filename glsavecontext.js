if(window["WebGLRenderingContext"]) {
window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
(function (){
	"use strict"; 

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
		return function() {
			var i, arg; 
			//check Arguments 
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

