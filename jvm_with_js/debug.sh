#!/bin/sh
# run jar under debugger
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=y,address=1044 -jar target/jvm_with_js-1.0-SNAPSHOT-jar-with-dependencies.jar 
