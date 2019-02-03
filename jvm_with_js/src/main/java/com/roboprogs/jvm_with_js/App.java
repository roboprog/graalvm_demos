package com.roboprogs.jvm_with_js;

import com.google.common.base.Charsets;
import com.google.common.io.Resources;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.Value;

import java.util.function.Consumer;


// hack to disable IntelliJ "staircase of doom" formatting:
// @formatter:off

/**
 * Example to run some EcmaScript/Javascript from Java.
 */
public class App 
{

    private static final Logger log = Logger.getLogger( App.class );

    /** start up the demo */
    public static void main( String[] args ) {
        PropertyConfigurator.configure(
            Resources.getResource( "log4j.properties" )
        );
        run_js(
            "js-helper.js",
            ( result ) -> {
                log.info( "Result: " + result );
                result.execute();
            }
        );
    }

    /**
     * Run a .js script and pass the result value/proxy into a consumer.
     * Note that in a production app,
     * you would probably NOT close the script context immediately,
     * but keep a pool of these, which could be interacted with
     * via the result (a function or object-as-namespace for multiple functions).
     * @param name
     *      the name of the script (resource file) to be loaded and run.
     * @param block
     *      a block to receive the result of the script.
     */
    private static void run_js(
        String name,
        Consumer <
            Value
        > block
    ) {
        // do this like a Ruby program would:  hide the setup and tear-down -
        // just give me the name, and I'll pass you the result!
        try (
            Context js_ctx = Context.newBuilder(
            ).allowNativeAccess(
                true
/* TODO - investigate why this isn't recognized
            ).option(
                "js.Strict",
                "true"
*/
            ).build()
        ) {
            block.accept(
                js_ctx.eval(
                    "js",
                    Resources.toString(
                        Resources.getResource( name ),
                        Charsets.UTF_8
                    )
                )
            );
        } catch ( Throwable e ) {
            log.error(
                "Script " + name + " broke",
                e
            );
        }
    }

}
