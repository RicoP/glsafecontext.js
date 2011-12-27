glSafeContext.js
================

One problem in learning WebGL lays in the nature of javascript to accept every kind of function parameter. Even when you missspell a variable name the WebGL methods accept your statement and simply fail silently. 

This Library makes WebGL behave much more finicky and shows errors of you much more direct. 

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
    sgl.clear(gl.COLOR_BUFER_BIT); //Error: Argument number 0 in function clear must not be undefined!

This helps you writing much more reliable code.

Have fun! 

TODO
----

* check if a WebGL function can return null. 
* check for the correct amount of argument paramters. 
