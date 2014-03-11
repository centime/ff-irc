
var emit = addon.port.emit;
var on = addon.port.on;


var messagesListArea = document.getElementById('messages-list');
var newMessageArea = document.getElementById('new-message');  
var usersListArea = document.getElementById('users-list');

newMessageArea.onkeyup = function(event) {
    if (event.keyCode == 13) {
      text = newMessageArea.value.replace(/(\r\n|\n|\r)/gm,"");
      emit("say", text);
      newMessageArea.value = '';
    }
  };

on("message", function (from,to,message) {
  var text = from+' : '+message;
  var newLi = document.createElement('li');
  newLi.innerHTML = text;
  messagesListArea.appendChild(newLi);
  //scroll down
  messagesListArea.scrollTop = messagesListArea.scrollHeight;
});

on("names", function (channel,nicks) {
  for (nick in nicks){
    var newLi = document.createElement('li');
    newLi.innerHTML = nick;
    usersListArea.appendChild(newLi);
  }
});

on("open", function (chan) {
  newMessageArea.focus();
});
