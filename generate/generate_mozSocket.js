
const fs = require('fs');
const browserify = require('browserify');
var b = browserify();

fs.readFile('./sources/mozSocket.jsm', 'utf8', function (err,source) {
  if (err) {
    return console.log(err);
  }
  source = rewrite_mozSocket(source);
  fs.writeFile("_mozSocket.js", source);

});

function rewrite_mozSocket(source) {
    function r(a,b){
        source = source.replace(a,b);
    }

    // rewrite stuff about Components (patch the lib ?)
   r("const {classes: Cc, interfaces: Ci, utils: Cu} = Components;",
        "const {Cc, Ci, Cu} = require('chrome');"
    );
   r("Services.console.logStringMessage(str);","console.log(str)");
   r("Cu.import(\"resource:///modules/imServices.jsm\");","");

   // set a default delimiter. (patch the lib ?)
    r("let data = this._dataBuffer.split(this._delimiter);",
        "let data = this._dataBuffer.split('\\n');// FIX this._delimiter);"
    );
    
    source = source + "\
    var Connection = function(port, server){\n\
            var socket = {} ;\n\
            socket.__proto__ = mozSocket ;\n\
           \n\
            socket.connect(server, port);\n\
            \n\
            that = this ; \n\
            \n\
            this.write = function(data){\n\
                socket.send(data);\n\
            };\n\
            \n\
            socket.onStartRequest = function(aRequest, aContext) {\n\
                this._log('onStartRequest');\n\
                that.emit('connect');\n\
              };\n\
            socket.onDataAvailable = function(aRequest, aContext, aInputStream, aOffset, aCount) {\n\
                that.emit('data', this._scriptableInputStream.read(aCount));\n\
                if (this._timeout)\n\
                  clearTimeout(this._timeout);\n\
              };\n\
        };\n\
        \n\
    var inheritsFromEventEmitter = require('./_utils_bundle').inheritsFromEventEmitter ;\n\
    inheritsFromEventEmitter(Connection);\n\
    \n\
    module.exports = {\n\
      'Connection':Connection,\n\
      'mozSocket':mozSocket,\n\
  };" ;
  // TODO hacks so that _mozSocket may be required from node
  /*
  r("const {classes: Cc, interfaces: Ci, utils: Cu} = Components;",
    "Components = typeof Components === 'undefined' ? {'classes':{},'interfaces':{},'utils':{'import':function(){}}} : Components;\n\
const Cc = Components.classes ;\n\
const Ci = Components.interfaces ;\n\
const Cu = Components.utils ;\n\
");
  source = source.replace(/let /g,"var ");
  */
    return source
}