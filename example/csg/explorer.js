/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */


/* 

    Object that handles mouse / keyboard interactions and 
    uses them to manipulate the scene's world transformation
    to allow interactive exploration.
    
*/

SceneExplorer = function(canvas,scene) {

    // the canvas to which this object is attached
    this.canvas = canvas;
    // the scene to be manipulate
    this.scene = scene;
    // the scene's camera
    this.camera = scene.camera;
    // the last known positions of the mouse
    this.startX = 0;
    this.startY = 0;
    // the current mouse dragging mode
    this.dragMode = "rotation";
    // has the dragging operation started yet?
    this.draggingStarted = false;
    // mouse sensitivities for rotation and zoom operations
    this.rotSensitivity = 0.03;
    this.zoomSensitivity = 0.01;
    
    // function to start a mouse drag operation
    // dragType: "rotate", "translate", "zoom"
    this.startDragging = function(x, y, dragType) {
    
        //window.console.log("start dragging at " + x + "," + y);
        
        this.startX = x;
        this.startY = y;
        if(dragType)
            this.dragMode = dragType;
        this.draggingStarted = true;
            
    }
   
    // stop the dragging operation after it was started with startDragging()
    // return values:
    // - true: a redraw is recommended
    // - false: no redraw necessary
    this.stopDragging = function(x,y) {
        
        // first make sure that all events have been processed
        result = this.continueDragging(x,y);
    
        // check if order of operations is ok
        if(!this.draggingStarted) {
            window.console.log("ERROR in SceneTransformation: dragging has not been started.");
            return;
        }
    
        // end of dragging operation
        this.draggingStarted = false;
        
        return result;
    
    }
        
  
    // function to update a drag operation, i.e. while the mouse is moved 
    //   and a mouse button is pressed down
    // return values:
    // - true: a redraw is recommended
    // - false: no redraw necessary
    this.continueDragging = function(x, y) {

        // if we haven't started any operation, ignore mouse move
        if(!this.draggingStarted) 
            return false;
    
        // calculate the mouse distance 
        var deltaX = x - this.startX;
        var deltaY = y - this.startY;
        
        // remember the new mouse position
        this.startX = x;
        this.startY = y;
        
        // if virtually no mouse movement, skip the calculations
        if(Math.abs(deltaX) < 2 && Math.abs(deltaY) < 2) 
            return;
        
        if(this.dragMode == "rotate") {

            // rotation around camera's X and Y axes
            var degreesY = deltaX * this.rotSensitivity;
            var degreesX = deltaY * this.rotSensitivity;
        
            
            // camera system x and y axes 
            var xAxis = vec3.create([1,0,0]);
            var yAxis = vec3.create([0,1,0]);
            // transformation from camera coords to model coords
            var camToModel = mat4.create(this.camera.eyeToModel());
            // eliminate translation component of matrix
            camToModel[12] = 0; camToModel[13] = 0; camToModel[14] = 0;
            // transform axes
            mat4.multiplyVec3(camToModel,xAxis,xAxis);
            mat4.multiplyVec3(camToModel,yAxis,yAxis);
            //window.console.log("rotate " + degreesX + " around x axis: [" 
            //        + xAxis[0] + "," + xAxis[1] + "," + xAxis[2] + "]");
            //window.console.log("rotate " + degreesY + " around y axis: [" 
            //        + yAxis[0] + "," + yAxis[1] + "," + yAxis[2] + "]");
            // rotation around those axes
            var rotX = mat4.identity();
            var rotY = mat4.identity(); 
            mat4.rotate(rotX,degreesX,xAxis,rotX);
            mat4.rotate(rotY,degreesY,yAxis,rotY);
            // add to transformation chain from the right
            mat4.multiply(rotX, this.scene.worldTransform, 
                                this.scene.worldTransform);
            mat4.multiply(rotY, this.scene.worldTransform, 
                                this.scene.worldTransform);
            
        } else if(this.dragMode == "translate") {
            // translate along camera's X and Y axex
            window.console.log("translation not implemented yet.");
            
        } else if(this.dragMode == "zoom") {
            window.console.log("zoom not implemented yet.");
            
        }
        
        // the scene should be redrawn eventually
        return true;
        
    }
    
    // attach a scene explorer to the mouse events of a specific canvas
    // this means that the canvas's event handlers will be set to 
    // call the respective functions of the SceneExplorer
    this.attachToCanvas = function(canvas) {

        // install hook into this object within the canvas
        canvas.sceneExplorer = this;
        
        // event handler for "mouse down": this is where the mouse 
        // button bindings are defined
        canvas.mouseDown = function(event) {
        
            var exp = this.sceneExplorer;
        
            // window.console.log("mouse down!");
            var button = "unknown";
            
            // translate mouse button events depending on browser
            if(!event.which) {
                // Micrsosoft/IE buttons 
                if(event.button & 4) button = "middle";
                if(event.button & 2) button = "right";
                if(event.button & 1) button = "left";
            } else {
                // rest of the world
                if(event.which == 3) button = "right";
                if(event.which == 2) button = "middle";
                if(event.which == 1) button = "left";
            }
            
            if(button == "left") {
                exp.startDragging(event.clientX, event.clientY, "rotate");
            } else if(button == "right") {
                exp.startDragging(event.clientX, event.clientY, "zoom");
            } else if(button == "middle") {
                exp.startDragging(event.clientX, event.clientY, "zoom");
            } else {
                window.console.log("could not recognize mouse button!");
            }
        }
    
        // event handler for "mouse up"
        canvas.mouseUp = function(event) {
        
            // within this function "this" refers to the canvas
            var exp = this.sceneExplorer;
            
            if(exp.stopDragging(event.clientX, event.clientY))
                exp.scene.draw();
        }
    
        // event handler for "mouse move"
        canvas.mouseMove = function(event) {

            // within this function "this" refers to the canvas
            var exp = this.sceneExplorer;
            
            if(exp.continueDragging(event.clientX, event.clientY))
                exp.scene.draw();
        }
                
        // install event handlers
        canvas.onmousedown=canvas.mouseDown;
	    canvas.onmouseup=canvas.mouseUp;
	    canvas.onmousemove=canvas.mouseMove;  
    
    }
    
    // constructor attaches explorer to the specified canvas
    this.attachToCanvas(this.canvas);
    
}






            
