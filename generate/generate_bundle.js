
/*
WARNING
This code has for sole purpose to be a reminder of what I did to make the magic happen. 
I'm affraid it's not suited for further developpement..

I. generate a modified version of irc.js (from node-irc) using mozSocket and process.EventEmitter
II. browserify it
III. Resolve namspace collisions between brwosrify and the ff addon sdk api
IV. Add the needed exports/requires
*/

const fs = require('fs');
const browserify = require('browserify');
var b = browserify();

fs.readFile('node-irc/lib/irc.js', 'utf8', function (err,source) {
  if (err) {
    return console.log(err);
  }
  source = rewrite_irc(source);
  fs.writeFile("_irc.js", source);
  b.add('./_irc.js');
  b.bundle({},function(err,src){
    // resolve namspace collisions between the firefox addon sdk API and browserify
    src = src.replace(/module/g,'moduleBrowserify');
    src = src.replace(/exports/g,'exportsBrowserify');
    src = src.replace(/require/g,'requireBrowserify');

    // add my own exports / requires
    src = src.replace("util.inherits(Client, process.EventEmitter);",
        "util.inherits(Client, process.EventEmitter);\n\
        module.exports = { 'Client': Client};\n");
    src = "var mozSocket = require('./mozSocket3').mozSocket ;\n" + src;
    fs.writeFile("irc_bundle.js", src);
  });
  

});

function rewrite_irc (source) {
    function r(a,b){
        source = source.replace(a,b);
    }
    // remove the inappropriated require / exports
    r("var net  = require('net');","");
    r("var tls  = require('tls');","");
    r("var colors = require('./colors');","");
    r("var replyFor = require('./codes');",
        "var replyFor = require('./node-irc/lib/codes.js');");
    r("exports.colors = colors;","");

    // disable temporarily ssl, just because
    r("if (self.opt.secure) {",
        "if (self.opt.secure) {\n\
            console.log('Not implemented');\n\
        /*\n");
    r("util.log(self.conn.authorizationError);\n\
           }\n\
        });\n",
    "util.log(self.conn.authorizationError);\n\
           }\n\
        });\n\
    */\n")

    // implement the new connexion object
    r("self.conn = net.createConnection(self.opt.port, self.opt.server);",
        "Connection = function(){};\n\
        util.inherits(Connection, process.EventEmitter);\n\
        connection = new Connection ;\n\
        socket = {} ;\n\
        socket.__proto__ = mozSocket ;\n\
        \n\
        socket.onDataReceived = function(aData) {\n\
          this._log(aData);\n\
        };\n\
        socket.onStartRequest = function(aRequest, aContext) {\n\
            this._log('onStartRequest');\n\
            connection.emit('connect');\n\
          };\n\
        socket.onDataAvailable = function(aRequest, aContext, aInputStream, aOffset, aCount) {\n\
            connection.emit('data', this._scriptableInputStream.read(aCount));\n\
            if (this._timeout)\n\
              clearTimeout(this._timeout);\n\
          };\n\
        connection.socket = socket ;\n\
        connection.socket.connect(self.opt.server, self.opt.port);\n\
        self.conn = connection ;\n\
    ");
    // remove theses two function calls ?
    r("self.conn.setTimeout(0);","");
    r("self.conn.setEncoding('utf8');","");
    // writing is now through socket
    r("this.conn.write",
        "this.conn.socket.send"
    );
    return source
}