// demo using Java code from a JS script

"use strict";

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
    const bake_beans = function () {

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
            hidden_bean.setFoo( 'foozle' )
            hidden_bean.setBar( 'barkeep' )
            hidden_bean.setEtc( 'extra' )
            return Object.freeze( {
                get foo() { return hidden_bean.getFoo() },
                get bar() { return hidden_bean.getBar() },
                get etc() { return hidden_bean.getEtc() },
            } )
        }

        var magic_bean = new jvm.magic_bean()
        log.info( 'A bean ' + magic_bean )
        magic_bean.setFoo( 'foozle' )
        magic_bean.setBar( 'barkeep' )
        magic_bean.setEtc( 'extra' )
        log.info( 'Er, a bean ' + magic_bean )

        const basic_vo = gen_value_obj(
            'foozle',
            'barkeep',
            'extra'
        )
        log.info(
            'A value object ' +
            JSON.stringify( basic_vo )
        )

        const black_magic_bean = gen_wrapped_bean(
            'foozle',
            'barkeep',
            'extra'
        )
        log.info(
            'An alien value object ' +
            JSON.stringify( black_magic_bean )
        )
        log.info( 'Looking at just bar: ' + black_magic_bean.bar )
    }

    log.info( '--- Pass 1 (class loading?) ---' )
    bake_beans()
    log.info( '--- Pass 2 ---' )
    bake_beans()
} )()


// *** EOF ***
