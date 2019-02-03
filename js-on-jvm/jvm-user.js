// demo using Java code from a JS script

"use strict";

// hack to disable IntelliJ "staircase of doom" formatting:
// @formater:off

/** some classes from the underlying JVM */
const jvm = Object.freeze( {

    /** fixed precision number support */
    bd: Java.type( 'java.math.BigDecimal' ),

    /** java runtime system */
    sys: Java.type( 'java.lang.System' ),

} )

// a common trick - "IIFE" - to avoid making *any* global variables:
// what happens in the IIFE stays in the IIFE
; ( function () {

    /** some numbers to play with */
    const nums = Object.freeze( {

        /** ecmascript numbers */
        es: Object.freeze( {
            point1: 0.1,
            point2: 0.2,
            point3: 0.3,
        } ),

        /** java numbers */
        j: Object.freeze( {
            tenth: jvm.bd.valueOf( 10, 2 ),
            fifth: jvm.bd.valueOf( 20, 2 ),
            three_tenths: jvm.bd.valueOf( 30, 2 )
        } ),

    } )

    jvm.sys.out.println(
        `Point1: ${
            nums.es.point1.toPrecision( 2 ) 
        }, Tenth: ${
            nums.j.tenth
        }`
    )
    jvm.sys.out.println(
        `Point2: ${
            nums.es.point2.toPrecision( 2 )
        }, Fifth: ${
            nums.j.fifth
        }`
    )
    jvm.sys.out.println(
        `JS .1 + .2 is .3: ${
            ( nums.es.point1 + nums.es.point2 ) === nums.es.point3
        }`
    )
    jvm.sys.out.println(
        `Java .1 + .2 is .3: ${
            nums.j.tenth.add( nums.j.fifth ).equals( nums.j.three_tenths )
        }`
    )
} )()


// *** EOF ***