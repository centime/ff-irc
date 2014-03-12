
const fs = require('fs');
const browserify = require('browserify');
var b = browserify();

fs.readFile('./sources/node-irc/lib/irc.js', 'utf8', function (err,source) {
  if (err) {
    return console.log(err);
  }
  source = rewrite_irc(source);
  fs.writeFile("_irc.js", source);

});

function rewrite_irc (source) {
    function r(a,b){
        source = source.replace(a,b);
    }

    source = "function _log(str){};\n" + source ;
    source = source.replace(/util\.log/g,"_log");
    source = source.replace(/util\.inspect/g,"");

    // remove the inappropriated require / exports
    r("var net  = require('net');",
        "var Connection = require('./_mozSocket').Connection;\n\
        var inheritsFromEventEmitter = require('./_utils_bundle').inheritsFromEventEmitter ;\n");
    r("var util = require('util');","");
    r("var tls  = require('tls');","");
    r("var colors = require('./colors');","");
    r("exports.colors = colors;","");

    // make Client inherit from EventEmitter using our inheritsFromEventEmitter from _util
   r("util.inherits(Client, process.EventEmitter);",
        "inheritsFromEventEmitter(Client);"
        );

    // implement the new Connexion object
    r("self.conn = net.createConnection(self.opt.port, self.opt.server);",
        "self.conn = new Connection(self.opt.port, self.opt.server) ;"
        );

    // disable temporarily ssl, just because
    r("if (self.opt.secure) {",
        "if (self.opt.secure) {\n\
            console.log('Not implemented');\n\
        /*\n");
    r("log(self.conn.authorizationError);\n\
           }\n\
        });\n",
    "log(self.conn.authorizationError);\n\
           }\n\
        });\n\
    */\n")

    // remove theses ? why not ?
    r("self.conn.setTimeout(0);","");
    r("self.conn.setEncoding('utf8');","");
    r("process.EventEmitter.call(this);","");


    source = source + "module.exports = { 'Client': Client};\n" ;
    return source
}