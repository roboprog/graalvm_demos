// demo using Java code from a JS script

"use strict";

const R = require( 'ramda' )

// hack to disable IntelliJ "staircase of doom" formatting:
// @formatter:off

/** some classes from the underlying JVM */
const jvm = Object.freeze( {

    /** app stub with java inits */
    app: Java.type( 'com.roboprogs.java_support.App' ),

    /** log4j handle */
    logger: Java.type( 'org.apache.log4j.Logger' ),

    /** value object anti-pattern example */
    magic_bean: Java.type( 'com.roboprogs.java_support.App.MagicBean' ),

} )

// a common trick - "IIFE" - to avoid making *any* global variables:
// what happens in the IIFE stays in the IIFE
; ( function () {
    jvm.app.config()
    const log = jvm.logger.getLogger( 'index.js' )
    log.info( 'starting index.js' )

    /** fun and games with "beans" and value objects */
    const bake_beans = function ( print ) {

        /**
         * Generate a value object, with minimal boilerplate.
         * @returns {Readonly<{foo: *, bar: *, etc: *}>}
         */
        const gen_value_obj = function( foo, bar, etc ) {
            return Object.freeze( {
                foo,
                bar,
                etc,
            } )
        }

        /**
         * Wrap a java bean in a read only accessor.
         * @returns {Readonly<{foo: *, bar: *, etc: *}>}
         */
        const gen_wrapped_bean = function( foo, bar, etc ) {
            const hidden_bean = new jvm.magic_bean()
            hidden_bean.setFoo( foo )
            hidden_bean.setBar( bar )
            hidden_bean.setEtc( etc )
            return Object.freeze( {
                get foo() { return hidden_bean.getFoo() },
                get bar() { return hidden_bean.getBar() },
                get etc() { return hidden_bean.getEtc() },
            } )
        }

        var magic_bean = new jvm.magic_bean()
        print( 'A bean ' + magic_bean )
        magic_bean.setFoo( 'foozle1' )
        magic_bean.setBar( 'barkeep1' )
        magic_bean.setEtc( 'extra1' )
        print( 'Er, a bean ' + magic_bean )

        const basic_vo = gen_value_obj(
            'foozle2',
            'barkeep2',
            'extra2'
        )
        print(
            'A value object ' +
            JSON.stringify( basic_vo )
        )

        const black_magic_bean = gen_wrapped_bean(
            'foozle3',
            'barkeep3',
            'extra3'
        )
        print(
            'An alien value object ' +
            JSON.stringify( black_magic_bean )
        )
        print( 'Looking at just bar: ' + black_magic_bean.bar )
    }

    /** an output sync - log dummy */
    const dev_null = function () {}

    /**
     * A different way to loop :-)
     * I wanted to see if the Graal version of node does tail call elimination,
     * even though this is a horrible example of something for which
     * a recursive solution is overkill.
     * I learned it does NOT do TCE / TCO,
     * and that the resulting stack overflow is not even something you can catch.
     * @param run - a 0 arity function to call to do something
     * @param remain - a counter of how many times are left to be done
     */
    const final_countdown = function ( run, remain ) {
        if ( remain <= 0 ) {
            return  // === done ===
        }

        run()
        final_countdown(
            run,
            remain - 1
        )
    }

    log.info( '--- Pass 1 (class loading?) ---' )
    bake_beans( log.info )
    log.info( '--- Pass 2 ---' )
    bake_beans( log.info )
    log.info( '--- Spin through a few times with less boundary crossing ---' )
    for ( var idx = 0 ; idx < 20000 ; idx++ ) {
        bake_beans( dev_null )
    }
    log.info( '--- ... A later pass ---' )
    bake_beans( log.info )
    log.info( '--- DONE baking beans ---' )

    log.info( '--- A different kind of quiet spin ---' )
    // Ramda's "apply" (etc) cannot create 0 arity functions,
    // strictly currying, so just use js "bind":
    const run = bake_beans.bind(
        null,  // no "this" needed, nor wanted.
        dev_null
    )
    final_countdown(
        run,
        2000  // but not 5000
    )
    log.info( '--- DONE with partial beans ---' )

} )()


// *** EOF ***
