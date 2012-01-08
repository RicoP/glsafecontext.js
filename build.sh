#!/bin/sh
interleave src/utils/constands.main.js -o src/utils/constands.js
cd src/utils/
node constands.js > glmethods.js 
cd ../../
interleave src/glsavecontext.main.js -o glsavecontext.js
echo 'compile...'
java -jar closure-compiler/compiler.jar --js glsavecontext.js --js_output_file glsavecontext.min.js

