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

    /** play with lists and lists of lists */
    const silly_lisp_tricks = function () {

        /** recursively format arrays as S-expressions */
        const a2s = function ( val ) {
            // assume we have actual values and not null / undefined
            return (
                val.forEach ?  // quacks like an array?
                    (
                        '(' +
                        R.join(
                            ' ',
                            R.map(
                                a2s,
                                val
                            )
                        ) +
                        ')'
                    ) :
                    (
                        `${ val }`  // coerce string
                    )
            )
        }

        const NIL = []
        const cons = R.prepend
        const car = R.head
        const cdr = R.tail
        log.info( '--- silly Lisp tricks ---' )
        log.info( `An empty list: ${ a2s( NIL ) }` )
        const a_list = cons(
            'A',
            cons(
                'B',
                cons(
                    'C',
                    NIL
                )
            )
        )
        log.info( `The list: ${ a2s( a_list ) }` )
        log.info( `Still empty list: ${ a2s( NIL ) }` )
        const a_tree = cons(
            a_list,
            cons(
                'shallow',
                cons(
                    a_list,
                    NIL
                )
            )
        )
        log.info( `The tree: ${ a2s( a_tree ) }` )
        // really selling it here!  :-)
        log.info(
            `Getting the 2nd thing from the 3rd thing the hard way: ${
                a2s(
                    car( // -> B
                        cdr( // -> (B C)
                            car( // -> (A B C)
                                cdr(  // -> ((A B C))
                                    cdr( a_tree ) // -> (shallow (...))
                                )
                            )
                        )
                    )
                )
            }`
        )
        // back in the day, some Lisp dialects would let you string As and Ds between C and R:
        const cadaddr = R.compose(
            car,
            cdr,
            car,
            cdr,
            cdr
        )
        // exercise for the reader:  generate the above function from its name -
        // /c([ad]+)r/, compose of map each char in match capture ...
        log.info(
            `Getting the 2nd thing from the 3rd thing somewhat more easily: ${
                a2s(
                    cadaddr( a_tree )
                )
            }`
        )
        log.info( '--- END Lisp tricks ---' )
    }

    /** break the chain of dependency on those injections! */
    const rehab = function() {

        /**
         * Run a query, or at least pretend to.
         * @param connection pretend database connection
         * @param table_meta pretend table metadata, or some other thing to be tramped around, er, injected
         * @param year year, if any, to limit the results.
         * @param acct account, if any, to limit the results.
         */
        const js_service = function ( connection, table_meta, year, acct ) {
            const where = R.join(
                ' and ',
                R.filter(
                    R.identity(),  // non-empty value is truthy
                    [
                        (
                            year &&  // assume year 0 not used
                            ( 'YEAR = ' + year )
                        ),
                        (
                            acct &&
                            ( 'ACCT = ' + acct )
                        ),
                    ]
                )
            )
            log.info(
                `Connect to ${
                    connection
                }, select * from ${
                    table_meta
                } ${
                    where &&
                    ( ' where ' + where )
                }`
            )
        }

        /** run the basic drill on a service method / function */
        const drill_service = function ( actual_work ) {
            // dependencies were supplied earlier ...
            // ... some time later ...
            actual_work(
                2018,
                8600042
            )
            // ... some time later ...
            actual_work( null, null )
            // ... some time later ...
            actual_work(
                null,
                8600042
            )
        }

        log.info( '--- Use a Java service ---')
        const java_service = new jvm.app.DbService(
            jvm.app.connection,
            jvm.app.table_meta
        )
        drill_service( java_service.actual_work )

        log.info( '--- Use a JS service ---')

        /**
         * Run a query, or at least pretend to.
         * @function
         * @param year year, if any, to limit the results.
         * @param acct account, if any, to limit the results.
         */
        const actual_work = R.partial(
            js_service,
            [
                jvm.app.connection,
                jvm.app.table_meta,
            ]
        )

        drill_service( actual_work )

        // OK, so we did pretty much what Java did, so what?

        js_service(
            'alt_connection',
            'ALT_TAB',
            2018,
            8600042
        )

        // this would work in normal js??? (or is this a buggy Ramda version?)
        // const last_year = actual_work( 2018 )
        const last_year = R.partial(
            actual_work,
            [ 2018 ]
        )
        // anyway, at work I rolled my own PFA facility which:
        // - has an explicit "decorator function" to apply parms
        // - allows 0 arity functions to be created
        // - allows trailing parms to be omitted
        // (another story for another day)

        // ... some time later ...
        last_year( 7779999 )

        const my_acct = R.partialRight(
            actual_work,
            [ 555333 ]
        )
        // ... some time later ...
        my_acct( 2010 )
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

    silly_lisp_tricks()

    rehab()

    // TODO - PFA vs D/I anti-pattern
} )()


// *** EOF ***
