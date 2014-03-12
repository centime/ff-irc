Ugly hacks to use the node-irc lib in the firefox, inside an extension

Using mozSocket (tweaked just a bit) for network connections
Using Browserify to pack the process.EventEmitter class from nodejs, which we then need to apply to mozSocket.
The Browserify-generated code is then to resolve namespace collisions..

The resulting lib/bundle is half automatically generated, half manually patched : read it at your own risks !

to generate your own : cd generate && node generate_bundle.js
you will need browserify installed.