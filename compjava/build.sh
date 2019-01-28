#!/bin/sh -x
# WARNING: GraalVM requires a bit of unixy / POSIXy (C compiler stuff)
# to run the compile to native bit,
# so it doesn't play nice with Windows.
# Ain't nobody runnin' command line utilties on Winders, anyway :-)

# allow wildcard for version
# alas, no -o option for output file name
mvn clean package
( cd target ; native-image -jar compjava-*-with-dependencies.jar )
ls -aldrt target/*


# *** EOF ***
