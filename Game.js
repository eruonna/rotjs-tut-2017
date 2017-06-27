
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

  Game._player = new Game.Entity({
    x: 80,
    y: 26,
    glyph: Game.Glyph.Player
  }, ['Position', 'Renderable']);

  var npc = new Game.Entity({
    x: 70,
    y: 26,
    glyph: Game.Glyph.NPC
  }, ['Position', 'Renderable']);

  Game._entities = [Game._player, npc];

  Game.run();
};

Game.run = function() {
  window.addEventListener('keydown', Game.handleEvent);
  Game.render();
};

Game.render = function() {
  Game._display.clear();
  for (var i = 0; i < Game._entities.length; i++) {
    if (Game._entities[i].render) {
      Game._entities[i].render(Game._display);
    }
  }
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
