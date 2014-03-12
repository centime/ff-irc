const widgets = require("sdk/widget");
const panels = require("sdk/panel");
const URL = require('sdk/url').URL;
const tabs = require('sdk/tabs');
const wutils = require('sdk/window/utils');
const data = require("sdk/self").data ;

const irc = require('./_irc') ;


NICK = 'wutwut' ;
CHAN = '#urmom' ;

var panel = panels.Panel({
    height: 120,
    position: {
      right: 0,
      left: 0,
      bottom: 0
    },
    contentURL: data.url("panel.html"),
});

var widget = widgets.Widget({
  id: "app-link",
  label: "Open the panel",
  contentURL: "http://www.jquery.com/favicon.ico",
  onClick: function() {
    panel.show();
  }
});

var emit = panel.port.emit ;
var on = panel.port.on ;

function start_client(){ 

  // create and connect the client
  var client= new irc.Client('chat.freenode.net', NICK, {
      debug: true,
      channels:[CHAN],
  });


  client.addListener('message', function (from, to, message) {
    emit('message',from,to,message);
  });

  client.addListener('names', function (channel,nicks) {
    emit('names',channel,nicks);     
  });
  
  on("say", function (text) {
      client.say(CHAN,text);
      emit('message',NICK,CHAN,text)
  });  
};

start_client()

panel.on("show", function() {
    emit('open');
});
