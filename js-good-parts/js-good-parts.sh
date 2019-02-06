#!/bin/sh

# show Graal's alternate version of "node" (?) running some JS with Java help,
node --jvm --jvm.classpath=java_support/target/java_support-1.0-SNAPSHOT-jar-with-dependencies.jar --polyglot index.js

# and with some debugging
# node --inspect-brk --jvm --jvm.classpath=java_support/target/java_support-1.0-SNAPSHOT-jar-with-dependencies.jar --polyglot index.js
