#!/bin/sh
cd src/utils/
node constands.js > glmethods.js 
cd ../../
interleave src/glsavecontext.main.js -o glsavecontext.js
echo 'compile...'
java -jar closure-compiler/compiler.jar --js glsavecontext.js --js_output_file glsavecontext.min.js
(echo "/*" | cat - LICENSE.TXT && echo "*/" | cat - && cat glsavecontext.js) > foo~
mv foo~ glsavecontext.js
(echo "/*" | cat - LICENSE.TXT && echo "*/" | cat - && cat glsavecontext.min.js) > foo~
mv foo~ glsavecontext.min.js
