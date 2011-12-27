/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/* 

   Class: Program
   The program holds a set of shaders. During rendering of a scene,
   it is possible to switch between programs by calling their
   respective use() methods.
   
   Parameters to the constructor:
   - gl is a WebGL rendering context created via initWebGL()
   - vertexShaderSource is a string containing the GLSL source code
     of the vertex shader. 
   - fragmentShaderSource is a string containing the GLSL source code
     of the fragment shader. 
   
*/ 

Program = function(gl, vertexShaderSource, fragmentShaderSource) {

    /* 
       Internal Method: check shader compilation status and log error.
       Return values: true (ok), false (error)
    */
    this.checkCompilationStatus = function(shader, name) {
        var gl = this.gl;
        var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!compiled) {
            // Something went wrong during compilation; get the error
            var error = gl.getShaderInfoLog(shader);
            window.console.log("*** Error compiling shader '"
                            +name+"':"+error);
            gl.deleteShader(shader);
            return false;
        }
        return true
    }

    /* 
       Method: Activate this shader program. 
       Allows to switch between multiple programs.
    */
    this.use = function() {

        this.gl.useProgram(this.glProgram);
    }
    
    // remember the name and WebGL rendering context
    this.gl = gl;

    // create a new WebGL program object
    this.glProgram = gl.createProgram();
    
    // compile and attach vertex shader
    vshader = this.gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vshader, vertexShaderSource);
    gl.compileShader(vshader);
    this.checkCompilationStatus(vshader,"vertex shader");
    gl.attachShader(this.glProgram, vshader);

    // compile and attach fragment shader
    fshader = this.gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fshader, fragmentShaderSource);
    gl.compileShader(fshader);
    this.checkCompilationStatus(fshader,"fragment shader");
    gl.attachShader(this.glProgram, fshader);

    // link the program so it can be used
    this.gl.linkProgram(this.glProgram);

}                 




            