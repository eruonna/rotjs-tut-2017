var Game = function(div) {
  this._div = div;
  this._div.innerHTML = '';

  this._display = new Game.Display(this._div);

  this._player = { x: 80, y: 25 };
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
  window.addEventListener('keydown', this.handleEvent.bind(this));
  this.render();
};

Game.prototype.render = function() {
  this._display.clear();
  this._display.draw(this._player.x, this._player.y, '@');
}

Game.prototype.update = function() {
}

Game.prototype.handleEvent = function (ev) {
  switch (ev.type) {
    case 'keydown':
      var cmd = Game.Keys.getKeyCommand(ev.keyCode);
      if (cmd !== false) {
        ev.preventDefault();
        cmd.run(this._player);
        this.update();
        this.render();
      }
      break;
  }
}
