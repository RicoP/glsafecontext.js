if(window["WebGLRenderingContext"]) {
	window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
	(function (){
		//= base.js
		return function() { return saveContext(this); }; 
	}()); 
}

