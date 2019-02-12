# GraalVm Demonstrations

A collection of subdirectories / sub-projects showing various aspects
of the GraalVM project as time allows.

## compjava

Compiles Java code into a self contained executable jar,
then,
compiles that into a native binary.

Use the build.sh script to call Maven, then the Graal native tool.

## simple-js

A "dash e" type example of js hello world.

## js-on-jvm

A somewhat more realistic example of using some basic Java stuff from Javascript.

Also shows how to debug the script using the Chrome dev tools
(so long as you don't step into Java from JS).

## jvm_with_js

An example of a Java program which uses a Javascript script.

Also shows a debugging session - as you would expect -
so long as you don't expect to step into JS from Java.

## js-good-parts

In which I get fairly idiomatic with the Javascript,
and break things.

E.g. -
* the debugger fails on the second pass through some bean / value object code
* tail call elimination doesn't work
* R.partial seems to use something with limitations in Graal that aren't in "real" JS.

## See Also

https://docs.google.com/document/d/11RirF0Y4YeRU16ODOS5tgERXZqppgmhDEZM4pECpDVg/edit?usp=sharing
