package com.roboprogs.java_support;

import com.google.common.io.Resources;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;


// hack to disable IntelliJ "staircase of doom" formatting:
// @formatter:off

/**
 * Example to support a (Graal enabled) "node" program.
 */
public class App 
{

    private static final Logger log = Logger.getLogger( App.class );

    /** run any needed configuration */
    public static void config() {
        PropertyConfigurator.configure(
            Resources.getResource( "log4j.properties" )
        );
        log.info( "Logging initialized" );
    }

    /** beans, beans, the magical fruit ... and anti-pattern */
    public static class MagicBean {

        private String foo;

        private String bar;

        private String etc;

        // generated cruft...

        @Override public String toString() {
            return "MagicBean{" +
                    "foo='" + foo + '\'' +
                    ", bar='" + bar + '\'' +
                    ", etc='" + etc + '\'' +
                    '}';
        }
        public String getFoo() {
            return foo;
        }
        public void setFoo( String foo ) {
            this.foo = foo;
        }
        public String getBar() {
            return bar;
        }
        public void setBar( String bar ) {
            this.bar = bar;
        }
        public String getEtc() {
            return etc;
        }
        public void setEtc( String etc ) {
            this.etc = etc;
        }

    }

}
