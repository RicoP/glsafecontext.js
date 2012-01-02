#!/bin/sh
interleave base.js -o glsavecontext.js
echo 'compile...' 
java -jar closure-compiler/compiler.jar --js glsavecontext.js --js_output_file glsavecontext.min.js

