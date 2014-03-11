
var messagesListArea = document.getElementById('messages-list');
var newMessageArea = document.getElementById('new-message');  
var usersListArea = document.getElementById('users-list');

newMessageArea.onkeyup = function(event) {
    if (event.keyCode == 13) {
      text = newMessageArea.value.replace(/(\r\n|\n|\r)/gm,"");
      addon.port.emit("text-entered", text);
      newMessageArea.value = '';
    }
  };

var on = addon.port.on;

on("show", function (arg) {
  newMessageArea.focus();
});

on("message", function (from,to,message) {
  var newLi = document.createElement('li');
  newLi.innerHTML = from+' : '+message;
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
