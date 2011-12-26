if(window["WebGLRenderingContext"]) {
window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
(function (){
	"use strict"; 

	//this properties hae a special behaviour and should handled differrently than the other properties. 
	var blacklist = [
		"drawingBufferHeight", //getter returns the current canvas height.
		"canvas", //should never change but better safe than sorry. 
		"drawingBufferWidth", //getter returns the current canvas width.
		"getSaveContext" //because I add this funtion to the WebGL prototype I also should ignore that one. 
	];

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

			if(blacklist.indexOf(k) !== -1) {
				return null; 
			}
			if(type === "number") {
				return [k, val]; 
			}				
			if(type === "function") {
				return [k, createSafeCaller(gl, val, k)]; 
			}
			throw new Error("unreachable!"); 
		}).filter(function(pair) { 
			return pair; //filter only non null pairs. 
		});

		safegl = Object.create(window["WebGLRenderingContext"]); 

		//Add static properties. 
		for(i = 0; i != map.length; i++) {
			pair = map[i]; 
			key = pair[0]; 
			value = pair[1]; 
			(function (value) {
				Object.defineProperty(safegl, key, {
					get : function() { return value; },
					enumerable : true
				}); 			
			}(value)); 
		}

		//Add dynamic properties
		for(i = 0; i != blacklist.length; i++) {
			key = blacklist[i]; 
			(function (key) { 
				Object.defineProperty(safegl, key, {
					get : function() { return gl[key]; },
					enumerable : true
				}); 
			}(key)); 
		}

		return safegl; 
	}

	function createSafeCaller (gl, func, funcname) {
		return function() {
			var i, arg; 
			//check Arguments 
			for( i=0; i != arguments.length; i++) {
				arg = arguments[i]; 
				if( arg === undefined || arg === null ) {
					throw new Error("Argument number " + i + " in function " + funcname + " must not be " + arg + "!"); 
				}
			}
			//call original function 
			func.apply(gl, arguments); 	
		};
	} 
}()); 
}

