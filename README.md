Hacking the node-irc lib to build firefox addons.

The generate directory is where the magic happens :

    node generate_utils.js

creates a module _utils_bundle exporting a function inheritsFromEventEmitter, thanks to browserify.

    node generate_mozSocket.js

creates a module _mozSocket exporting a class Connection, which provides an API built to act similarly to node's net module. Events support is done with the _utils_bundle module. Connection doesn't support much of net yet, but is enough for node-irc. Anyway, it wouldn't be hard to extend for further usage.

    node generate_irc.js  

creates a module _irc exporting a class Client, which with luck will behave just like it does in node with node-irc.

    ./generate_all.sh

automated generation of all 3 modules, and move then to the lib directory.

Proof of concept :
A very simple and incomplete demo of an irc client may be installed using ff-irc_demo.xpi
It simply connects itself to chat.freenode.net#urmom, and can send/show messages. The list of users isn't updated when people join/leave.

external sources :
https://github.com/martynsmith/node-irc
http://hg.instantbird.org/experiments/file/d4326febed80/modules/mozSocket.jsm
https://github.com/substack/node-browserify