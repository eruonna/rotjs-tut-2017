var Game = function(div) {
  this.div = div;
  this.initialized = false;

  if (!ROT.isSupported()) {
    this.div.innerHTML = "Rot.js is not supported in your browser :-(";
    return;
  }

  this.div.innerHTML = "Rot.js is supported in your browser :-D";
  this.initialized = true;
};

Game.init = function() {
  var div = document.getElementById("game");
  var theGame = new Game(div);

  theGame.run();
};

Game.prototype.run = function() {
  if (!this.initialized) return;

  window.alert("Game running");
};
