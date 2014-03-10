const widgets = require("sdk/widget");
const panels = require("sdk/panel");
const data = require("sdk/self").data ;
//const {Cc,Cu, Ci} = require("chrome");

//*/
const irc = require('./bundle') ;
/*/
var mozSocket = require('mozSocket3').mozSocket

mozSocket._log = console.log ;

mozSocket.onConnectionHeard = function() {
  console.log('Connected');
};
          
mozSocket.onConnectionTimedOut = function() {
  console.log('Timed out');
};
          
mozSocket.onConnectionReset = function() {
  console.log('Connexion reset.');
};
          
mozSocket.onDataReceived = function(aData) {
  console.log(aData);
};
//*/

var socket = require('sock').socket

var panel = panels.Panel({
    width: 800,
    height: 200,
    contentURL: data.url("panel.html"),
});

var widget = widgets.Widget({
  id: "app-link",
  label: "Open the panel",
  contentURL: "http://www.jquery.com/favicon.ico",
  panel:panel,
  onClick: function() {
     test_connect()
  }
});

console.log('****************************************************')

function test_connect(){ 
  var bot = new irc.Client('chat.freenode.net', 't_fu_t', {
      debug: true,
      channels: ['#srymom', '#test'],
  });
  bot.addListener('message', function (from, to, message) {

      bot.say('#srymom',message+' your mom.');

    console.log(from + ' => ' + to + ': ' + message);
  });
};
