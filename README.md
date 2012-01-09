glSaVeContext.js
================

One problem with learning WebGL lies in the nature of javascript to accept every kind of function parameter. Even when you call a method with wrong argument types the method will fail silently and you have to prepare yourself for a long debuging session.

This Library makes WebGL much more finicky. It shows your errors much more directly. It checks every method argument parameter for the right type and issues errors on the console. 

usage
-----

Assume you have your regular WebGL context like this

    var gl = document.createElement("canvas").getContext("experimental-webgl")

You get your safe context like this

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

Doing that however with a safe context will result in an error. 

    sgl.clearColor(0,0,0,1); 
    sgl.clear(gl.COLOR_BUFER_BIT); //Error: Argument mask in function clear was expected to be GLbitfield but instead was called with undefined.

This helps you write much more reliable code.

Have fun! 
