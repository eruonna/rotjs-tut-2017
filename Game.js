
Game = {}

Game.width = 160
Game.height = 50

Game.initialized = false
Game.fontsLoaded = false

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

  //ROT.RNG.setSeed(1500009600743);
  console.log(ROT.RNG.getSeed());

  Game._div.innerHTML = "";

  Game._scheduler = new ROT.Scheduler.Simple();
  Game._engine = new ROT.Engine(Game._scheduler);

  Game._mode = null;
  Game._entities = [];

  Game._display = new Game.Display(Game._div, Game.width, Game.height);

  Game._map = new Game.Map(Game.width, Game.height);

  Game._player = new Game.Entity({
    x: Game._map._upStair.x,
    y: Game._map._upStair.y,
    name: 'player',
    glyph: Game.Glyph.Player
  }, ['Position', 'Renderable', 'PlayerActor']);

  Game.addEntity(Game._player);

  Game.initialized = true;
  Game.run();
};

Game.run = function() {
  if (!Game.fontsLoaded) { return; }
  if (!Game.initialized) { Game.init(); }
  window.addEventListener('keydown', Game.handleEvent);
  Game.switchMode(Game.Mode.playing);
  Game.render();
};

Game.render = function() {
  if (Game._mode !== null) {
    Game._mode.render(Game._display);
  }
}

Game.update = function() {
}

Game.handleEvent = function (ev) {
  if (Game._mode !== null) {
    Game._mode.handleInput(ev);
  }
}

Game.switchMode = function (newMode) {
  if (Game._mode !== null) {
    Game._mode.exit();
  }

  Game._mode = newMode;

  if (Game._mode !== null) {
    Game._mode.enter();
    Game._mode.render(Game._display);
  }
}

Game.addEntity = function (e) {
  Game._entities.push(e);
  if (e.act) {
    Game._scheduler.add(e, true);
  }
}

Game.getEntityAt = function (x, y) {
  for (var i = 0; i < Game._entities.length; i++) {
    if (Game._entities[i]._x === x && Game._entities[i]._y === y) {
      return Game._entities[i];
    }
  }
  return false;
}
