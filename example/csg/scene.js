/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/* 

   Class: SimpleScene
   The scene holds a single WebGL shader program and a set of objects 
   that know how to draw themselves.
   
   Parameters to the constructor:
   - gl is a WebGL rendering context created via initWebGL()
   - vertexShaderSource: source code of vertex shader 
   - fragmentShaderSource: source code of fragment shader
   - backgroundColor: RGBA background color (array)
   
*/ 

SimpleScene = function(program, backgroundColor) {

    // remember the program
    this.program = program;
    
    // remember the background color
    this.bgColor = backgroundColor;
    
    // create empty array to store our shapes to be rendered
    this.shapes = new Array();
    
    // a camera used to define the transformation to clip space
    this.camera = new Camera();

    // transformation applied to the entire scene 
    this.worldTransform = mat4.identity();
    
    /* 
       Method: add a shape to the scene
    */
    this.addShape = function(shape) {
        // add shape to the end of the list
        this.shapes.push(shape);
    }
    
    /* 
       Method: draw the scene
    */
    this.draw = function() {
    
        // shortcut to WebGL context
        var gl = this.program.gl;
    
        // clear the color buffer and the depth buffer; enable depth testing
        gl.clearColor(this.bgColor[0], this.bgColor[1], 
                      this.bgColor[2], this.bgColor[3]);                        
        gl.enable(gl.DEPTH_TEST);  
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);  
        
        // use the correct Program; uniforms have to be set *after* this
        this.program.use();
        
        // calculate and set model-view matrix as uniform shader variable
        var mvLocation = gl.getUniformLocation(program.glProgram, 
                                                "modelViewMatrix");
        if(mvLocation == null) {
            window.console.log("Warning: uniform modelViewMatrix not used in shader.");
        } else {
            // model view transform: first apply scene transformation, 
            // then camera transformation
            var mv = mat4.create(this.camera.modelToEye()); 
            mv = mat4.multiply(mv,this.worldTransform);
            gl.uniformMatrix4fv(mvLocation, false, mv);
        }
        
        // calculate and set projection matrix as uniform shader variable
        var prLocation = gl.getUniformLocation(program.glProgram,
                                                "projectionMatrix");
        if(prLocation == null) {
            window.console.log("Warning: uniform projectionMatrix not used in shader.");
        } else {
            var pr = this.camera.eyeToClip();
            gl.uniformMatrix4fv(prLocation, false, pr);
        }

        // go through all shapes and let them draw themselves
        for(var i=0; i<this.shapes.length; i++) {
			this.shapes[i].shape.setUniforms(this.program);
            this.shapes[i].shape.draw(this.program);
        }
        
        // that's it - the buffer swap happens automatically by WebGL
    }

} // end of SimpleScene


