if(window["WebGLRenderingContext"]) {
	window["WebGLRenderingContext"]["prototype"]["getSaveContext"] = 
	(function (){
		//= base.js
		return function(option) { return saveContext(this, option); }; 
	}()); 
}

