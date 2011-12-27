/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */




/* 

   Class: VertexAttributeBuffer
   Creates a Vertex Buffer Object (VBO) to be used with a 
   specific WebGL vertex program.
    
   Parameters to the constructor:
   - gl is the WebGL context to be used for drawing
   - attrType is the type of attribute, represented by the 
     attribute's name in the shader
   - dataType is the primitive data type used, i.e. gl.FLOAT
   - numElements is the number of primitive data elements per attribute, 
     e.g. 3 for a vec3
   - dataArray is the actual data, e.g. a Float32Array for 
     float-typed attributes      
   
   Results:
   - a WebGL vertex buffer object (VBO) will be created for the specified 
     vertex attribute
   - the data from the dataArray will be copied into the VBO residing in 
     graphics memory; it is safe to delete the dataArray after 
     the constructor call

   
*/ 

VertexAttributeBuffer = function(gl, attrType, dataType, 
                                 numElements, dataArray) {

    // remember context 
    this.gl = gl;

    // store all the required information, but do NOT store the data array 
    this.attributeType = attrType;
    this.dataType = dataType;
    this.numElements = numElements;
    this.numVertices = dataArray.length / this.numElements;
    
    // create the WebGL buffer object and copy the data
    this.glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, dataArray, gl.STATIC_DRAW);
    
    // make this buffer active, given a program that knows
    // which vertex attributes it expects under which ID
    this.makeActive = function(program) {
    
        // shortcut to the WebGL object
        var gl = program.gl;
    
        // get location to which this attribute is bound 
        // in the currently active WebGL program
        var location = gl.getAttribLocation(program.glProgram, attribute);
        if(location < 0) {
            window.console.log("Warning: attribute " + attribute 
                                + " not used in the shader.");
            return;
        } 
            
        // bind the buffer to the current ...?
        gl.bindBuffer(gl.ARRAY_BUFFER, this.glBuffer);

        // which part of the buffer is to be used for this object
        gl.vertexAttribPointer(location, this.numElements, 
                                this.dataType, false, 0, 0);
            
        // enable this attribute
        gl.enableVertexAttribArray(location);
        
    }
}




            