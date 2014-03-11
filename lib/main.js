const widgets = require("sdk/widget");
const panels = require("sdk/panel");
const URL = require('sdk/url').URL;
const tabs = require('sdk/tabs');
const wutils = require('sdk/window/utils');
const data = require("sdk/self").data ;

const irc = require('./bundle') ;


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

var client;

function start_client(){ 
  var emit = panel.port.emit ;
  // create and connect the client
  client= new irc.Client('chat.freenode.net', 'wutwut', {
      debug: true,
      channels: ['#srymom'],
  });


  client.addListener('message', function (from, to, message) {
    emit('message',from,to,message);
  });

  client.addListener('names', function (channel,nicks) {
    emit('names',channel,nicks);     
  });
  
  panel.port.on("text-entered", function (text) {
      client.say('#srymom',text);
      emit('message','wutwut','#srymom',text)
  });

};

//start_client()

panel.on("show", function() {
   /*var url = URL(tabs.activeTab.url);
   console.log('active: ' + tabs.activeTab.url.split('?')[0]+' : '+tabs.activeTab.title);
*/
  panel.port.emit("show");
});
