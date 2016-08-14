#!/bin/sh

browserify app/javascripts/ethboxutil.js --standalone ethboxutil -o app/javascripts/dist/ethboxutil.js

truffle build
