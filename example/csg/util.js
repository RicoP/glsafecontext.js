/*
 * WebGL / Javascript tutorial.
 * Author: Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * (C)opyright 2011 by Hartmut Schirmacher, all rights reserved. 
 *
 */



/*
    Function to create a WebGL render context.
    Parameters: 
    - the ID of the canvas element
    Return value:
    - a WebGL context
    Exceptions:
    - if WebGL context creation failed, an alert window is shown, 
      and the return value is null. 
*/

function initWebGL(canvasName) {

    // the canvas / surface to be drawn to
    var canvas;
    
    // the result object, a WebGL render context
    var gl; 

    // get the canvas DOM node identified by its ID
    canvas = window.document.getElementById(canvasName);
	
    // try to get a WebGL context for this canvas 
    var names = [ "webgl", "experimental-webgl", "moz-webgl", "webkit-3d" ];
    for (var i in names) {
        try { 
            gl = canvas.getContext(names[i]);
            if (gl) { break; }
        } catch (e) { }
    }
    if (!gl) {
        window.alert("Fatal error: could not initialize WebGL context.");
    }
    return gl; 
}

                
/*
    Function to make the current size of the canvas known to WebGL
    Parameters: 
    - a WebGL context returned by initWebGL()
    - the ID of the canvas element
*/
resizeWebGL = function(gl,canvasName) {
    // get the canvas DOM node identified by its ID
    canvas = window.document.getElementById(canvasName);
    // set up the WebGL viewport transformation accoding to the canvas size
    gl.viewport(0,0,canvas.width,canvas.height);
}


/*
    Function to extract the shader source code from an HTML script node
    identified by its ID. 
    Parameters: 
    - the ID of the script node
    Results:
    - the contents of the script node, i.e. the shader source code
*/

getShaderSource = function(id) {

    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var result = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3)
            result += k.textContent;
        k = k.nextSibling;
    }
    return result;
}



/*
 * The code below this comment is:
 * Copyright 2010, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           return window.setTimeout(callback, 1000/60);
         };
})();

/**
 * Provides cancelRequestAnimationFrame in a cross browser way.
 */
window.cancelRequestAnimFrame = (function() {
  return window.cancelCancelRequestAnimationFrame ||
         window.webkitCancelRequestAnimationFrame ||
         window.mozCancelRequestAnimationFrame ||
         window.oCancelRequestAnimationFrame ||
         window.msCancelRequestAnimationFrame ||
         window.clearTimeout;
})();





            
