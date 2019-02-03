// demo calling into javascript from java

"use strict";

// hack to disable IntelliJ "staircase of doom" formatting:
// @formatter:off

// IIFE
; ( function () {
    console.log( 'The script is about to finish' )
    return function () {
        console.log( 'But you can still use stuff from the script' )
    }
} )()


// *** EOF ***
