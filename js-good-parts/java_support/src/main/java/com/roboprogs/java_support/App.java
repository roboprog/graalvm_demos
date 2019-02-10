package com.roboprogs.java_support;

import com.google.common.io.Resources;
import org.apache.log4j.Logger;
import org.apache.log4j.PropertyConfigurator;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


// hack to disable IntelliJ "staircase of doom" formatting:
// @formatter:off

/**
 * Example to support a (Graal enabled) "node" program.
 */
public class App 
{

    private static final Logger log = Logger.getLogger( App.class );

    /** pretend database connection */
    public static String connection;

    /** pretend table metadata, or some other thing to be tramped around, er, injected */
    public static String table_meta;

    /** run any needed configuration */
    public static void config() {
        PropertyConfigurator.configure(
            Resources.getResource( "log4j.properties" )
        );
        log.info( "Logging initialized" );

        // abuse "App" as some kind of D/I context.
        App.connection = "a_schema:fake_db";
        App.table_meta = "TRANSACT_INFO";
        log.info( "Faux DB dependencies initialized" );
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

    /** pretend service of some kind with an injection dependency */
    public static class DbService {

        /** pretend database connection */
        private final String connection;

        /** pretend table metadata, or some other thing to be tramped around, er, injected */
        private final String table_meta;

        /**
         * Hold this stuff for later, OK?
         * @param connection pretend database connection
         * @param table_meta pretend table metadata, or some other thing to be tramped around, er, injected
         */
        public DbService(
            String connection,
            String table_meta
        ) {
            this.connection = connection;
            this.table_meta = table_meta;
        }

        /**
         * Run a query, or at least pretend to.
         * @param year year, if any, to limit the results.
         * @param acct account, if any, to limit the results.
         */
        public void actual_work(
            Integer year,
            Integer acct
        ) {
            // obviously, a real query builder of some kind belongs here
            String [] ands = {
                (
                    ( year != null ) ?
                        ( "YEAR = " + year ) :
                        null
                ),
                (
                    ( acct != null ) ?
                        ( "ACCT = " + acct ) :
                        null
                ),
            };
            String where = String.join(
                " and ",
                Arrays.stream(
                    ands
                ).filter( ( s ) ->
                    ( s != null )
                ).collect(
                    Collectors.toList()
                )
            );
            log.info(
                String.format(
                    "Connect to %s, select * from %s %s",
                    this.connection,
                    this.table_meta,
                    (
                        where.isEmpty() ?
                            "" :
                            ( " where " + where )
                    )
                )
            );
        }

    }

}
