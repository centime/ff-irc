const widgets = require("sdk/widget");
const panels = require("sdk/panel");
const data = require("sdk/self").data ;
//const {Cc,Cu, Ci} = require("chrome");


const irc = require('./bundle') ;


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

console.log('**********************YEAH*********************')

function test_connect(){ 
  var bot = new irc.Client('chat.freenode.net', 't_fu_t', {
      debug: true,
      channels: ['#srymom', '#test'],
  });
  bot.addListener('message', function (from, to, message) {

      bot.say('#srymom',message+' your mom.');

    console.log(from + ' => ' + to + ': ' + message);
  });

  bot.addListener('names', function (channel,nicks) {
    console.log(channel+':');
    console.log(nicks)
      
  });
};
