#!/bin/sh

# show Graal's alternate version of "node" (?) running some JS with Java help,
node --jvm --polyglot jvm-user.js
# and with some debugging
node --inspect-brk --jvm --polyglot jvm-user.js
