var Game = function(div) {
  this.div = div;

  this.div.innerHTML = "Rot.js is supported in your browser :-D";
};

Game.init = function() {
  var div = document.getElementById("game");

  if (!("ROT" in window)) {
    div.innerHTML = "Failed to load rot.js :-(";
    return;
  }

  if (!ROT.isSupported()) {
    div.innerHTML = "Rot.js is not supported in your browser :-(";
    return;
  }

  var theGame = new Game(div);

  theGame.run();
};

Game.prototype.run = function() {
  window.alert("Game running");
};
