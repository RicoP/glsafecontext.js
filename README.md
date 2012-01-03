glSafeContext.js
================

One problem with learning WebGL lays in the nature of javascript to accept every kind of function parameter. Even when you call a methoud with wrong argument types the method will fail silently you have to prepare yourself with a long debuging session in order to find the bug. 

This Library makes WebGL behave much more finicky and shows errors of you much more direct. It checks every method argument parameter for the right type and issues wrong datatypes much more direct. 

usage
-----

Assume you have your regulat WebGL context like that

    var gl = canvas.getContext("experimental-webgl"); 

You get your safe context like that 

    var sgl = gl.getSafeContext(); 

When you want to clear your buffer you write in regular WebGL 

    gl.clearColor(0,0,0,1); 
    gl.clear(gl.COLOR_BUFFER_BIT); 

this results in a black screen. 
However, when you misspell a variable and write 

    gl.clear(gl.COLOR_BUFER_BIT); 

instead of 

    gl.clear(gl.COLOR_BUFFER_BIT); 

WebGL will simply do nothing instead of pointing out that something went wrong. 

Doing that however with a safe context will result in a error. 

    sgl.clearColor(0,0,0,1); 
    sgl.clear(gl.COLOR_BUFER_BIT); //Error: Argument mask in function clear was expected to be GLbitfield but instead was called with undefined.

This helps you writing much more reliable code.

Have fun! 


