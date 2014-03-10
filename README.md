Ugly hacks to use the node-irc lib in the firefox, inside an extension

Using mozSocket for network connections
Using Browserify to pack the process.EventEmitter class from node, which I need to apply to mozSocket.
The Browserify generated code had then to be modified because of namspace collisions..

everything is just currently laying there in a complete mess, be warned, and read it at your own risks.

