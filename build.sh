#!/bin/sh
cd src/utils/
node constands.js > glmethods.js 
cd ../../
interleave src/glsafecontext.main.js -o glsafecontext.js
