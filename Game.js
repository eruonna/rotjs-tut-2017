
Game = {}

Game.init = function() {
  Game._div = document.getElementById("game");

  if (!("ROT" in window)) {
    Game._div.innerHTML = "Failed to load rot.js :-(";
    return;
  }

  if (!ROT.isSupported()) {
    Game._div.innerHTML = "Rot.js is not supported in your browser :-(";
    return;
  }

  Game._div.innerHTML = "";

  Game._display = new Game.Display(Game._div);

  Game._player = { x: 80, y: 25 };

  Game.run();
};

Game.run = function() {
  window.addEventListener('keydown', Game.handleEvent);
  Game.render();
};

Game.render = function() {
  Game._display.clear();
  Game._display.draw(Game._player.x, Game._player.y, '@');
}

Game.update = function() {
}

Game.handleEvent = function (ev) {
  switch (ev.type) {
    case 'keydown':
      var cmd = Game.Keys.getKeyCommand(ev.keyCode);
      if (cmd !== false) {
        ev.preventDefault();
        cmd.run(Game._player);
        Game.update();
        Game.render();
      }
      break;
  }
}
