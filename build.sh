#!/bin/sh
cd src/utils/
node constands.js > glmethods.js 
cd ../../
interleave src/glsavecontext.main.js -o glsavecontext.js
