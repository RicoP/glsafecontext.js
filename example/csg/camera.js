/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

   Class: Camera
   The camera represents a transformation from model / world coordinates 
   into eye / camera coordinates as well as a successive projection
   into clip coordinates.
   
   Several methods allow to define or manipulate these transformations
   in a convenient fashion.
   
*/ 

Camera = function() {

    // transformation matrix model --> eye
    this.toEye = mat4.identity();
    // projection matrix eye --> clip space
    this.projection = mat4.identity();
    
    /*
       define a modelview transformation that makes the camera
       look from a certain point towards a certain target point.
       - eye [3 floats]: eye point
       - target [3 floats]: point to look at
       - up [3 floats]: "up" direction, typically [0,1,0]
    */
    this.lookAt = function(eye,target,up) {
        mat4.identity(this.toEye);
        mat4.lookAt(eye,target,up,this.toEye);
    }
    
    /* 
        define a perspective projection 
        - fovy [float]: field of view in Y direction in degrees
        - aspect [float]: aspect ratio of the window to be used (width : height)
        - near [float]: distance from the eye point to the near clipping plane
        - far [float]: distance from the eye point to the far clipping plane
    */
    this.perspective = function(fovy,aspect,near,far) {
        window.console.log("Camera.perspective("+fovy+", "+aspect+", "
                            +near+", "+far+")");
        mat4.identity(this.projection);
        mat4.perspective(fovy,aspect,near,far,this.projection);
    }
    
    /* 
        define an orthographic projection 
        - left,right [float]: planes defining the visible domain in X direction
        - bot,top [float]: planes defining the visible domain in Y direction
        - near,far [float]: planes defining the visible domain in Z direction
    */
    this.orthographic = function(left,right,bot,top,near,far) {
        window.console.log("Camera.orthographic("+left+", "+right+", "+bot
                            +", "+top+", "+near+", "+far+")");
        mat4.identity(this.projection);
        mat4.ortho(left,right,bot,top,near,far,this.projection);
    }
    
    // return the transformation from model coords to eye coords
    this.modelToEye = function() {
        return this.toEye;
    }
    
    // return the transformation from eye coords to model coords (inverse!)
    this.eyeToModel = function() {
        var r = mat4.create(this.toEye);
        mat4.inverse(r);
        return r;
    }

    // return the transformation (projection) from eye coords to clip coords
    this.eyeToClip = function() { 
        return this.projection;
    }

}


